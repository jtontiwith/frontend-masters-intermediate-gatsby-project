import * as React from 'react';
import { graphql, Link } from 'gatsby';
import slugify from 'slugify';

export const query = graphql`
  query AuthorPage($id: String!) {
    author(id: { eq: $id }) {
      name
      books {
        id
        name
        series
        seriesOrder
      }
    }
  }
`;

const sortAndExtendBooks = (books) => {
  return books
    .sort((a, b) => a.seriesOrder - b.seriesOrder)
    .map((book) => {
      const series = book.series
        ? `(${book.series}, book ${book.seriesOrder})`
        : '';
      const displayName = `${book.name} ${series}`;
      const bookSlug = slugify(book.name, { lower: true });

      let path;
      if (book.series) {
        const seriesSlug = slugify(book.series, { lower: true });
        path = `/book/${seriesSlug}/${bookSlug}`;
      } else {
        path = `/book/${bookSlug}`;
      }

      return { ...book, displayName, path };
    });
};

const AuthorPage = ({ data }) => {
  const { author } = data;
  const books = sortAndExtendBooks(author.books);

  return (
    <div>
      <h1>{author.name}</h1>
      <p>Books by {author.name}</p>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            <Link to={b.path}>{b.displayName}</Link>
          </li>
        ))}
      </ul>
      <Link to="/authors">&larr; back to all authors</Link>
      {/* <pre>{JSON.stringify(books, null, 2)}</pre> */}
    </div>
  );
};

export default AuthorPage;
