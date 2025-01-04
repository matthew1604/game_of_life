const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

let config = {
    mode: "production",
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js"
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: {
                        properties: true,
                    },
                },
            }),
        ],
    },
}

module.exports = config;