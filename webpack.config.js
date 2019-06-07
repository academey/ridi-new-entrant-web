const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/client/index.tsx",
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: "http://localhost:3000/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)|(jsx?)$/,
        loader: "babel-loader",
        exclude: [/node_modules/]
      }
    ]
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    hot: true,
    historyApiFallback: true,
    index:'build/index.html',
    proxy: {
      "/api/**": "http://localhost:8080",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};
