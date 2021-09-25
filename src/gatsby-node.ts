import type { GatsbyNode } from 'gatsby';
import { createRemoteFileNode } from 'gatsby-source-filesystem';
import type { PluginOptions } from './types';
import { makeClient } from './client';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
  Joi,
}) => {
  return Joi.object({
    baseUrl: Joi.string().default('https://velog.io'),
    endpoint: Joi.string().default('https://v2.velog.io/graphql'),
    username: Joi.string().required(),
    // TODO
    // includeTags: Joi.array().items(Joi.string()).optional(),
  });
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({
  actions,
  schema,
}, options) => {
  // Must be validated by pluginOptionsSchema
  const { baseUrl } = options as unknown as Required<PluginOptions>;

  actions.createTypes([
    schema.buildObjectType({
      name: 'VelogUser',
      interfaces: ['Node'],
      extensions: {
        infer: false,
      },
      fields: {
        velogId: 'String!',
        velogUrl: {
          type: 'String!',
          resolve(source: { username: string }) {
            return `${baseUrl}/@${source.username}`;
          },
        },
        username: 'String!',
        displayName: 'String!',
        bio: 'String',
        aboutHtml: 'String',
        isCertified: 'Boolean!',
        thumbnail: {
          type: 'File',
          extensions: {
            link: {},
          },
        },
        socialProfile: {
          type: 'VelogUserSocialProfile!',
          resolve(source: { socialProfile: unknown }) {
            return source.socialProfile;
          },
        },
        posts: {
          type: '[VelogPost!]!',
          resolve(source: { velogId: string }, _args, context) {
            return context.nodeModel.runQuery({
              type: 'VelogPost',
              query: {
                filter: {
                  author: {
                    velogId: { eq: source.velogId },
                  },
                },
              },
              firstOnly: false,
            });
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'VelogUserSocialProfile',
      fields: {
        url: 'String',
        email: 'String',
        github: 'String',
        facebook: 'String',
        twitter: 'String',
      },
    }),
    schema.buildObjectType({
      name: 'VelogTag',
      interfaces: ['Node'],
      extensions: {
        infer: false,
      },
      fields: {
        velogId: 'String!',
        velogUrl: {
          type: 'String!',
          resolve(source: { owner: { username: string }, name: string }) {
            return `${baseUrl}/@${source.owner.username}?tag=${source.name}`;
          },
        },
        owner: {
          type: 'VelogUser!',
          extensions: {
            link: {},
          },
        },
        name: 'String!',
        description: 'String',
        thumbnail: {
          type: 'File',
          extensions: {
            link: {},
          },
        },
        posts: {
          type: '[VelogPost!]!',
          resolve(source: { name: string }, _args, context) {
            return context.nodeModel.runQuery({
              type: 'VelogPost',
              query: {
                filter: {
                  tags: {
                    elemMatch: {
                      name: { eq: source.name },
                    },
                  },
                },
              },
              firstOnly: false,
            });
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'VelogPost',
      interfaces: ['Node'],
      extensions: {
        infer: false,
      },
      fields: {
        velogId: 'String!',
        velogUrl: {
          type: 'String!',
          resolve(source: { slug: string, author: { username: string } }) {
            return `${baseUrl}/@${source.author.username}/${source.slug}`;
          },
        },
        slug: 'String!',
        title: 'String!',
        rawContent: 'String!',
        shortDescription: 'String!',
        thumbnail: {
          type: 'String',
          extensions: {
            link: {},
          },
        },
        publishedAt: {
          type: 'Date!',
          extensions: {
            dateformat: {},
          },
        },
        updatedAt: {
          type: 'Date!',
          extensions: {
            dateformat: {},
          },
        },
        author: {
          type: 'VelogUser!',
          extensions: {
            link: {
              by: 'velogId',
              from: 'author.velogId',
            },
          },
        },
        tags: {
          type: '[VelogTag!]!',
          extensions: {
            link: {
              by: 'name',
            },
          },
        },
        series: {
          type: 'VelogPostSeries',
          resolve(source: {
            velogId: string,
            series: { velogId: string } | null,
          }) {
            return source.series && { ...source.series, postId: source.velogId };
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'VelogPostSeries',
      fields: {
        index: {
          type: 'Int!',
          resolve(source: {
            postId: string,
            seriesPosts: Array<{ index: number, item: { velogId: string } }>,
          }) {
            return source.seriesPosts
              .find(post => post.item.velogId === source.postId)?.index;
          },
        },
        node: {
          type: 'VelogSeries!',
          extensions: {
            link: {
              by: 'velogId',
              from: 'velogId',
            },
          },
        }
      },
    }),
    schema.buildObjectType({
      name: 'VelogSeries',
      interfaces: ['Node'],
      extensions: {
        infer: false,
      },
      fields: {
        velogId: 'String!',
        velogUrl: {
          type: 'String!',
          resolve(source: { owner: { username: string }, slug: string }) {
            return `${baseUrl}/${source.owner.username}/series/${source.slug}`;
          },
        },
        name: 'String!',
        description: 'String',
        slug: 'String!',
        thumbnail: {
          type: 'File',
          extensions: {
            link: {},
          },
        },
        owner: {
          type: 'VelogUser!',
          extensions: {
            link: {
              by: 'velogId',
              from: 'owner.velogId',
            },
          },
        },
        posts: {
          type: '[VelogPost!]!',
          resolve(source: { posts: Array<{ item: { velogId: string } }> }, _args, context) {
            return context.nodeModel.runQuery({
              type: 'VelogPost',
              query: {
                filter: {
                  velogId: {
                    in: source.posts.map(post => post.item.velogId),
                  },
                },
              },
              firstOnly: false,
            });
          },
        },
      },
    }),
  ]);
};

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions,
  store,
  cache,
  reporter,
  createNodeId,
  createContentDigest,
}, options) => {
  const { createNode } = actions;

  type Source = { id: string } & Record<string, unknown>;

  // Type util to unwrap Promise
  type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

  // Type util to eliminate non-existence nullables
  type UnwrapElement<T> = T extends Array<infer U> ? Array<NonNullable<U>> : never;
  function unwrapElements<T extends any[]>(arr: T): UnwrapElement<T> {
    return arr as unknown as UnwrapElement<T>;
  }

  // Must be validated by pluginOptionsSchema
  const {
    endpoint,
    username,
  } = options as unknown as Required<PluginOptions>;

  const client = makeClient(endpoint);
  const userResult = await client.getUserByUsername({ username });
  const user = userResult.user!;
  const userProfile = user.profile!;
  const userSource: Source = {
    ...user,
    ...userProfile,
    id: createNodeId(`VelogUser:${user.velogId}`),
  };
  if (userProfile.thumbnail) {
    const thumbnailNode = await createRemoteFileNode({
      url: userProfile.thumbnail,
      store,
      cache,
      reporter,
      createNode,
      createNodeId,
    });
    userSource.thumbnail = thumbnailNode.id;
  } else {
    delete userSource['thumbnail'];
  }
  createNode({
    ...userSource,
    parent: null,
    children: [],
    internal: {
      type: 'VelogUser',
      contentDigest: createContentDigest(userSource),
    },
  });

  const tagsResult = await client.getTagsByUsername({ username });
  const tags = tagsResult.userTags!.tags || [];
  const tagSourcing = unwrapElements(tags).map(async tag => {
    const tagSource: Source = {
      ...tag,
      id: createNodeId(`VelogTag:${tag.velogId}`),
      owner: userSource.id,
    };
    if (tag.thumbnail) {
      const thumbnailNode = await createRemoteFileNode({
        url: tag.thumbnail,
        store,
        cache,
        reporter,
        createNode,
        createNodeId,
      });
      tagSource.thumbnail = thumbnailNode.id;
    } else {
      delete tagSource['thumbnail'];
    }
    createNode({
      ...tagSource,
      parent: null,
      children: [],
      internal: {
        type: 'VelogTag',
        contentDigest: createContentDigest(tagSource),
      },
    });
  });
  await Promise.all(tagSourcing);

  let postCursor: string | null = null;
  const postCount = tagsResult.userTags!.postCount || 0;
  type PostResult = Awaited<ReturnType<typeof client.getPostsByUsername>>;
  const postSources: UnwrapElement<PostResult['posts']> = [];
  while (postSources.length < postCount) {
    const postsResult = await client.getPostsByUsername({ username, cursor: postCursor });
    const current = unwrapElements(postsResult.posts!);
    for (const source of current) {
      postSources.push(source);
    }
    const last = current.slice(-1)[0] ?? null;
    if (last?.velogId == null) {
      break;
    }
    postCursor = last.velogId as string | null;
  }
  const postSourcing = postSources.map(async post => {
    const postSource: Source = {
      ...post,
      id: createNodeId(`VelogPost:${post.velogId}`),
    };
    if (post.thumbnail) {
      const thumbnailNode = await createRemoteFileNode({
        url: post.thumbnail,
        store,
        cache,
        reporter,
        createNode,
        createNodeId,
      });
      postSource.thumbnail = thumbnailNode.id;
    } else {
      delete postSource['thumbnail'];
    }
    createNode({
      ...postSource,
      parent: null,
      children: [],
      internal: {
        type: 'VelogPost',
        mediaType: 'text/markdown',
        content: post.rawContent ?? '',
        contentDigest: createContentDigest(postSource),
      },
    });
  });
  await Promise.all(postSourcing);

  const seriesResult = await client.getSeriesListByUsername({ username });
  const seriesSourcing = unwrapElements(seriesResult.seriesList!).map(async series => {
    const seriesSource: Source = {
      ...series,
      id: createNodeId(`VelogSeries:${series.velogId}`),
    };
    if (series.thumbnail) {
      const thumbnailNode = await createRemoteFileNode({
        url: series.thumbnail,
        store,
        cache,
        reporter,
        createNode,
        createNodeId,
      });
      seriesSource.thumbnail = thumbnailNode.id;
    } else {
      delete seriesSource['thumbnail'];
    }
    createNode({
      ...seriesSource,
      parent: null,
      children: [],
      internal: {
        type: 'VelogSeries',
        contentDigest: createContentDigest(seriesSource),
      },
    });
  });
  await Promise.all(seriesSourcing);
};
