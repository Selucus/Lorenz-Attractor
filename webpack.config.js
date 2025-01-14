const path = require('path');

module.exports = {
  // Entry point for your JavaScript
  entry: './src/main.js',
  
  // Output directory and file name for the bundled file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  // Setting mode to 'development' for easier debugging
  mode: 'development',

  // Webpack DevServer for local development
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
  },

  // For resolving modules like Three.js from node_modules
  resolve: {
    alias: {
        
      three: path.resolve('./node_modules/three'),
      datgui: path.resolve('./node_modules/dat.gui'),
    },
  },
};
