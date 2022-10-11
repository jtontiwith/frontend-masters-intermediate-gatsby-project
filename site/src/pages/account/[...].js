import * as React from 'react';
import { navigate } from 'gatsby';

const Redirect = () => {
  React.useEffect(() => {
    navigate('/account/dashboard', { replace: true });
  }, []);
  return null;
};

export default Redirect;
