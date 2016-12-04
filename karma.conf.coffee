path = require 'path'
yargs = require 'yargs'

###
Exports a Karma configuration object
Details: http://karma-runner.github.io/0.13/config/configuration-file.html
###
getConfiguration = ->

    # Base path that will be used to resolve all patterns (eg. files, exclude)
    # basePath: __dirname

    # Frameworks to use
    # Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
        'mocha'
        'mocha-debug'
        'sinon-chai'
        'chai-as-promised'
        'chai'
    ]

    preprocessors:
        '**/*.js': ['sourcemap']

    # List of files / patterns to load in the browser
    files: getFileList()

    # Test results reporter to use
    # Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha']

    # Web server port
    port: 4000

    # Enable / disable colors in the output (reporters and logs)
    colors: true

    # Level of logging
    # logLevel: 'OFF'
    # logLevel: 'ERROR'
    # logLevel: 'DEBUG'
    # logLevel: 'WARN'
    # logLevel: 'INFO'
    logLevel: 'INFO'

    # Start these browsers
    # Available browsers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS']

    # Exit upon conclusion of test run(s)
    singleRun: false

    # Mocha (or other runner) options
    client: getClientOptions()

    # PhantomJS options
    phantomjsLauncher:
        # Have phantomjs exit if a ResourceError is encountered
        # (useful if karma exits without killing phantom)
        exitOnResourceError: false

###
Generates the options that are passed to the test client/runner (e.g. Mocha)
###
getClientOptions = ->
    args = []
    args.splice(2, 0, '--grep', yargs.argv.grep) if yargs.argv.grep?
    args.splice(2, 0, '--timeout', yargs.argv.timeout) if yargs.argv.timeout?
    return {args}

###
Generates a list of file paths that Karma should load. Order is important.
Details: http://karma-runner.github.io/0.13/config/files.html
###
getFileList = -> [
        pattern: 'public/build/test.js'
        nocache: true
    ]

###
Exports the configuration from this module
###
module.exports = (config) ->
    config.set getConfiguration()
    return
