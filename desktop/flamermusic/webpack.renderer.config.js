const rules = require('./webpack.rules');

// Modify the existing rules array to include the new rule for JSX and CSS
rules.push(
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      },
    },
  },
  {
    test: /\.css$/,  // Rule for CSS files
    use: ['style-loader', 'css-loader'], // Use style-loader and css-loader
  }
);

module.exports = {
  module: {
    rules, // Use the modified rules array
  },
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
};
