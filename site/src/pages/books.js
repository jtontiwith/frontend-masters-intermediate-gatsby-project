import * as React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import slugify from 'slugify';

const Books = () => {
  const data = useStaticQuery(graphql`
    query BookQuery {
      allBook {
        nodes {
          id
          name
          author {
            name
            slug
          }
          series
        }
      }
    }
  `);
  const books = data.allBook.nodes;
  console.log(data);
  return (
    <>
      <h1>Books</h1>
      {books.map((b) => {
        const bookSlug = slugify(b.name, { lower: true });
        let path;
        if (b.series) {
          const seriesSlug = slugify(b.series, { lower: true });
          path = `/book/${seriesSlug}/${bookSlug}`;
        } else {
          path = `/book/${bookSlug}`;
        }

        return (
          <li key={b.id}>
            <Link to={path}>{b.name}</Link>, by{' '}
            <Link to={`/${b.author.slug}`}>{b.author.name}</Link>
          </li>
        );
      })}
    </>
  );
};

export default Books;
