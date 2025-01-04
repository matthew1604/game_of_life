const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

let config = {
    mode: "development",
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js"
    },
}

module.exports = config;