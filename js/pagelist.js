(function() {

    var global = this;

    var Pagelist = (global.Pagelist || (global.Pagelist = { }));

    var Core = Pagelist.Core = function(options) {

        var defaults = {
            pages : []
        };

        this.config = $.extend(true, defaults, options || { });

        this.categories = [];
        this._init();
    };

    Core.prototype._init = function() {
        this._injectPageListRequirements();
        this._insertPages();
        this._bindLiveSearch();
        this.original_pagelist_height = $('#PageList ul').outerHeight();
        this._calculatePageListHeight();
        var calculateWindow = _.debounce($.proxy(this._calculatePageListHeight, this), 200)
        $(global).resize(calculateWindow);
        this._loadiFrame();
    };

    Core.prototype._injectPageListRequirements = function() {
        var $iframe = '<iframe src="" id="MainFrame"></iframe>',
            $button = '<div id="Button"><i class="icon icon-list"></i></div>',
            $page_list = '<div id="PageList"><ul></ul></div>',
            $footer = '<div id="Footer"><input type="search" id="PageListSearch" placeholder="Search" autocomplete="off"><i class="ico-clearfield"></i><a href="#Settings" class="btn"><i class="ico-settings"></i></a></div>',
            $settings = '<div id="Settings"><label for="DarkTheme"><input type="radio" id="DarkTheme" name="theme" val="dark">Dark</label><label for="LightTheme"><input type="radio" id="LightTheme" name="theme" val="light">Light</label></div>';

        $('body').prepend($iframe + $button + $page_list);
        $('#PageList').append($footer);

        this.footer_initial_height = $('#Footer').outerHeight();

        $('#Footer').append($settings);

        $('#Footer .btn').on('click', $.proxy(this._clickSettings, this));
        $('#Button').on('click', $.proxy(this._clickButton, this));

        this._toggleTheme();
    };

    Core.prototype._insertPages = function() {
        $.each(this.config.pages, $.proxy(function(i, val) {
            if ($.inArray(val.category, this.categories) <= 0) {
                this.categories.push(val.category);
            }
        }, this));

        $.each(this.categories, function(i, val) {
            $('#PageList ul').append('<li class="category"><h2>'+val+'</h2></li>');
        });

        $.each(this.config.pages.reverse(), $.proxy(function(i, val) {
            $('#PageList ul').find('li:contains('+val.category+')').after('<li><a href="#'+val.url+'">'+val.title+'</a></li>');
        }, this));

        this.config.pages.reverse();
        $('#PageList a').on('click', $.proxy(this._clickPageLink, this));
    };

    Core.prototype._calculatePageListHeight = function() {
        // TODO: No idea where the 94 is coming from yet but that's the value you need to have a scrollbar when page list is long
        var height = global.outerHeight - $('#Footer').outerHeight() - 94;
        if (height < this.original_pagelist_height) {
            $('#PageList ul').css('height', height);
        } else {
            $('#PageList ul').css('height', 'auto');
        }
    };

    Core.prototype._bindLiveSearch = function() {
        $('#PageListSearch').liveUpdate('PageList ul');
    };

    Core.prototype._loadiFrame = function() {
        var url = this.config.pages[0].url;

        if (global.location.hash !== '') {
            url = global.location.hash.replace('#', '');
            $('#PageList').find('a[href="#'+url+'"]').parent().addClass('active');
        } else {
            $('#PageList').find('li').not('.category').first().addClass('active');
        }

        $('#MainFrame').attr('src', url);
    };

    Core.prototype._clickPageLink = function(evt) {
        $('#PageList li').removeClass('active');
        $(evt.currentTarget).parent().addClass('active');

        var url = $(evt.currentTarget).attr('href').replace('#', '');

        $('#MainFrame').attr('src', url);
    };

    Core.prototype._clickSettings = function(evt) {
        var ct = evt.currentTarget,
            $current = $(ct);
    };

    Core.prototype._clickButton = function(evt) {
        // TODO: get away from using jquery animate - use move.js or tweenk.js
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

    Core.prototype._toggleTheme = function() {
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
