import * as React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';

const Authors = () => {
  const data = useStaticQuery(graphql`
    query AuthorQuery {
      allAuthor {
        nodes {
          name
          slug
        }
      }
    }
  `);
  const authors = data.allAuthor.nodes;
  return (
    <>
      <h1>Authors</h1>
      <ul>
        {authors.map((a) => (
          <li key={a.slug}>
            <Link to={`/${a.slug}`}>{a.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Authors;
