const config = require('dotenv').config().parsed
const DotenvPlugin = require('dotenv-webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')
const WebpackShellPlugin = require('webpack-shell-plugin')

const SUPPORTED_BROWSERS = {
  chrome: 'google-chrome',
  firefox: 'firefox'
}

module.exports = {
  mode: 'none',
  entry: [ path.resolve('app/server.js') ],
  output: {
    path: path.resolve('app', '.compiled'),
    filename: 'server.js'
  },
  externals: [nodeExternals()],
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: [
        `${SUPPORTED_BROWSERS[config.APP_BROWSER] || SUPPORTED_BROWSERS['chrome']} http://${config.APP_HOST}:${config.APP_PORT}`,
        `nodemon --watch ${path.resolve('app', '.compiled', 'server.js')} ${path.resolve('app', '.compiled', 'server.js')}`
      ]
    }),
    new DotenvPlugin({
      path: path.join(__dirname, '../.env'),
      systemvars: true,
      defaults: true
    }),
    new webpack.ProvidePlugin({
      log: path.resolve('app', 'lib', 'logger', 'index.js')
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          path.resolve('node_modules'),
          path.resolve('lib')
        ],
        query: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  node: true
                }
              }
            ]
          ],
          plugins: [
            '@babel/plugin-transform-runtime'
          ]
        }
      }
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../../'),
      '*': path.resolve(__dirname, '../../')
    }
  },
  target: 'node',
  watch: true,
  watchOptions: {
    poll: true
  },
  devServer: {
    open: true
  },
  node: {
    __filename: false,
    __dirname: false
  },
  stats: {
    colors: true
  },
  cache: false
}
