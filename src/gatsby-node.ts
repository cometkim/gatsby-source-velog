import type { GatsbyNode } from 'gatsby';

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({
  actions,
}) => {
  const gql = String.raw;
  const { createTypes } = actions;

  createTypes(gql`
    type VelogTag implements Node {
      velogId: String!
      velogUrl: String!
      name: String!
      description: String
      thumbnail: File
      posts: [VelogPost!]! @link(by: "velogId")
    }

    type VelogUser implements Node {
      velogId: String!
      velogUrl: String!
      username: String!
      displayName: String!
      bio: String!
      aboutHtml: String!
      isCertified: Boolean!
      thumbnail: File
      social: VelogUserSocial!
      posts: [VelogPost!]! @link(by: "velogId")
    }

    type VelogUserSocial {
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
