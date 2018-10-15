// @flow

import crypto from 'crypto';

// 참고: Gatsby 플러그인들은 fetch 보다 axios 를 선호하는 편,
// 뭐 강제는 아니지만 이왕이면 의존성 라이브러리가 적어질 수 있는 방향이 좋겠죠.
import axios from 'axios';

import type {
    VelogUser,
    VelogPost,
    VelogPostComment,
    VelogResource,
} from 'types/velog';

const BASE_URL = 'https://api.velog.io';

const onError = (error: any, message?: string) => {
    if (message) {
        console.error('\n' + message);
    }
    console.error(error);
    process.exit(1);
};

type NodeSource<T: VelogResource> = T & {
    parent: ?string,
    children: ?Array<string>,
    id: string,
    internal: {
        type: string,
        contentDigest: string,
        contentType?: string,
    },
}

type RootNodeParams = {
    actions: {
        createNode: (source: NodeSource<any>) => void,
    },
}

type RootNodeOptions = {|
    username: string,
|}

exports.sourceNodes = async (
    {
        actions: {
            createNode,
        },
    }: RootNodeParams,
    {
        username,
    }: RootNodeOptions,
) => {
    // # 시작하기 전에
    //
    // GatsbyJS 라이프 사이클의 `sourceNodes` 메서드는 데이터 노드 구성을 위한 인터페이스를 제공합니다.
    // 다음과 같은 JS Object 구성 후, 인자의 `actions.createdNode` 메서드로 넘겨주면 데이터 노드가 생성됩니다.
    //
    // - id: 관례적으로 UUID 형식을 사용합니다.
    //  이 코드에선 Velog가 이미 ID 형식이 UUID여서 그대로 사용했으나, 그렇지 않다면 유니크한 정보를 인자의 `createNodeId` 메서드로 넘겨 고유 UUID를 생성해서 사용합니다.
    //
    // - `${type}Id`: 관례적으로 원래 가지고 있던 ID는 타입 정보와 결합해서 이런식으로 만들어 둡니다.
    //
    // - internal: 노드의 메타데이터가 들어갑니다.
    //   - type: 관례적으로 `소스+타입` 형식으로 구성합니다. (예시: `VelogPost`, 이 노드들로 `VelogPost`, `allVelogPost` 쿼리가 만들어집니다.)
    //   - contentDigest: 관례적으로 소스를 통째로 해싱해서 넣으면 됩니다.
    //   - content: 컨텐츠 내용이 있다면 여기에 넣습니다.
    //   - contentType: 컨텐츠의 MIME 타입 정보를 넣습니다.
    //   - 예를 들면, `contentType: 'text/markdown'`인 노드를 만들면 gatsby-transformer-remark 플러그인이 content를 가져가 MarkdownRemark 노드를 만드는 데 사용합니다.
    //
    const buildNodeSource = <T: VelogResource>({ source, type }: { source: T, type: string }): NodeSource<T>  => ({
        ...source,
        parent: null,
        children: [],
        // $FlowFixMe: API는 벨로퍼트님이 고쳐주실 거야...
        id: source.user_id ? source.user_id : source.id,
        internal: {
            type: `Velog${type[0].toUpperCase()}${type.slice(1)}`, // Capitalized type
            contentDigest: crypto
                .createHash('md5')
                .update(JSON.stringify(source))
                .digest('hex'),
        },
    });


    // 1. Post에서 부터 시작해 봅시다.
    //   일단 옵션으로 부터 받은 username 컨텍스트로 모든 작성 글을 긁어 옵니다.
    //
    const myPostIds = new Set<string>();
    try {
        const url = `${BASE_URL}/posts/@${username}`;
        const { data: myPosts } = await axios.get(url);

        console.log(`\n${myPosts.length} posts are found for @${username}`);

        myPosts.map(post => myPostIds.add(post.id));
    } catch (e) {
        onError(e);
    }


    // 2. VelogPost 노드 소스 만들기
    //   개인적으로 선호하는 immutable + async + Promise.all 코드를 사용했는데,
    //   느리기도 느리거니와 API에 Rate Limit 걸려있으면 바로 터집니다.
    //
    let postNodeSources: Array<NodeSource<VelogPost>> = [];
    try {
        const postPromises = [...myPostIds].map(async postId => {
            const url = `${BASE_URL}/posts/${postId}`;
            const { data: post } = await axios.get<void, VelogPost>(url);

            postNodeSources = [
                ...postNodeSources,
                buildNodeSource({ source: post, type: 'post' }),
            ];
        });
        await Promise.all(postPromises);
    } catch (e) {
        onError(e, '\nAn error occurs in fetching all posts from velog');
    }


    // 2.1. VelogPost 노드 소스에 컨텐츠 타입 정보 삽입
    //   포스트는 마크다운 컨텐츠를 가지고 있으니까 internal 필드를 적절히 수정해줍시다.
    //   그리고 필요 없어진 프로퍼티를 delete로 완전히 제거합니다. 놔두면 GraphQL 쿼리 스키마가 지저분해집니다.
    //
    postNodeSources = postNodeSources.map(source => {
        const content = source.body;
        delete source.body;
        return {
            ...source,
            internal: {
                ...source.internal,
                content,
                contentType: source.is_markdown ? 'text/markdown' : 'text/html',
            },
        };
    });


    // 3. VelogComment 노드 소스 만들기
    //   포스트로 부터 이어서 커멘트를 받아올 수 있습니다.
    //   마찬가지로 순회하면서 커멘트 노드들을 만들어 줍니다.
    //
    let commentNodeSources: Array<NodeSource<VelogPostComment>> = [];
    try {
        const commentPromises = postNodeSources.map(async node => {
            const url = `${BASE_URL}/posts/${node.id}/comments`;
            const { data: comments } = await axios.get<void, Array<VelogPostComment>>(url);

            console.log(`\n${comments.length} comments are found for ${node.title} (${node.id})`);

            commentNodeSources = [
                ...commentNodeSources,
                ...comments.map(comment => buildNodeSource({ source: comment, type: 'comment' })),
            ];
        });
        await Promise.all(commentPromises);
    } catch (e) {
        onError(e, '\nAn error occurs in fetching all comments from velog');
    }


    // 4. VelogUser 노드 소스 만들기
    //   한 가지 주의할 점은, Gatsby는 서버가 아니라는 점입니다.
    //   전체 데이터를 몽땅 스냅샷 찍을 수도 있지만, 굳이 그럴 필요 없이 용도에 맞춰 필요한 데이터만 구성하는 것이 더 낫습니다.
    //

    // 4.1. 작성글과 커멘트로부터 사용자명 찾기
    //   어차피 전체 사용자 받는 API도 따로 없겠다, 지금까지 불러온 글과 댓글에 있는 사용자 목록만 추립니다.
    //
    const usernames = new Set<string>();
    [...postNodeSources, ...commentNodeSources]
        .map(node => node.user)
        // 왠진 모르겠지만 null 유저가 섞여온다. 어디서 나온놈이냐
        .filter(user => user.username)
        .forEach(user => usernames.add(user.username));
    
    console.log(`\n${usernames.size} users are found`);
    console.log([...usernames]);


    // 4.2. 관계 정보를 담기 위한 객체
    //   글과 댓글에 딸려오는 사용자 정보에 id가 없네요...
    //
    const usernameToId: { [username: string]: string } = {};


    // 4.3. VelogUser 노드 소스 만들기
    //
    let userNodeSources: Array<NodeSource<VelogUser>> = [];
    try {
        const userPromises = [...usernames].map(async username => {
            const url = `${BASE_URL}/users/@${username}`;
            const { data: user } = await axios.get<void, VelogUser>(url);

            usernameToId[username] = user.user_id;

            userNodeSources = [
                ...userNodeSources,
                buildNodeSource({ source: user, type: 'user' }),
            ];
        });
        await Promise.all(userPromises);
    } catch (e) {
        onError(e, 'An error occurs in fetching all users from velog');
    }


    // 5. 관계 매핑
    //   노드 객체를 구성할 때 `${원하는필드명}___NODE`처럼 프로퍼티를 두어 노드 간의 관계를 표현할 수 있습니다.
    //   연결하기 까다로운 API도 여기서 미리 삽질해서 충분히 쿼리하기 쉬운 형태로 만들어 두는 게 좋습니다.
    //

    // VelogPost, VelogComment -> VelogUser
    const sourcesBelongsToUser = [...postNodeSources, ...commentNodeSources].map(source => {
        const user = source.user;
        console.log(user);
        delete source.user;
        return {
            ...source,
            user___NODE: usernameToId[user.username],
        };
    });
    // TODO: VelogUser -> VelogPost, VelogComment
    // TODO: VelogPost -> VelogComment


    // 6. createNode 해주면 끝~
    //   저는 각각 모아서, 정리하고, 한 번에 해줬는데,
    //   이러면 빌드할 때 메모리 낭비가 무진장 심하겠죠!
    //   열심히 데이터 구성과 최적화 사이에서 갈등해봅시다
    //
    [...userNodeSources, ...sourcesBelongsToUser].forEach(source => createNode(source));
};
