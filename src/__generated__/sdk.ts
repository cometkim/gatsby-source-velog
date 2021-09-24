import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { gql } from 'graphql-request';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  JSON: any;
};

export type Comment = {
  __typename?: 'Comment';
  created_at: Maybe<Scalars['Date']>;
  deleted: Maybe<Scalars['Boolean']>;
  has_replies: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  level: Maybe<Scalars['Int']>;
  likes: Maybe<Scalars['Int']>;
  replies: Maybe<Array<Maybe<Comment>>>;
  replies_count: Maybe<Scalars['Int']>;
  text: Maybe<Scalars['String']>;
  user: Maybe<User>;
};

export type LinkedPosts = {
  __typename?: 'LinkedPosts';
  next: Maybe<Post>;
  previous: Maybe<Post>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty: Maybe<Scalars['String']>;
  appendToSeries: Maybe<Scalars['Int']>;
  createPostHistory: Maybe<PostHistory>;
  createSeries: Maybe<Series>;
  editComment: Maybe<Comment>;
  editPost: Maybe<Post>;
  editSeries: Maybe<Series>;
  likePost: Maybe<Post>;
  mergeTag: Maybe<Scalars['Boolean']>;
  postView: Maybe<Scalars['Boolean']>;
  removeComment: Maybe<Scalars['Boolean']>;
  removePost: Maybe<Scalars['Boolean']>;
  removeSeries: Maybe<Scalars['Boolean']>;
  unlikePost: Maybe<Post>;
  unregister: Maybe<Scalars['Boolean']>;
  update_about: Maybe<UserProfile>;
  update_email_rules: Maybe<UserMeta>;
  update_profile: Maybe<UserProfile>;
  update_social_info: Maybe<UserProfile>;
  update_thumbnail: Maybe<UserProfile>;
  update_velog_title: Maybe<VelogConfig>;
  writeComment: Maybe<Comment>;
  writePost: Maybe<Post>;
};


export type MutationAppendToSeriesArgs = {
  post_id: Scalars['ID'];
  series_id: Scalars['ID'];
};


export type MutationCreatePostHistoryArgs = {
  body: Scalars['String'];
  is_markdown: Scalars['Boolean'];
  post_id: Scalars['ID'];
  title: Scalars['String'];
};


export type MutationCreateSeriesArgs = {
  name: Scalars['String'];
  url_slug: Scalars['String'];
};


export type MutationEditCommentArgs = {
  id: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationEditPostArgs = {
  body: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  is_markdown: Maybe<Scalars['Boolean']>;
  is_private: Maybe<Scalars['Boolean']>;
  is_temp: Maybe<Scalars['Boolean']>;
  meta: Maybe<Scalars['JSON']>;
  series_id: Maybe<Scalars['ID']>;
  tags: Maybe<Array<Maybe<Scalars['String']>>>;
  thumbnail: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  url_slug: Maybe<Scalars['String']>;
};


export type MutationEditSeriesArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
  series_order: Maybe<Array<Maybe<Scalars['ID']>>>;
};


export type MutationLikePostArgs = {
  id: Scalars['ID'];
};


export type MutationMergeTagArgs = {
  merge_to: Maybe<Scalars['String']>;
  selected: Maybe<Scalars['String']>;
};


export type MutationPostViewArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveCommentArgs = {
  id: Scalars['ID'];
};


export type MutationRemovePostArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveSeriesArgs = {
  id: Scalars['ID'];
};


export type MutationUnlikePostArgs = {
  id: Scalars['ID'];
};


export type MutationUnregisterArgs = {
  token: Scalars['String'];
};


export type MutationUpdate_AboutArgs = {
  about: Scalars['String'];
};


export type MutationUpdate_Email_RulesArgs = {
  notification: Scalars['Boolean'];
  promotion: Scalars['Boolean'];
};


export type MutationUpdate_ProfileArgs = {
  display_name: Scalars['String'];
  short_bio: Scalars['String'];
};


export type MutationUpdate_Social_InfoArgs = {
  profile_links: Scalars['JSON'];
};


export type MutationUpdate_ThumbnailArgs = {
  url: Maybe<Scalars['String']>;
};


export type MutationUpdate_Velog_TitleArgs = {
  title: Scalars['String'];
};


export type MutationWriteCommentArgs = {
  comment_id: Maybe<Scalars['ID']>;
  post_id: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationWritePostArgs = {
  body: Maybe<Scalars['String']>;
  is_markdown: Maybe<Scalars['Boolean']>;
  is_private: Maybe<Scalars['Boolean']>;
  is_temp: Maybe<Scalars['Boolean']>;
  meta: Maybe<Scalars['JSON']>;
  series_id: Maybe<Scalars['ID']>;
  tags: Maybe<Array<Maybe<Scalars['String']>>>;
  thumbnail: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  url_slug: Maybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  body: Maybe<Scalars['String']>;
  comments: Maybe<Array<Maybe<Comment>>>;
  comments_count: Maybe<Scalars['Int']>;
  created_at: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  is_markdown: Maybe<Scalars['Boolean']>;
  is_private: Maybe<Scalars['Boolean']>;
  is_temp: Maybe<Scalars['Boolean']>;
  last_read_at: Maybe<Scalars['Date']>;
  liked: Maybe<Scalars['Boolean']>;
  likes: Maybe<Scalars['Int']>;
  linked_posts: Maybe<LinkedPosts>;
  meta: Maybe<Scalars['JSON']>;
  recommended_posts: Maybe<Array<Maybe<Post>>>;
  released_at: Maybe<Scalars['Date']>;
  series: Maybe<Series>;
  short_description: Maybe<Scalars['String']>;
  tags: Maybe<Array<Maybe<Scalars['String']>>>;
  thumbnail: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['Date']>;
  url_slug: Maybe<Scalars['String']>;
  user: Maybe<User>;
  views: Maybe<Scalars['Int']>;
};

export type PostHistory = {
  __typename?: 'PostHistory';
  body: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['Date']>;
  fk_post_id: Maybe<Scalars['ID']>;
  id: Maybe<Scalars['ID']>;
  is_markdown: Maybe<Scalars['Boolean']>;
  title: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _version: Maybe<Scalars['String']>;
  auth: Maybe<User>;
  comment: Maybe<Comment>;
  getStats: Maybe<Stats>;
  lastPostHistory: Maybe<PostHistory>;
  post: Maybe<Post>;
  postHistories: Maybe<Array<Maybe<PostHistory>>>;
  posts: Maybe<Array<Maybe<Post>>>;
  readingList: Maybe<Array<Maybe<Post>>>;
  searchPosts: Maybe<SearchResult>;
  series: Maybe<Series>;
  seriesList: Maybe<Array<Maybe<Series>>>;
  subcomments: Maybe<Array<Maybe<Comment>>>;
  tag: Maybe<Tag>;
  tags: Maybe<Array<Maybe<Tag>>>;
  trendingPosts: Maybe<Array<Maybe<Post>>>;
  unregister_token: Maybe<Scalars['String']>;
  user: Maybe<User>;
  userTags: Maybe<UserTags>;
  velog_config: Maybe<VelogConfig>;
};


export type QueryCommentArgs = {
  comment_id: Maybe<Scalars['ID']>;
};


export type QueryGetStatsArgs = {
  post_id: Scalars['ID'];
};


export type QueryLastPostHistoryArgs = {
  post_id: Scalars['ID'];
};


export type QueryPostArgs = {
  id: Maybe<Scalars['ID']>;
  url_slug: Maybe<Scalars['String']>;
  username: Maybe<Scalars['String']>;
};


export type QueryPostHistoriesArgs = {
  post_id: Maybe<Scalars['ID']>;
};


export type QueryPostsArgs = {
  cursor: Maybe<Scalars['ID']>;
  limit: Maybe<Scalars['Int']>;
  tag: Maybe<Scalars['String']>;
  temp_only: Maybe<Scalars['Boolean']>;
  username: Maybe<Scalars['String']>;
};


export type QueryReadingListArgs = {
  cursor: Maybe<Scalars['ID']>;
  limit: Maybe<Scalars['Int']>;
  type: Maybe<ReadingListOption>;
};


export type QuerySearchPostsArgs = {
  keyword: Scalars['String'];
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  username: Maybe<Scalars['String']>;
};


export type QuerySeriesArgs = {
  id: Maybe<Scalars['ID']>;
  url_slug: Maybe<Scalars['String']>;
  username: Maybe<Scalars['String']>;
};


export type QuerySeriesListArgs = {
  username: Maybe<Scalars['String']>;
};


export type QuerySubcommentsArgs = {
  comment_id: Maybe<Scalars['ID']>;
};


export type QueryTagArgs = {
  name: Scalars['String'];
};


export type QueryTagsArgs = {
  cursor: Maybe<Scalars['ID']>;
  limit: Maybe<Scalars['Int']>;
  sort: Scalars['String'];
};


export type QueryTrendingPostsArgs = {
  limit: Maybe<Scalars['Int']>;
  offset: Maybe<Scalars['Int']>;
  timeframe: Maybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Maybe<Scalars['ID']>;
  username: Maybe<Scalars['String']>;
};


export type QueryUserTagsArgs = {
  username: Maybe<Scalars['String']>;
};


export type QueryVelog_ConfigArgs = {
  username: Maybe<Scalars['String']>;
};

export type ReadCountByDay = {
  __typename?: 'ReadCountByDay';
  count: Maybe<Scalars['Int']>;
  day: Maybe<Scalars['Date']>;
};

export type ReadingListOption =
  | 'LIKED'
  | 'READ';

export type SearchResult = {
  __typename?: 'SearchResult';
  count: Maybe<Scalars['Int']>;
  posts: Maybe<Array<Maybe<Post>>>;
};

export type Series = {
  __typename?: 'Series';
  created_at: Maybe<Scalars['Date']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Maybe<Scalars['String']>;
  posts_count: Maybe<Scalars['Int']>;
  series_posts: Maybe<Array<Maybe<SeriesPost>>>;
  thumbnail: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['Date']>;
  url_slug: Maybe<Scalars['String']>;
  user: Maybe<User>;
};

export type SeriesPost = {
  __typename?: 'SeriesPost';
  id: Scalars['ID'];
  index: Maybe<Scalars['Int']>;
  post: Maybe<Post>;
};

export type Stats = {
  __typename?: 'Stats';
  count_by_day: Maybe<Array<Maybe<ReadCountByDay>>>;
  total: Maybe<Scalars['Int']>;
};

export type Tag = {
  __typename?: 'Tag';
  created_at: Maybe<Scalars['String']>;
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Maybe<Scalars['String']>;
  posts_count: Maybe<Scalars['Int']>;
  thumbnail: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  created_at: Maybe<Scalars['Date']>;
  email: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  is_certified: Maybe<Scalars['Boolean']>;
  profile: Maybe<UserProfile>;
  series_list: Maybe<Array<Maybe<Series>>>;
  updated_at: Maybe<Scalars['Date']>;
  user_meta: Maybe<UserMeta>;
  username: Maybe<Scalars['String']>;
  velog_config: Maybe<VelogConfig>;
};

export type UserMeta = {
  __typename?: 'UserMeta';
  email_notification: Maybe<Scalars['Boolean']>;
  email_promotion: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  about: Maybe<Scalars['String']>;
  created_at: Maybe<Scalars['Date']>;
  display_name: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  profile_links: Maybe<Scalars['JSON']>;
  short_bio: Maybe<Scalars['String']>;
  thumbnail: Maybe<Scalars['String']>;
  updated_at: Maybe<Scalars['Date']>;
};

export type UserTags = {
  __typename?: 'UserTags';
  posts_count: Maybe<Scalars['Int']>;
  tags: Maybe<Array<Maybe<Tag>>>;
};

export type VelogConfig = {
  __typename?: 'VelogConfig';
  id: Scalars['ID'];
  logo_image: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
};

export type GetTagsByUsernameQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetTagsByUsernameQuery = { __typename?: 'Query', userTags: Maybe<{ __typename?: 'UserTags', postCount: Maybe<number>, tags: Maybe<Array<Maybe<{ __typename?: 'Tag', name: Maybe<string>, description: Maybe<string>, thumbnail: Maybe<string>, velogId: string }>>> }> };

export type GetUserByUsernameQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetUserByUsernameQuery = { __typename?: 'Query', user: Maybe<{ __typename?: 'User', username: Maybe<string>, velogId: string, isCertified: Maybe<boolean>, profile: Maybe<{ __typename?: 'UserProfile', thumbnail: Maybe<string>, displayName: Maybe<string>, bio: Maybe<string>, aboutHtml: Maybe<string>, socialProfiles: Maybe<any> }> }> };

export type GetPostsByUsernameQueryVariables = Exact<{
  username: Scalars['String'];
  cursor: Maybe<Scalars['ID']>;
}>;


export type GetPostsByUsernameQuery = { __typename?: 'Query', posts: Maybe<Array<Maybe<{ __typename?: 'Post', thumbnail: Maybe<string>, title: Maybe<string>, tags: Maybe<Array<Maybe<string>>>, velogId: string, shortDescription: Maybe<string>, slug: Maybe<string>, publishedAt: Maybe<any>, updatedAt: Maybe<any>, rawContent: Maybe<string>, author: Maybe<{ __typename?: 'User', username: Maybe<string>, velogId: string }>, series: Maybe<{ __typename?: 'Series', velogId: string }> }>>> };


export const GetTagsByUsernameDocument = gql`
    query getTagsByUsername($username: String!) {
  userTags(username: $username) {
    tags {
      velogId: id
      name
      description
      thumbnail
    }
    postCount: posts_count
  }
}
    `;
export const GetUserByUsernameDocument = gql`
    query getUserByUsername($username: String!) {
  user(username: $username) {
    velogId: id
    username
    isCertified: is_certified
    profile {
      displayName: display_name
      bio: short_bio
      thumbnail
      aboutHtml: about
      socialProfiles: profile_links
    }
  }
}
    `;
export const GetPostsByUsernameDocument = gql`
    query getPostsByUsername($username: String!, $cursor: ID) {
  posts(username: $username, cursor: $cursor) {
    velogId: id
    thumbnail
    title
    shortDescription: short_description
    slug: url_slug
    tags
    publishedAt: released_at
    updatedAt: updated_at
    rawContent: body
    author: user {
      velogId: id
      username
    }
    series {
      velogId: id
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getTagsByUsername(variables: GetTagsByUsernameQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTagsByUsernameQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTagsByUsernameQuery>(GetTagsByUsernameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTagsByUsername');
    },
    getUserByUsername(variables: GetUserByUsernameQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserByUsernameQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserByUsernameQuery>(GetUserByUsernameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUserByUsername');
    },
    getPostsByUsername(variables: GetPostsByUsernameQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPostsByUsernameQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPostsByUsernameQuery>(GetPostsByUsernameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPostsByUsername');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;