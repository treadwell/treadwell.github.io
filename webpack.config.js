const HtmlWebpackPlugin = require("html-webpack-plugin")
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin")

module.exports = {
  entry: __dirname + "/src/index.js",
  mode: process.env.NODE_ENV,
  output: {
    path: __dirname + "/build",
    filename: "index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Asana Series Builder",
      filename: "index.html",
    })
  ].concat(process.env.NODE_ENV == "development" ? [] : [
    new ScriptExtHtmlWebpackPlugin({
        inline: /.js$/
    })
  ]),
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "sass-loader"}
      ]
    }, {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        { loader: "base64-inline-loader" }
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        { loader: "eslint-loader" }
      ]
    }]
  }
}
