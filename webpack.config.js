const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: __dirname + "/src/index.js",
    mode: process.env.NODE_ENV,
    output: {
        path: __dirname + "/build",
        filename: "index.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Asana Player",
            filename: "index.html",
        }),
    ],
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                { loader: "style-loader", options: { injectType: "linkTag" } },
                { loader: "file-loader" }
                //{ loader: 'css-loader' },
                //{ loader: 'css-loader', options: { modules: true } },
            ]
        }, {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
                { loader: "file-loader", options: { outputPath: "fonts", name: "[name].[ext]" } }
            ]
        }]
    }
}