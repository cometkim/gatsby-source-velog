import type { GatsbyNode } from 'gatsby';
import { createRemoteFileNode } from 'gatsby-source-filesystem';
import { Condition } from '@cometjs/core';
import type { PluginOptions } from './types';
import { makeClient } from './client';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
  Joi,
}) => {
  return Joi.object({
    baseUrl: Joi.string().default('https://velog.io'),
    endpoint: Joi.string().default('https://v2.velog.io/graphql'),
    username: Joi.string().required(),
    includeTags: Joi.array().items(Joi.string()).optional(),
  });
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({
  actions,
}) => {
  const gql = String.raw;
  const { createTypes } = actions;

  createTypes(gql`
    type VelogTag implements Node {
      velogId: String!
      velogUrl: String!
      owner: VelogUser! @link
      name: String!
      description: String
      thumbnail: File @link
      posts: [VelogPost!]! @link(by: "velogId")
    }

    type VelogUser implements Node @dontInfer {
      velogId: String!
      velogUrl: String!
      username: String!
      displayName: String!
      bio: String
      aboutHtml: String
      isCertified: Boolean!
      thumbnail: File @link
      socialProfile: VelogUserSocialProfile!
      posts: [VelogPost!]! @link(by: "velogId")
    }

    type VelogUserSocialProfile {
      url: String
      email: String
      github: String
      facebook: String
      twitter: String
    }

    type VelogSeries implements Node {
      velogId: String!
      velogUrl: String!
      thumbnail: File
      owner: VelogUser! @link(by: "velogId")
      posts: [VelogPost!]! @link(by: "velogId")
    }

    type VelogPost implements Node {
      velogId: String!
      velogUrl: String!
      slug: String!
      title: String!
      rawContent: String!
      shortDescription: String!
      thumbnail: File
      publishedAt: Date! @dateformat
      updatedAt: Date! @dateformat
      author: VelogUser! @link(by: "velogId")
      tags: [VelogTag!]! @link(by: "name")
      series: VelogSeries
    }
  `);
};

export const createResolvers: GatsbyNode['createResolvers'] = async ({
  createResolvers,
}, options) => {
  // Must be validated by pluginOptionsSchema
  const { baseUrl, username } = options as unknown as Required<PluginOptions>;

  createResolvers({
    VelogUser: {
      velogUrl: {
        type: 'String!',
        resolve(source: { username: string }) {
          return `${baseUrl}/@${source.username}`;
        },
      },
    },
    VelogTag: {
      velogUrl: {
        type: 'String!',
        resolve(source: { name: string }) {
          return `${baseUrl}/@${username}?tag=${source.name}`;
        },
      },
    },
  });
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

  // Must be validated by pluginOptionsSchema
  const {
    endpoint,
    username,
  } = options as unknown as Required<PluginOptions>;

  const client = makeClient(endpoint);
  const userResult = await client.getUserByUsername({ username });
  const user = userResult.user!;
  const userProfile = user.profile!;

  const userSource: { id: string } & Record<string, unknown> = {
    ...user,
    ...userProfile,
    id: createNodeId(`VelogUser:${user.id}`),
    velogId: user.id,
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

  const tagSourcing = tags.filter(Condition.isTruthy).map(async tag => {
    const tagSource: Record<string, unknown> = {
      ...tag,
      velogId: tag.id,
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
      id: createNodeId(`VelogTag:${tag.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'VelogTag',
        contentDigest: createContentDigest(tagSource),
      },
    });
  });

  await Promise.all(tagSourcing);
};
