import * as React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { container, sharedNav, link } from '../styles/nav.module.css';

const Nav = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          navItems {
            label
            path
          }
        }
      }
    }
  `);
  const navItems = data.site.siteMetadata.navItems;
  return (
    <>
      <header className={container}>
        <Link to="/" className={link}>
          {data.site.siteMetadata.title}
        </Link>
        <nav className={sharedNav}>
          {navItems.map((item) => (
            <Link className={link} key={`nav-${item.path}`} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
};

export default Nav;
