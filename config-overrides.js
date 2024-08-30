const { override, addBabelPlugins } = require('customize-cra');

module.exports = override(
  ...addBabelPlugins(
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-private-property-in-object",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-private-methods"
  )
);
