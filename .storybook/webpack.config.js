const path = require('path');

module.exports = ({config}) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
      },
      {
        loader: require.resolve('react-docgen-typescript-loader'),
      },
      {
        loader: path.resolve('./node_modules/@crazyfactory/storybook-props-mock-addon/lib/reactTypescriptTranslationLoader.js')
      }
    ],
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
