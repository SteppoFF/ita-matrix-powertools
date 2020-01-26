const webpack = require("webpack");
const fs = require("fs");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "ita-matrix-powertools.user.js",
    path: __dirname
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: fs
        .readFileSync(path.resolve(__dirname, "header.js"), "utf8")
        .replace("__DESCRIPTION__", process.env.npm_package_description)
        .replace("__VERSION__", process.env.npm_package_version),
      raw: true
    }),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(process.env.npm_package_version)
    })
  ]
};
