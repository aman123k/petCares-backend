/// <reference types="node" />

import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";

const isProduction = process.env["NODE_ENV"] === "production";

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  externals: [nodeExternals()],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: isProduction ? "production" : "development",
    }),
  ],
};
