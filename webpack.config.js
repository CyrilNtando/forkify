const path = require('path');
module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'build/js'),
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
};
