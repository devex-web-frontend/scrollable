const path = require('path');

const stylus = {
	nocheck: true,
	'include css': true,
	'resolve url': true,
	paths: ['lib']
};

export default {
	entry: path.join(__dirname, '../test/demo.js'),
	output: {
		path: path.join(__dirname, '../dist')
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel'
			},
			{
				test: /\.ts$/,
				loader: 'babel!ts'
			},
			{
				test: /\.styl$/,
				loader: `style!css!stylus?${JSON.stringify(stylus)}`
			}
		]
	},
	resolve: {
		alias: {
			config: path.resolve('./test/config.styl')
		},
		extensions: [
			'', //https://webpack.github.io/docs/configuration.html#resolve-extensions
			'.js',
			'.jsx',
			'.ts',
			'.tsx'
		],
		modulesDirectories: [
			'node_modules',
			'lib'
		]
	}
};