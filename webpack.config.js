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
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
    // https://engineering.huiseoul.com/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%83%81%EB%8C%80%EA%B2%BD%EB%A1%9C-%EC%A0%88%EB%8C%80%EA%B2%BD%EB%A1%9C-%EB%B3%80%EA%B2%BD-1485babb5198
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
  // https://github.com/peaksandpies/universal-analytics/issues/58
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
