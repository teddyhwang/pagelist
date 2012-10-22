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
        this._loadiFrame();
    };

    Core.prototype._injectPageListRequirements = function() {
        var $iframe = '<iframe src="" id="MainFrame"></iframe>',
            $button = '<div id="Button"><i class="icon icon-list"></i></div>',
            $page_list = '<div id="PageList"><ul></ul></div>';

        $('body').prepend($iframe + $button + $page_list);

        $('#Button').on('click', $.proxy(this._clickButton, this));
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

    Core.prototype._clickButton = function(evt) {
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

}).call(this);
