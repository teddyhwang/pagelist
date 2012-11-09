requirejs.config({
    shim: {
        'pagelist': {
            deps: [
                'pages',
                '../lib/jquery/jquery-1.8.2.min',
                '../lib/livesearch/quicksilver',
                '../lib/livesearch/jquery.livesearch',
                '../lib/underscore/underscore-min'
            ],
            exports: 'Pagelist'
        },
        '../lib/livesearch/jquery.livesearch': {
            deps: [
                '../jquery/jquery-1.8.2.min',
                '../livesearch/quicksilver'
            ]
        }
    }
});

require([
    'pagelist',
    'pages',
    '../lib/jquery/jquery-1.8.2.min',
    '../lib/livesearch/quicksilver',
    '../lib/livesearch/jquery.livesearch',
    '../lib/underscore/underscore-min',
], function() {

    var global  = this; // in context to the browser `this` is `window`

    var $       = global.$;

    $(function() {
        var pagelist = new Pagelist.Core({ pages: pages });
    });

});
