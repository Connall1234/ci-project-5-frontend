// const { override } = require('customize-cra');

// module.exports = override(
//   (config) => {
//     // Ensure date-fns is transpiled correctly
//     config.module.rules.push({
//       test: /\.mjs$/,
//       include: /node_modules\/date-fns/,
//       type: 'javascript/auto',
//     });

//     return config;
//   }
// );

const { override, addBabelPlugins } = require('customize-cra');

module.exports = override(
  ...addBabelPlugins(
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-private-property-in-object",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-private-methods"
  )
);
