const path = require('path');

module.exports = {
  entry: './src/main',
  output: {
    path: './dist',
    filename: 'miu.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        },
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  }
};
