var webpack = require('webpack');
var path = require('path');
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
const autoprefixer = require('autoprefixer');

var config = {
	entry: [
		'webpack-hot-middleware/client?reload=true&path=http://localhost:3000/__webpack_hmr',
		'./src/index',
	],
	output: {
		path: __dirname + '/www',
		publicPath: 'http://localhost:3000/www/',
		filename: 'bundle.js'
	},
	plugins: [
	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.optimize.OccurenceOrderPlugin()
	],
	module: {
		loaders: [ 
		{
	        test: /.js$/,
	        exclude: /node_modules/,
	        loaders: ['babel-loader'],
	        include: __dirname
	      }, {
	        test: /\.css$/,
	        loaders: ['style', 'css', 'postcss'],
	        include: __dirname
	      }, {
	        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
	        loader: 'file',
	        include: __dirname
	      }
      ]
	},
	postcss: function() {
	    return [
	      autoprefixer({
	        // Configuration des navigateurs ciblés
	        // Documentation: https://github.com/ai/browserslist#queries
	        browsers: [
	          '>1%', // version sélectionné à partir des stats d'usage global (voir CanIUse)
	          'last 4 versions', // 4 dernières version de Chrome
	          'Firefox ESR', // Dernière version ESR (Extended Support Release)
	          'not ie < 9' // Internet Explorer 9 minimum
	        ]
	      })
	    ];
	  },
	resolve: {
		extensions: ['', '.js', '.jsx'],
	}
};

config.target = webpackTargetElectronRenderer(config);

module.exports = config;