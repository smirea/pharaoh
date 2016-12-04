// require('babel-polyfill');

// Recursively require all polyfills
const req = require.context('./test/', true, /.*-test\.js$/);
req.keys().forEach(req);
