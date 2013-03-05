
// run `node r.js -o build.js` from terminal

({
    baseUrl: './',
    optimize: 'uglify',
    optimizeCss: 'none', // https://github.com/jrburke/r.js/issues/167
    mainConfigFile: 'main.js',
    name: 'almond',
    include: ['main'],
    insertRequire: ['main'],
    out: 'pagelist.min.js',
    wrap: true
})

