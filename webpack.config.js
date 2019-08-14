const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('extract-css-chunks-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: path.join(__dirname, './dist/index.html'),
    filename: 'index.html',
    inject: 'body'
});

const MiniCssExtractPluginConfig = new MiniCssExtractPlugin({
     filename: dev ? 'bundle.css' : 'bundle.[hash].css'
});

const DefinePluginConfig = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
});


module.exports = {
    mode: dev ? 'development' : 'production',
	entry: {
    	app: './src/scripts/index.js'
   	},
    output: {
        filename: 'bundle.js',
    	path: path.resolve(__dirname, 'dist/assets/js')
   	},
    devServer: {
        host: 'localhost',
        port: '3000',
        hot: dev,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: true,
    },
    module: {
    	rules: [
    		{
    			test: /\.(js|jsx)$/,
    			exclude: /(node_modules)/,
    			use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            emitWarning: dev
                        }
                    },
	    			{
	    				loader: 'babel-loader'
          			}
    			]
    		},
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hot: dev,
                            publicPath: path.resolve(__dirname, 'dist/assets/css')
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')()
                            ]
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
    	]
	},
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: dev
    ? [HTMLWebpackPluginConfig, new webpack.HotModuleReplacementPlugin(), MiniCssExtractPluginConfig ]
    : [HTMLWebpackPluginConfig, DefinePluginConfig, MiniCssExtractPluginConfig],
    devtool: dev ? 'inline-source-map': 'eval',
	performance: { hints: dev ? 'warning' : 'error' }
};
