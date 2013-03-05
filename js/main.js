require.config({

    baseUrl: 'js/',

    waitSeconds: 30,

    paths: {
        // jQuery
        'jquery'                    : '../components/jquery/jquery',
        'almond'                    : '../components/almond/almond',
        'modernizr'                 : '../components/modernizr/modernizr',
        'underscore'                : '../components/underscore/underscore',

        // Third Party Plugins
        'quicksilver'               : '../components/quicksilver/quicksilver',
        'livesearch'                : '../components/jquery.livesearch/jquery.livesearch',

        'pagelist'                  : 'pagelist'
    },

    shim: {

        // jQuery plugins (non-amd compliant) need this shim config
        'livesearch': {
            deps: ['jquery', 'quicksilver']
        },

        underscore: {
            exports: '_'
        }
    }

});

require(['modernizr']);
require(['pagelist']);

