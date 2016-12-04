
path = require 'path'

cssLoader = 'style!css?module&localIdentName=[path][name]---[local]';

loaders =
    'js':
        loader: 'babel'
        include: [
            path.resolve __dirname, 'src'
            path.resolve __dirname, 'test'
        ]
        exclude: /node_modules/
        query:
            # plugins: ['transform-runtime']
            presets: ['es2015', 'stage-0', 'react']
    'coffee': 'coffee'
    'json': 'json'
    'html': 'html'
    'jade': 'jade'
    'css': cssLoader
    'styl': cssLoader + '!stylus'
    'png|jpg': 'url?limit=8192' # inline base64 URLs for <=8k images, direct URLs for the rest

### Compile config helpers ###

loaderList = for key, value of loaders
    Object.assign {},
        test: new RegExp "\\.(#{key})$"
        exclude: /node_modules/
    , if typeof value is 'object' then value else loader: value

resolveExtension = ['']
for key of loaders
    resolveExtension.push '.' + ext for ext in key.split '|'

### Export ###

module.exports =
    target: 'web'
    context: __dirname
    entry:
        main: './src/main.js'
        test: './test.bundle.js'
    debug: true
    devtool: 'source-map'
    output:
        path: __dirname + '/public'
        filename: '[name].js'
        pathinfo: true
    resolve:
        extensions: resolveExtension
        modulesDirectories: [
            'node_modules'
            'src'
        ]
    module:
        loaders: loaderList
    node:
        # Don't add polyfills for these node vars
        console: false
        process: false
        global: false
        buffer: false
