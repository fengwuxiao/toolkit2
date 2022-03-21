#!/usr/bin/env node

/**
 * for build command:
 * nej-build
 * nej-build /path/to/release.conf
 * nej-build ./relative/to/current/directory/release.conf
 */

var args = process.argv.slice(2);
const isDev = process.argv.slice(process.argv.length-1)[0] === 'watch';
require('../main.js').build(
    args[0]||'./release.conf',
    {isDev: isDev}
);