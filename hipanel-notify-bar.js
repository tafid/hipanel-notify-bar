(function($, window, document, undefined) {
    var pluginName = "HipanelNotifyBar",
        defaults = {
            title: 'Would you like to try new panel?',
            yesText: 'Yes',
            noText: 'No',
            newPanelLink: 'https://hipanel.ahnames.com',
            saveUrl: '#',
            checkUrl: '#',
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
            notie.confirm(this.settings.title, this.settings.yesText, this.settings.noText, this.yesCallback, this.noCallback);
        },
        saveAnswer: function(answer, callback) {
            $.ajax({
                url: this.settings.saveUrl,
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
        yesCallback: function() {
            this.saveAnswer('yes', this.redirect);
        },
        noCallback: function() {
            _this = this;
            var callback = function() {
                this._getCookie(_this.settings.cookieVar, 1);
            };
            this.saveAnswer('no', callback);
        },
        redirect: function() {
            this._removeCookie(this.settings.cookieVar);
            window.location.replace(this.settings.newPanelLink);
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
