var LocaleManager = function LocaleManager() {
    this.dictionaries = null;
    this.language = null;
    this.currentDictionary = null;
}

LocaleManager._instance = null;
LocaleManager.getInstance = function getInstance() {
    if (!this._instance) {
        this._instance = new LocaleManager();
    }
    return this._instance;
}

LocaleManager.prototype.init = function init(dictionaries) {
    this.dictionaries = dictionaries;

    this.setLanguage('en');
}

LocaleManager.prototype.setLanguage = function setLanguage(language) {
    this.language = language;
    this.currentDictionary = this.dictionaries && this.dictionaries[this.language];
}

LocaleManager.prototype.getValue = function getValue(key) {
    var value = this.currentDictionary[key];

    if (!value) return key;

    if (arguments.length > 1) {
        console.log('ARGUMENTS LENGTH !!!!', arguments.length);
        var args = arguments;
        (function() {
            for(var i=1; i<args.length; i++) {
                if (typeof(args[i]) == 'string') {
                    value = value.replace('%'+(i-1), args[i]);
                }
            }
        })();
    }

    return value;
}

LocaleManager.prototype.localize = function localize(htmlElement) {
    var key;
    var _self = this;
    $('.localizable', htmlElement).each(function(i, localizable) {
        key = $(localizable).data('key');
        if ($(localizable).attr('placeholder')) {
            $(localizable).attr('placeholder', _self.getValue(key));
        } else {
            $(localizable).html(_self.getValue(key));
        }
    })
}