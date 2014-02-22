
define([], function(UploadProgress) {

	MenuController = function (id, onDropCallback) {
		this.menuButton = $('#menuButton');
		this.menuDiv = $('#menu');
		this.menuUploadsDiv = $('#menuUploads');
		this.opened = false;

		$('#menuButton').click(function() {
			this.opened ? this.close() : this.open();
		}.bind(this));

		$('#getUploadButton').click(function() {
    	var fileUrl = location.protocol + "//" + location.hostname + ":" + location.port + "/" + $('#getUploadField').val();
    	var win = window.open(fileUrl, '_blank');
  		win.focus();
    });

		this.facebookDiv = $('#facebookLogin');

	  this.allUploads = {};
	}

	MenuController.prototype.bindUploadOnClick = function bindUploadOnClick(element, uploadCode) {
  	element.click(function() {
    	var fileUrl = location.protocol + "//" + location.hostname + ":" + location.port + "/" + uploadCode;
    	var win = window.open(fileUrl, '_blank');
  		win.focus();
  		return false;
    });
	}

	MenuController.prototype.isOpened = function isOpened() {
		return this.opened;
	}

	MenuController.prototype.open = function open() {
		$('#mainContent').animate({
			right: "187",
			queue: false
		});
		$('#menu').animate({
			right: "-16",
			queue: false
		});
		this.opened = true;
	}

	MenuController.prototype.close = function close() {
		$('#mainContent').animate({
			right: "0",
			queue: false
		});
		$('#menu').animate({
			right: "-202",
			queue: false
		});
		this.opened = false;
	}

	//===== Uploads =====//

	MenuController.prototype.addUpload = function addUpload(fileInfo) {
		var uploadHtml = $('<div class="upload">' +
        '<span class="uploadName">' + fileInfo.name + '</span>' +
        '<div class="progress">' +
            '<progress data-id="0" value="0" max="100"></progress>' +
            '<span class="progressValue">0%</span>' +
        '</div>' +
    '</div>');
    this.menuUploadsDiv.append(uploadHtml);
    return uploadHtml;
	}

	MenuController.prototype.onUploadFinished = function onUploadFinished(uploadDiv, name, url) {
		$('.progress', uploadDiv).remove();

		var finishHtml = $('<div><span><strong>Finished!</strong> (<a href="' + url + '">' + name + '</a>)</span></div>');

		this.bindUploadOnClick($('a', finishHtml), name);

		uploadDiv.append(finishHtml);
	}

	MenuController.prototype.onUploadFailed = function onUploadFailed(uploadDiv) {
		uploadDiv.remove();
	}

	//===== Facebook Login =====//

	MenuController.prototype.addFacebookLogin = function addFacebookLogin(isLoggedIn, callback) {
		if (isLoggedIn) {

		}
	}

	MenuController.prototype.onFBLogin = function onFBLogin(usename) {
		this.facebookDiv.hide();
	}

	MenuController.prototype.onFBLogout = function onFBLogout() {
		this.facebookDiv.show();
	}

	return MenuController;
});