const path = require('path');
const webpack = require('webpack');

module.exports = {
    // バンドルするファイルを指定
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
	devServer: {
		contentBase: path.join(__dirname, 'build')
	},
    module: {
        rules: [
          {
            test: /\.(png|jpe?g|xml)$/i,
            use: "file-loader",
          }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
          CANCAS_RENDERER: JSON.stringify(true),
          WEBGL_RENDERER: JSON.stringify(true)
        })
    ]
};