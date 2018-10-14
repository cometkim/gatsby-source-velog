// @flow

import type { VelogUser, VelogPost, VelogPostComment } from 'types/velog';

import crypto from 'crypto';
import axios from 'axios';

const BASE_URL = 'https://api.velog.io';

const onError = (error: any, message?: string) => {
    if (message) {
        console.error('\n' + message);
    }

    console.error(error);
    process.exit(1);
};

type RootNodeParams = {
    actions: {
        createNode: (arg: {}) => void,
    },
}

type RootNodeOptions = {|
    username: string,
|}

type VelogResource = VelogUser | VelogPost | VelogPostComment
type NodeSource<T: VelogResource> = T | {
    parent: ?string,
    children: ?Array<string>,
    id: string,
    internal: {
        type: string,
        contentDigest: string,
        contentType?: string,
    },
}

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
    const buildNodeSource = <T: VelogResource>({ source, type }: { source: T, type: string }): NodeSource<T>  => ({
        ...source,
        parent: null,
        children: [],
        // $FlowFixMe: API는 벨로퍼트님이 고쳐주실 거야...
        id: source.user_id ? source.user_id : source.id,
        internal: {
            type: `Velog${type[0].toUpperCase()}${type.slice(1)}`, // Capitalized type
            contentDigest: crypto.createHash('md5').update(JSON.stringify(source)).digest('hex'),
        },
    });

    const myPostIds = new Set<string>();
    try {
        const url = `${BASE_URL}/posts/@${username}`;
        const { data: myPosts } = await axios.get(url);

        console.log(`\n${myPosts.length} posts are found for @${username}`);

        myPosts.map(post => myPostIds.add(post.id));
    } catch (e) {
        onError(e);
    }


    // VelogPost 노드 소스 만들기
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
    // VelogPost 노드에 컨텐츠 타입 정보 삽입
    // MIME 타입이 text/markdown 이면 gatsby-transformer-remark 사용 가능
    postNodeSources = postNodeSources.map(source => ({
        ...source,
        internal: {
            ...source.internal,
            contentType: source.is_markdown ? 'text/markdown' : 'text/html',
        },
    }));


    // VelogComment 노드 만들기
    let commentNodeSources: Array<NodeSource<VelogPostComment>> = [];
    try {
        const commentPromises = postNodeSources.map(async node => {
            // $FlowFixMe: 이거 잘 하면 추론할 수 있을 것 같은데 나한텐 난이도가 너무 높다..
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


    // VelogUser 노드 만들기
    const usernames = new Set<string>();
    [...postNodeSources, ...commentNodeSources]
        .map(node => node.user)
        // 왠진 모르겠지만 null 유저가 섞여온다. 어디서 나온놈이냐
        .filter(user => user.username)
        .forEach(user => usernames.add(user.username));
    
    console.log(`\n${usernames.size} users are found`);
    console.log([...usernames]);

    let userNodeSources: Array<NodeSource<VelogUser>> = [];
    try {
        const userPromises = [...usernames].map(async username => {
            const url = `${BASE_URL}/users/@${username}`;
            const { data: user } = await axios.get<void, VelogUser>(url);

            userNodeSources = [
                ...userNodeSources,
                buildNodeSource({ source: user, type: 'user' }),
            ];
        });
        await Promise.all(userPromises);
    } catch (e) {
        onError(e, 'An error occurs in fetching all users from velog');
    }
    // $FlowFixMe: API 바뀌면 지워질 코드
    userNodeSources = userNodeSources.map(source => {
        delete source.user_id;
        return source;
    });


    // VelogPost, VelogComment -> VelogUser
    const sourcesBelongsToUser = [...postNodeSources, ...commentNodeSources].map(source => {
        const userId = source.user.id;
        delete source.user;
        return {
            ...source,
            user___NODE: userId,
        };
    });
    // TODO: VelogUser -> VelogPost, VelogComment
    // TODO: VelogPost -> VelogComment


    // 끝~
    [...userNodeSources, ...sourcesBelongsToUser].forEach(source => createNode(source));
};
