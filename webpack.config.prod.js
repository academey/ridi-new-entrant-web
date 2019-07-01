const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "source-map",
  mode: "development",
  entry: "./src/client/index.tsx",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "bundle.js"
  },
  optimization: {
    minimize: true,
    splitChunks: {},
    concatenateModules: true,
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)|(jsx?)$/,
        loader: "babel-loader",
        exclude: [/node_modules/]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader"
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};