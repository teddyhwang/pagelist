(function() {

    var global = this;

    var Pagelist = global.Pagelist = function(options) {

        var defaults = {
            pages : []
        };

        this.config = $.extend(true, defaults, options || { });

        // hash
        this.categories = {};
        this._init();
    };

    Pagelist.prototype._init = function() {
        this._instanceVariables();

        this._pageListEvents();
        this._insertPages();

        this._initLiveSearch();

        this.original_pagelist_height = this.$ul.outerHeight();
        this._calculatePageListHeight();

        var calculateWindow = _.debounce($.proxy(this._calculatePageListHeight, this), 200)
        $(global).resize(calculateWindow);

        this._loadiFrame();
    };

    Pagelist.prototype._instanceVariables = function() {
        this.$iframe     = $('#MainFrame'),
        this.$button     = $('#Button'),
        this.$pagelist   = $('#PageList'),
        this.$ul         = this.$pagelist.find('ul'),
        this.$settings   = $('#Settings'),
        this.$footer     = $('#Footer');
    };

    Pagelist.prototype._pageListEvents = function() {
        this.footer_settings_height = this.$settings.outerHeight();
        this.max_footer_height = this.$footer.outerHeight();
        this.min_footer_height = this.$footer.outerHeight() - this.footer_settings_height;

        this.$footer.css('height', this.min_footer_height);

        this.$footer.find('.btn').on('click', $.proxy(this._clickSettings, this));
        this.$button.on('click', $.proxy(this._clickButton, this));
        // delegate events for better performance
        this.$ul.on('click', 'a', $.proxy(this._clickPageLink, this));

        this._toggleTheme();
    };

    Pagelist.prototype._insertPages = function() {

        // local caches are faster
        var categories = this.categories
            ,$el = this.$ul
            ;

        $.each(this.config.pages, function(i, val) {
            // get category page array (and create if necessary)
            var hash = categories[ val.category ] ||
                        (categories[ val.category ] = []);

            // add page to category
            hash.push( val );
        });

        // build html (chunking DOM modifications)
        $.each(categories, function(name, arr) {
            var $catlist = $('<li class="category"><h2>'+name+'</h2></li>');
            $.each(arr, function(i, val) {
                $catlist.after('<li><a href="#'+val.url+'">'+val.title+'</a></li>');
            });
            $el.append( $catlist );
        });
    };

    Pagelist.prototype._calculatePageListHeight = function() {
        // TODO: No idea where the 94 is coming from yet but that's the value you need to have a scrollbar when page list is long
        var height = $(window).outerHeight() - this.$footer.outerHeight();

        if (height < this.original_pagelist_height) {
            this.$ul.css('height', height);
        } else {
            this.$ul.css('height', 'auto');
        }
    };

    Pagelist.prototype._initLiveSearch = function() {
        $('#PageListSearch').liveUpdate('PageList ul');
    };

    Pagelist.prototype._loadiFrame = function() {
        var url
            ,pages = this.config.pages
            ,i = 0
            ;

        while( pages[i++] && !(url = pages[i].url) );

        if (global.location.hash !== '') {
            url = global.location.hash.replace('#', '');
            this.$pagelist.find('a[href="#'+url+'"]').parent().addClass('active');
        } else {
            this.$pagelist.find('li').not('.category').first().addClass('active');
        }

        this.$iframe.attr('src', url);
    };

    Pagelist.prototype._clickPageLink = function(evt) {
        this.$pagelist.find('li').removeClass('active');
        $(evt.currentTarget).parent().addClass('active');

        var url = $(evt.currentTarget).attr('href').replace('#', '');

        this.$iframe.attr('src', url);
    };

    Pagelist.prototype._clickSettings = function(evt) {
        var ct = evt.currentTarget,
            $current = $(ct);

        evt.preventDefault();

        if (parseInt(this.$footer.css('height'), 10) == this.min_footer_height) {
            this.$footer.animate({'height': this.max_footer_height}, 200);
        } else {
            this.$footer.animate({'height': this.min_footer_height}, 200);
        }
    };

    Pagelist.prototype._clickButton = function(evt) {
        // TODO: get away from using jquery animate - use move.js or tween.js
        if (parseInt($('#MainFrame').css('left'), 10) == 0) {
            $(evt.currentTarget).animate({
                left: -$(evt.currentTarget).outerWidth()
            }, 200, function(){
                $(evt.currentTarget).find('i').removeClass('icon-list').addClass('icon-close');
                $(evt.currentTarget).animate({
                    left: 0,
                    width: '50px'
                }, 200, function() {
                    $('#MainFrame').animate({
                        left: parseInt($('#MainFrame').css('left'), 10) == 0 ? $('#PageList').outerWidth() : 0
                    }, 600);
                    $(evt.currentTarget).animate({
                        width: '72px',
                        left: parseInt($('#MainFrame').css('left'), 10) == 0 ? $('#PageList').outerWidth() - 1 : -1,
                    }, 600, function() {
                        $(evt.currentTarget).animate({
                            width: '28px'
                        }, 200);
                    });
                });
            });
        } else {
            $('#MainFrame').animate({
                left: parseInt($('#MainFrame').css('left'), 10) == 0 ? $('#PageList').outerWidth() : 0
            }, 400);
            $(evt.currentTarget).animate({
                left: parseInt($('#MainFrame').css('left'), 10) == 0 ? $('#PageList').outerWidth() - 1 : -1,
            }, 400, function() {
                $(evt.currentTarget).animate({
                    left: -$(evt.currentTarget).outerWidth()
                }, 200, function(){
                    $(evt.currentTarget).find('i').removeClass('icon-close').addClass('icon-list');
                    $(evt.currentTarget).animate({
                        left: 0
                    }, 200);
                });
            });
        }
    };

    Pagelist.prototype._toggleTheme = function() {
        $('input[name="theme"]').change(function(evt) {
            var $ct = $(evt.currentTarget);

            if ($ct.attr('val') === 'dark') {
                $('body').removeClass('light');
            } else {
                $('body').addClass('light');
            }
        });
    };

}).call(this);
