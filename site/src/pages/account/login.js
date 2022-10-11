import * as React from 'react';
import { navigate } from 'gatsby';

const checkLogin = async (setLoginStatus) => {
  const { loggedIn = false } = await fetch('/api/check-auth').then((res) =>
    res.json(),
  );
  setLoginStatus(loggedIn);
};

const login = async () => {
  const { status } = await fetch('/api/login').then((res) => res.json());
  if (status !== 'ok') {
    throw new Error(status);
  }
  navigate('/account/dashboard');
};

const Login = () => {
  const [loginStatus, setLoginStatus] = React.useState();

  React.useEffect(() => {
    checkLogin(setLoginStatus);
  }, []);

  if (loginStatus === true) {
    navigate('/account/dashboard', { replace: true });
    return null;
  }

  return <button onClick={login}>Login</button>;
};

export default Login;
