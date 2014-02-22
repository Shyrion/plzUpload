
define([], function(UploadProgress) {

	MenuController = function (id, onDropCallback) {
		this.menuButton = $('#menuButton');
		this.menuDiv = $('#menu');
		this.menuUploadsDiv = $('#menuUploads');
		this.opened = false;

		$('#menuButton').click(function() {
			this.opened ? this.close() : this.open();
			this.opened = !this.opened;
		}.bind(this));

		$('#getUploadButton').click(function() {
    	var fileUrl = location.protocol + "//" + location.hostname + ":" + location.port + "/" + $('#getUploadField').val();
    	var win=window.open(fileUrl, '_blank');
  		win.focus();
    });

	  this.allUploads = {};
	}

	MenuController.prototype.open = function open() {
		$('#mainContent').animate({
			right: "202",
			queue: false
		});
		$('#menu').animate({
			right: "0",
			queue: false
		});
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
	}

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

	return MenuController;
});