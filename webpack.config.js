const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './bom.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bom.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'node-bom',
    umdNamedDefine: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
  target: 'node'
};
