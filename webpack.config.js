const path = require('path');

module.exports = {
  entry: {
    gallery: './src/gallery.js',
    book: './src/book.js',
    home: './src/home.js',
    chart: './src/chart.js',
    blog: './src/blog.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'assets/js')
  }
};
