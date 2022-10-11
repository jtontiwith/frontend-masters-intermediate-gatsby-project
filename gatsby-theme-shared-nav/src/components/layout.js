import * as React from 'react';
import '../styles/variables.css';
import '../styles/global.css';
import Nav from './nav.js';
import { content, footer } from '../styles/layout.module.css';

const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      <main className={content}>{children}</main>
      <footer className={footer}>shared nav component, yay!</footer>
    </>
  );
};

export default Layout;
