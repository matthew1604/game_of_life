const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
            inject: "body",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "assets", to: "assets" },
            ],
        }),
    ],
}

module.exports = config;