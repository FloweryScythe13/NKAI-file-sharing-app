module.exports = {
    entry: __dirname + 'newknowledgeclient/src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [ "stage-0", "react" ],
                    plugins: ["transform-decorators-legacy", "transform-runtime"]
                }
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: __dirname + '/public/javascripts'
    }
};

