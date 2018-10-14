// @flow

type ISO8601 = string;

export type VelogUser = {
    // id 가 되어야함. 벨로퍼트님이 고쳐주실거야...
    // id: string,
    user_id: string,
    username: string,
    display_name: string,
    short_bio: string,
    thumbnail: string,
}

export type VelogPostMetadata = {
    code_theme: string,
    short_description: ?string,
}

export type VelogPost = {
    id: string,
    title: string,
    body: string,
    url_slug: string,
    thumbnail: string,
    is_markdown: boolean,
    is_temp: boolean,
    created_at: ISO8601,
    updated_at: ISO8601,
    tags: Array<string>,
    categories: Array<string>,
    likes: number,
    comments_count: number,
    user: VelogUser,
    meta: VelogPostMetadata,
}

export type VelogPostComment = {
    id: string,
    text: string,
    likes: number,
    meta_json: ?string,
    reply_to: ?string,
    level: number,
    replies_count: number,
    created_at: ISO8601,
    updated_at: ISO8601,
    user: VelogUser,
}
