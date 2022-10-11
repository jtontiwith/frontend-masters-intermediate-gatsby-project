import * as React from 'react';

const Custom = ({ pageContext }) => {
  return (
    <div>
      <h1>{pageContext.title}</h1>
      <pre>{JSON.stringify(pageContext, null, 2)}</pre>
    </div>
  );
};

export default Custom;
