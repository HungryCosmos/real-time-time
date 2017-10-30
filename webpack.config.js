var path = require('path');

var include = path.join(__dirname, 'src');

module.exports = {
    entry: './src/real-time-time',
    output: {
        path: path.join(__dirname, 'dist/umd'),
        libraryTarget: 'umd',
        library: 'RealtimeTime',
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader'}
        ]
    }
};