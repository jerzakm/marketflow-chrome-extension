const path = require('path')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPlugin = require('webpack-shell-plugin')


const {
  NODE_ENV = 'development',
} = process.env
module.exports = {
  entry: './src/index.ts',
  watch: NODE_ENV === 'development',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: [
        'ts-loader',
      ]
    }]
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ['npm run serve']
    })
  ]
}