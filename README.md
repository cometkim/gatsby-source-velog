# gatsby-source-velog
[![npm](https://img.shields.io/npm/v/gatsby-source-velog)](https://www.npmjs.org/package/gatsby-source-velog)
[![License: MIT](https://img.shields.io/github/license/cometkim/gatsby-source-velog)](#LICENSE)

[GatsbyJS](https://www.gatsbyjs.org/) source plugin for [Velog](https://velog.io), the blogging platform created by [@velopert](https://github.com/velopert).

## Installation

```bash
yarn add gatsby-source-velog
```

In your `gatsby-config.js`

```js
{
  plugins: [
    // ...
    {
      resolve: 'gatsby-source-velog',
      options: {
        username: 'cometkim', // Your Velog username (required)
      },
    },
  ],
}
```

## Usage

### Query Examples

```graphql
query MyProfile {
  velogUser {
    username
    displayName
    bio
    aboutHtml
    socialProfile {
      url
      github
      twitter
    }
  }
}

query MyAllPosts {
  velogUser {
    posts {
      title
      series {
        node {
          name
        }
      }
    }
  }
}
```

See in GraphiQl while `gatsby develop` for more detail.


### Rendering Markdown

You can use [`gatsby-transformer-remark`](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/) to render `VelogPost` contents.

Add `gatsby-transformer-remark` into your `gatsby-config.js`

```diff
{
  plugins: [
    // ...
+   'gatsby-transformer-remark',
  ],
}
```

And you can access `MarkdownRemark` nodes from the root `Query` or through the original `VelogPost`.

```graphql
{
  allMarkdownRemark {
    nodes {
      html
    }
  }
  velogPost {
    childMarkdownRemark {
      html
      tableOfContents
    }
  }
}
```

### Thumnail Images

Every thumbnail contents are cloned to [remote `File` nodes](https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/#createremotefilenode). So you can own the images and optimize it using [`gatsby-plugin-image`](https://www.gatsbyjs.com/plugins/gatsby-plugin-image)

## LICENSE

MIT
