import * as React from 'react';
import { navigate } from 'gatsby';
import { form, input, button } from '../../styles/search.module.css';

const SearchClientOnly = ({ params }) => {
  console.log(params);
  const query = decodeURIComponent(params['*']);
  const [currentQuery, setCurrentQuery] = React.useState(query);
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState('IDLE');

  const handleSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const query = form.get('search');
    setCurrentQuery(query);
    navigate(`/search/${encodeURIComponent(query)}`);
  };

  const handleSearchReset = () => {
    setCurrentQuery('');
    navigate('/search');
  };

  const bookSearch = async () => {
    setStatus('LOADING');
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    if (!res.ok) {
      throw new Error(`Search failed! -- ${res.status}`);
    }

    const result = await res.json();
    setResult(result);
    setStatus('IDLE');
  };

  React.useEffect(() => {
    if (currentQuery === '') {
      setResult(null);
      return;
    }
    bookSearch(currentQuery);
  }, [currentQuery]);

  return (
    <>
      <h1>Seach for a book</h1>
      <form className={form} onSubmit={handleSearch}>
        <input className={input} type="search" name="search"></input>
        <button className={button}>search</button>
        <button className={button} type="reset" onClick={handleSearchReset}>
          reset
        </button>
      </form>

      {status === 'LOADING' && <p>Results are loading...</p>}
      {status === 'IDLE' && currentQuery !== '' ? (
        <>
          <h2>Serch results for "{currentQuery}"</h2>
          <ul>
            {result &&
              result.docs.map((d) => (
                <li key={d.key}>
                  <strong>{d.title}</strong>{' '}
                  {d.author_name && `by ${d.author_name?.[0]}`}
                </li>
              ))}
          </ul>
        </>
      ) : null}
    </>
  );
};

export default SearchClientOnly;
