
define([], function(UploadProgress) {

	MenuController = function (id, onDropCallback) {
		this.menuButton = $('#menuButton');
		this.menuDiv = $('#menu');
		this.menuUploadsDiv = $('#menuUploads');
		this.menuUploadsSpeech = $('.speech', this.menuUploadsDiv);
		this.opened = false;

		$('#menuButton').click(function() {
			this.opened ? this.close() : this.open();
		}.bind(this));

		$('#getUploadButton').click(function() {
    	var fileUrl = location.protocol + "//" + location.hostname + ":" + location.port + "/" + $('#getUploadField').val();
    	var win = window.open(fileUrl, '_blank');
  		win.focus();
    });

    $('#getUploadField').keydown(function(e) {
    	window.setTimeout(function() {
    		$('#getUploadButton').css('display', ($(this).val() != '') ? 'block' : 'none');
    	}.bind(this), 1);
    })

		this.facebookLoginDiv = $('#facebookLogin');
		this.facebookLogoutDiv = $('#facebookLogout');
		this.facebookLogoutDiv.hide();

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
		$('#menu').show();
		$('#mainContent').animate({
			right: "187",
			queue: false
		});
		$('#menu').animate({
			right: "0",
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
		}, 400, function() {
				console.log("Finished"); //display: none;
				$('#menu').hide();
			});
		this.opened = false;
	}

	//===== Uploads =====//

	MenuController.prototype.addUpload = function addUpload(fileInfo) {
		// Hide speech if visible
		this.menuUploadsSpeech.hide();

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

		var finishHtml = $('<div><span><strong>Finished!</strong> (Code: <a href="' + url + '">' + name + '</a>)</span></div>');

		this.bindUploadOnClick($('a', finishHtml), name);

		uploadDiv.append(finishHtml);
	}

	MenuController.prototype.onUploadFailed = function onUploadFailed(uploadDiv) {
		uploadDiv.remove();

		if (!$('.upload', this.menuUploadsDiv).length) {
			this.menuUploadsSpeech.show();
		}
	}

	//===== Facebook Login =====//

	MenuController.prototype.addFacebookLogin = function addFacebookLogin(isLoggedIn, callback) {
		if (isLoggedIn) {

		}
	}

	MenuController.prototype.onFBLogin = function onFBLogin(currentUser) {
		this.facebookLoginDiv.hide();
		this.facebookLogoutDiv.show();

		var self=this;
		// Get previous uploads from logged in user
		$.ajax('/uploads/'+currentUser.id, {
      type: 'GET',
      complete: function(result) {
        var resultJson = JSON.parse( result.responseText );
        if (resultJson.result == 'ok') {
        	if (resultJson.allUploads.length) {
        		resultJson.allUploads.forEach(function(upload) {
        			var tmpHtml = self.addUpload(upload);
        			self.onUploadFinished(tmpHtml, upload.name+'.'+upload.ext, location.origin+'/'+upload.name+'.'+upload.ext);
        		});
        	}
        } else {
          console.log("Error", resultJson);
        }
      }.bind(this)
	  });
	}

	MenuController.prototype.onFBLogout = function onFBLogout() {
		this.facebookLoginDiv.show();
		this.facebookLogoutDiv.hide();
	}

	return MenuController;
});