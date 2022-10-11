module.exports = {
  siteMetadata: {
    title: 'Gatsby Theme shared nav',
    navItems: [
      {
        label: 'Home',
        path: '/',
      },
    ],
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve(__dirname + '/src/components/layout.js'),
      },
    },
  ],
};
