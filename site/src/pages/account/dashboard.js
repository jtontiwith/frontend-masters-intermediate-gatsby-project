import * as React from 'react';
import { navigate } from 'gatsby';

const checkLogin = async (setLoginStatus) => {
  const { loggedIn = false } = await fetch('/api/check-auth').then((res) =>
    res.json(),
  );
  setLoginStatus(loggedIn);
};

const logout = async () => {
  const { status } = await fetch('/api/logout').then((res) => res.json());
  if (status !== 'ok') {
    throw new Error(status);
  }
  navigate('/account/login');
};

const Dashboard = () => {
  const [loginStatus, setLoginStatus] = React.useState();

  React.useEffect(() => {
    checkLogin(setLoginStatus);
  }, []);

  if (loginStatus === false) {
    navigate('/account/login', { replace: true });
    return null;
  }

  return (
    <>
      <h1>Dashboard</h1>
      <p>secret stuff</p>
      <button onClick={logout}>Log Out</button>
    </>
  );
};

export default Dashboard;
