const path = require('path')

module.exports = {
  mode: 'none',
  entry: '/client/app.js',
  output: {
    path: path.resolve('static', 'js', 'compiled'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        },
        exclude: [
          path.resolve('node_modules'),
          path.resolve('lib')
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'client': path.resolve(__dirname, '../', 'client')
    }
  },
  target: 'web'
}
