var DURATION_DISPLAY_NOTICE = 5000;

var NoticeManager = function NoticeManager(noticeDiv) {
	this.htmlElement = noticeDiv;
	this.htmlElement.hide();
	this.title = $('.title', this.htmlElement);
	this.content = $('.content', this.htmlElement);

	this.hideTimer = null;
}

NoticeManager._instance = null;
NoticeManager.getInstance = function getInstance() {
	if (!this._instance) {
		this._instance = new NoticeManager($('#notice'));
	}
	return this._instance;
}

NoticeManager.prototype.showNotice = function showNotice(error, callback) {
	if (!error) return;

	this.title.html(error.title);
	this.content.html(error.content || error.message);

	this.hideTimer && clearTimeout(this.hideTimer);
	
	this.htmlElement.fadeIn(700, function() {
		this.hideTimer = setTimeout(this.hideNotice.bind(this), DURATION_DISPLAY_NOTICE);
		if (callback) callback();
	}.bind(this));
}

NoticeManager.prototype.hideNotice = function hideNotice(callback) {
	this.htmlElement.fadeOut(700, function() {
		if (callback) callback();
	});
}