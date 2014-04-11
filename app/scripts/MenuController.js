
MenuController = function (id, onDropCallback) {
	this.menuButton = $('#menuButton');
	this.menuDiv = $('#menu');
	this.menuUploadsDiv = $('#menuUploads');
	this.allUploadsDiv = $('#allUploads');
	this.menuUploadsSpeech = $('.speech', this.menuUploadsDiv);
	this.opened = false;
	this.currentUserId = null;

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
      '<div class="uploadHeader">' +
          '<span class="uploadName">' + fileInfo.name + '</span>' +
      '</div>' +
      '<div class="uploadProgress">' +
          '<progress data-id="0" value="0" max="100"></progress>' +
          '<span class="progressValue">0%</span>' +
      '</div>' +
  '</div>');
  this.allUploadsDiv.prepend(uploadHtml);
  return uploadHtml;
}

MenuController.prototype.onUploadFinished = function onUploadFinished(uploadDiv, code, url) {
	$('.uploadProgress', uploadDiv).remove();
	var finishHtml = $('<div class="uploadCode">' +
											'Code: <a href="' + url + '">' + code + '</a>' +
      								'<span data-code="'+code+'" class="uploadButton protectButton disabled"></span>' +
      								'<span data-code="'+code+'" class="uploadButton deleteButton"></span>' +
										'</div>');

	this.bindUploadOnClick($('a', finishHtml), code);

	uploadDiv.append(finishHtml);
}

MenuController.prototype.onUploadFailed = function onUploadFailed(uploadDiv) {
	uploadDiv.remove();

	if (!$('.upload', this.menuUploadsDiv).length) {
		this.menuUploadsSpeech.show();
	}
}

MenuController.prototype.bindDeleteButtons = function bindDeleteButtons() {
	var self = this;
	$('.deleteButton').click(function(e) {
		var data = {uploadCode: $(e.target).data('code')};
		$.ajax('/removeUpload', {
	    type: 'POST',
	    data: data,
	    complete: function(result) {
	      var resultJson = JSON.parse( result.responseText );
	      if (resultJson.result == 'ok') {
	      	self.refreshUploads();
	      } else {
	        console.log("Error", resultJson);
	      }
	    }.bind(this)
	  });
	});
}

MenuController.prototype.bindProtectButtons = function bindProtectButtons() {
	var self = this;
	$('.protectButton').click(function(e) {
		$(e.target).hasClass('disabled') ? $(e.target).removeClass('disabled') : $(e.target).addClass('disabled');
		/*var data = {uploadCode: $(e.target).data('code')};
		$.ajax('/removeUpload', {
	    type: 'POST',
	    data: data,
	    complete: function(result) {
	      var resultJson = JSON.parse( result.responseText );
	      if (resultJson.result == 'ok') {
	      	self.refreshUploads();
	      } else {
	        console.log("Error", resultJson);
	      }
	    }.bind(this)
	  });*/
	});
}

MenuController.prototype.deleteUpload = function deleteUpload(uploadCode) {
	var data = {code: uploadCode};
	$.ajax('/uploads/'+this.currentUserId, {
    type: 'POST',
    data: data,
    complete: function(result) {
      var resultJson = JSON.parse( result.responseText );
      if (resultJson.result == 'ok') {
      	self.refreshUploads();
      } else {
        console.log("Error", resultJson);
      }
    }.bind(this)
  });
}

MenuController.prototype.refreshUploads = function deleteUpload() {
	var self = this;
	// Get previous uploads from logged in user
	$.ajax('/uploads/'+this.currentUserId, {
    type: 'GET',
    complete: function(result) {
      var resultJson = JSON.parse( result.responseText );
      if (resultJson.result == 'ok') {
      	if (resultJson.allUploads.length) {
      		resultJson.allUploads.forEach(function(upload) {
      			var tmpHtml = self.addUpload(upload);
      			self.onUploadFinished(tmpHtml, upload.code, location.origin+'/'+upload.code+'.'+upload.ext);
      		});
      	}
      	self.bindDeleteButtons();
      	self.bindProtectButtons();
      } else {
        console.log("Error", resultJson);
      }
    }.bind(this)
  });
}

//===== Facebook Login =====//


MenuController.prototype.onFBLogin = function onFBLogin(currentUser) {
	this.facebookLoginDiv.hide();
	this.facebookLogoutDiv.show();

	this.currentUserId = currentUser.id;

	this.refreshUploads();
}

MenuController.prototype.onFBLogout = function onFBLogout() {
	this.facebookLoginDiv.show();
	this.facebookLogoutDiv.hide();
	this.currentUserId = null;
}