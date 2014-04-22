
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
  	var fileUrl = location.protocol + "//" + location.hostname + ":" + location.port + "/up/" + $('#getUploadField').val();
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

MenuController.prototype.onUploadFinished = function onUploadFinished(uploadDiv, code, url, isProtected) {
	$('.uploadProgress', uploadDiv).remove();
	var finishHtml = $('<div class="uploadCode">' +
											'Code: <a href="' + url + '">' + code + '</a>' +
      								'<span data-code="'+code+'" class="uploadButton protectButton' + (isProtected ? '' : ' disabled') + '"></span>' +
      								'<span data-code="'+code+'" class="uploadButton deleteButton"></span>' +
										'</div>');

	uploadDiv.append(finishHtml);

	this.bindUploadOnClick($('a', finishHtml), code);
	this.bindDeleteButtons();
	this.bindProtectButtons();
}

MenuController.prototype.onUploadFailed = function onUploadFailed(uploadDiv) {
	uploadDiv.remove();

	if (!$('.upload', this.menuUploadsDiv).length) {
		this.menuUploadsSpeech.show();
	}
}

MenuController.prototype.bindUploadOnClick = function bindUploadOnClick(element, uploadCode) {
	element.click(function() {
  	var fileUrl = location.protocol + "//" + location.hostname + ":" + location.port + "/up/" + uploadCode;
  	var win = window.open(fileUrl, '_blank');
		win.focus();
		return false;
  });


	function tooltipCreate() {		
		var tooltipHtml = '<span class="title">Upload code</span>'+
											'<p class="content">'+
												'Give this code to your friends, and they will '+
												'be able to access your file'
											'</p>';

		return tooltipHtml;
	}

	element.tooltip({
		items: 'a',
		position: {
			my: "left top",
			at: "right bottom"
		},
		show: { duration: 100 },
		hide: { duration: 100 },
    content: function() {
      return tooltipCreate();
    }
	});
}

MenuController.prototype.bindDeleteButtons = function bindDeleteButtons() {
	var self = this;
	$('.deleteButton').off('click'); // remove previous events
	$('.deleteButton').click(function(e) {
		if (confirm("Êtes vous sûr de vouloir supprimer ce fichier ?")) {
			var uploadCode = $(e.target).data('code');
			$.ajax('/upload/' + uploadCode + '/remove', {
		    type: 'GET',
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
	});
}

MenuController.prototype.bindProtectButtons = function bindProtectButtons() {
	var self = this;
	$('.protectButton').off('click'); // remove previous events
	$('.protectButton').click(function(e) {
		$(e.target).hasClass('disabled') ? $(e.target).removeClass('disabled') : $(e.target).addClass('disabled');
		var uploadCode = $(e.target).data('code');
		var willBeProtected = $(e.target).hasClass('disabled') ? false : true;
		var data = { isProtected: willBeProtected };
		$.ajax('/upload/' + uploadCode + '/updateProtection', {
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

	function tooltipCreate(isProtected) {
		var title = isProtected ? 'Protected' : 'Shareable';
		var contentShareable = "This file can be accessed by anyone who knows the code";
		var contentProtected = "This file is only accessible by me";
		var content = isProtected ? contentProtected : contentShareable;
		
		var tooltipHtml = '<span class="title">' + title + '</span>'+
											'<p class="content">' + content + '</p>';

		return tooltipHtml;
	}

	$('.protectButton').tooltip({
		items: 'span',
		position: {
			my: "left top",
			at: "right bottom"
		},
		show: { duration: 100 },
		hide: { duration: 100 },
    content: function() {
      return tooltipCreate(!$(this).hasClass('disabled'));
    }
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
      	self.refreshUploads(); // TODO: remove only the deleted upload without server call
      } else {
        console.log("Error", resultJson);
      }
    }.bind(this)
  });
}

MenuController.prototype.clearUploads = function clearUploads(showSpeech) {
	this.allUploadsDiv.html('');
	
	if (showSpeech)
		this.menuUploadsSpeech.show();
}

MenuController.prototype.refreshUploads = function deleteUpload() {
	var self = this;
	// Get previous uploads from logged in user
	$.ajax('/uploads/'+this.currentUserId, {
    type: 'GET',
    complete: function(result) {
      var resultJson = JSON.parse( result.responseText );
      if (resultJson.result == 'ok') {
    		// clear all
    		this.clearUploads();
      	if (resultJson.allUploads.length) {

      		// add new list
      		resultJson.allUploads.forEach(function(upload) {
      			var tmpHtml = self.addUpload(upload);
      			self.onUploadFinished(tmpHtml, upload.code, location.origin+'/'+upload.code+'.'+upload.ext, upload.protected);
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