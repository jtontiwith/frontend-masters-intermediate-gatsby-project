// whatever we do in this function will get
// run as part of the create pages step of
// // the gatsby build process
const fetch = require('node-fetch');
const { createRemoteFileNode } = require('gatsby-source-filesystem');
const slugify = require('slugify');
// import fetch from 'node-fetch';
// import { createRemoteFileNode } from 'gatsby-source-filesystem';

const authors = require('./src/data/authors.json');
const books = require('./src/data/books.json');

// this is another built-in node hook the runs on build
exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode, createTypes } = actions;

  // so this creates a relationship between authors and books
  //
  createTypes(`
    type Author implements Node {
      books: [Book!]! @link(from: "slug" by: "author.slug" )
    }
    type Book implements Node {
      author: Author! @link(from: "author" by: "slug")
    }
  `);

  authors.forEach((a) => {
    createNode({
      ...a,
      id: createNodeId(`author-${a.slug}`),
      parent: null,
      children: [],
      internal: {
        type: 'Author',
        content: JSON.stringify(a),
        contentDigest: createContentDigest(a),
      },
    });
  });

  books.forEach((b) => {
    createNode({
      ...b,
      id: createNodeId(`book-${b.isbn}`),
      parent: null,
      children: [],
      internal: {
        type: 'Book',
        content: JSON.stringify(b),
        contentDigest: createContentDigest(b),
      },
    });
  });
};

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  createPage({
    path: '/custom',
    component: require.resolve('./src/templates/custom.js'),
    context: {
      title: 'A custom page',
      meta: {
        description: 'A custom pages with context',
      },
    },
  });

  const result = await graphql(`
    query GetBooks {
      allBook {
        nodes {
          id
          series
          name
        }
      }
    }
  `);

  const books = result.data.allBook.nodes;
  console.log('books here >>>> ', books);
  books.forEach((b) => {
    const bookSlug = slugify(b.name, { lower: true });
    if (b.series === null) {
      console.log('about to create a page b.series === null');
      createPage({
        path: `/book/${bookSlug}`,
        component: require.resolve('./src/templates/book.js'),
        context: {
          id: b.id,
        },
      });
    } else {
      const seriesSlug = slugify(b.series, { lower: true });
      console.log('about to create a page else');
      createPage({
        path: `/book/${seriesSlug}/${bookSlug}`,
        component: require.resolve('./src/templates/book.js'),
        context: {
          id: b.id,
        },
      });
    }
  });
};

// this thing basically just added another field to the book node
exports.createResolvers = ({
  createResolvers,
  actions,
  cache,
  createNodeId,
  store,
  reporter,
}) => {
  const { createNode } = actions;
  const resolvers = {
    Book: {
      buyLink: {
        type: 'String',
        resolve: (source) =>
          `https://www.powells.com/searchresults?keyword=${source.isbn}`,
      },
      cover: {
        type: 'File',
        resolve: async (source) => {
          const res = await fetch(
            `https://openlibrary.org/isbn/${source.isbn}.json`,
          );
          if (!res.ok) {
            reporter.warn(
              `Error loading details about ${source.name} - got ${res.status} - status - ${res.statusText}`,
            );
            return null;
          }
          const { covers } = await res.json();
          console.log('covers here >>>>', covers);
          if (covers.length) {
            return createRemoteFileNode({
              url: `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg`,
              actions,
              cache,
              createNode,
              createNodeId,
              store,
              reporter,
            });
          } else {
            return null;
          }
        },
      },
    },
  };
  createResolvers(resolvers);
};
