# gatsby-source-velog

[GatsbyJS](https://www.gatsbyjs.org/) source plugin for [Velog](https://velog.io), the CMS created by [@velopert](https://github.com/velopert).

This plugin will pulls posts and comments data from Velog's API Endpoint (https://api.velog.io), for specified user.

## Install

`npm --save gatsby-source-velog`

or

`yarn add gatsby-source-velog`

## How to use

```js

// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-velog`,
    options: {
      username: `username`,
    },
  },
  // If you want to transform markdown content
  'gatsby-transformer-remark',
]
```


## How to query

```graphql
allVelogPost {
  edges {
    node {
      title
      user {
        username
      }
      comment {
        user {
          username
        }
      }
    }
  }
}

# If the gatsby-transformer-remark is enable
allMarkdownRemark {
  edges {
    node {
      html
    }
  }
}
```

## LICENSE

MIT
