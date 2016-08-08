(function($, window, document) {
    var pluginName = "HipanelNotifyBar",
        defaults = {
            title: 'Would you like to try new panel?',
            yesText: 'Yes',
            noText: 'No',
            newPanelLink: 'https://hipanel.ahnames.com',
            saveUrl: '#',
            cookieExpiresDays: 1,
            cookieVar: 'stayOnTheOldPanel'
        };

    function Plugin(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            _this = this;
            var linkTitle = '<a href="' + _this.settings.newPanelLink + '" target="_blank">' + _this.settings.title + '</a>';
            if (_this._getCookie(_this.settings.cookieVar) === undefined) {
                notie.setOptions({
                    colorSuccess: '#1F8200',
                    colorWarning: '#D6A14D',
                    colorError: '#ff0000',
                    colorInfo: '#77a6d0',
                    colorNeutral: '#A0A0A0',
                    colorText: '#FFFFFF',
                });
                notie.confirm(
                    linkTitle,
                    this.settings.yesText,
                    this.settings.noText,
                    function() {
                        var callback = function() {
                            window.location.replace(_this.settings.newPanelLink);
                        };
                        _this.saveAnswer('yes', callback);
                    },
                    function() {
                        var callback = function() {
                            _this._setCookie(_this.settings.cookieVar, 1);
                        };
                        _this.saveAnswer('no', callback);
                    }
                );
            }
        },
        saveAnswer: function(answer, callback) {
            var _this = this;
            $.ajax({
                url: _this.settings.saveUrl,
                method: 'POST',
                data: {
                    answer: answer
                },
                error: function() {
                    console.log('An error accurred');
                },
                success: callback
            });
        },
        stayOnTheOldPanel: function() {
            return this._getCookie(this.settings.cookieVar) === 1;
        },
        _getCookie: function(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        },
        _setCookie: function(name, value) {
            var date = new Date();
            date.setTime(date.getTime() + (this.settings.cookieExpiresDays * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
            document.cookie = name + "=" + value + expires + "; path=/";
        },
        _removeCookie: function(name) {
            this._setCookie(name, "", -1);
        }
    };

    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
        return this;
    };
})(jQuery, window, document);
