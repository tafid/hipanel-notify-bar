var hn, HipanelNotifyBar = {
    
    settings: {
        title: 'Would you like to try new panel?',
        yesText: 'Yes',
        noText: 'No',
        newPanelLink: 'https://hipanel.ahnames.com',
        saveUrl: '#',
        checkUrl: '#',
        cookieExpiresDays: 1,
        cookieVar: 'stayOnTheOldPanel'
    },

    init: function() {
        hn = this;
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
        hn.saveAnswer('yes', hn.redirect);
    },

    noCallback: function() {
        var callback = function() {
            hn._getCookie(_this.settings.cookieVar, 1);
        };
        hn.saveAnswer('no', callback);
    },

    redirect: function() {
        hn._removeCookie(this.settings.cookieVar);
        window.location.replace(this.settings.newPanelLink);
    },

    stayOnTheOldPanel: function() {
        return hn._getCookie(this.settings.cookieVar) === 1;
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
        hn._setCookie(name, "", -1);
    }
};
