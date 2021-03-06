function getUploadUrl(code) {
	return location.protocol + '//' + location.hostname +
  		(location.port=="" ? "" : ':' + location.port)  + '/up/' + code;
}


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
  	var fileUrl = getUploadUrl($('#getUploadField').val());
  	var win = window.open(fileUrl, '_blank');
		win.focus();
		$('#getUploadField').val('');
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
		right: "240",
		queue: false
	}, 500, 'easeOutQuint');
	$('#menu').animate({
		right: "0",
		queue: false
	}, 500, 'easeOutQuint');
	this.opened = true;
}

MenuController.prototype.close = function close() {
	$('#mainContent').animate({
		right: "0",
		queue: false
	}, 500, 'easeOutQuint');
	$('#menu').animate({
		right: "-250",
		queue: false
	}, 500, 'easeOutQuint', function() {
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
  console.log('addUpload', uploadHtml);
  return uploadHtml;
}

MenuController.prototype.onUploadFinished = function onUploadFinished(uploadDiv, code, url, isProtected) {
	$('.uploadProgress', uploadDiv).remove();
	
	var finishHtml = '<div class="uploadCode">' +
											'<span class="localizable" data-key="CODE"></span>: <a href="' + url + '">' + code + '</a>' +
											'<span data-code="'+code+'" class="uploadButton copyButton" data-clipboard-text="'+getUploadUrl(code)+'"></span>';
	
	if (this.currentUserId) {
		// User is logged, we add protect button
		finishHtml += '<span data-code="'+code+'" class="uploadButton protectButton' + (isProtected ? '' : ' disabled') + '"></span>';
	}

  finishHtml += '<span data-code="'+code+'" class="uploadButton deleteButton"></span>' +
							'</div>';

	finishHtml = $(finishHtml);
	LocaleManager.getInstance().localize(finishHtml);

	uploadDiv.append(finishHtml);

	this.bindUploadOnClick($('a', finishHtml), code);

	if (this.currentUserId) {
		this.bindProtectButtons();
	}
	
	this.bindDeleteButtons();
	this.bindCopyButtons();
}

MenuController.prototype.onUploadFailed = function onUploadFailed(uploadDiv) {
	uploadDiv.remove();

	if (!$('.upload', this.menuUploadsDiv).length) {
		this.menuUploadsSpeech.show();
	}
}

MenuController.prototype.bindUploadOnClick = function bindUploadOnClick(element, uploadCode) {
	element.click(function() {
  	var fileUrl = location.protocol + '//' + location.hostname + ':' + location.port + '/up/' + uploadCode;
  	var win = window.open(fileUrl, '_blank');
		win.focus();
		return false;
  });

	element.tooltip({
		items: 'a',
		position: {
			my: "left top",
			at: "right bottom"
		},
		show: { duration: 100 },
		hide: { duration: 100 },
    content: function() {
    	var tooltipTitle = LocaleManager.getInstance().getValue('UPLOAD_CODE_TOOLTIP_TITLE');
    	var tooltipContent = LocaleManager.getInstance().getValue('UPLOAD_CODE_TOOLTIP_CONTENT');
			return '<span class="title">'+ tooltipTitle +'</span>'+
							'<p class="content">' + tooltipContent + '</p>';
    }
	});
}

MenuController.prototype.bindCopyButtons = function bindCopyButtons() {
	var elements = document.getElementsByClassName("copyButton");

	Array.prototype.forEach.call(elements, function(element) {
		var client = new ZeroClipboard(element, {
		  moviePath: "/build/ZeroClipboard.swf"
		});

    client.on("load", function(client) {
		  client.on("complete", function(client, args) {
		  	console.log(client, args, this);
		  });
		});
	});

  $('#global-zeroclipboard-html-bridge').tooltip({
		items: 'div',
		position: {
			my: "left top",
			at: "right bottom"
		},
		show: { duration: 100 },
		hide: { duration: 100 },
    content: function() {
    	var tooltipTitle = LocaleManager.getInstance().getValue('COPY_TOOLTIP_TITLE');
    	var tooltipContent = LocaleManager.getInstance().getValue('COPY_TOOLTIP_CONTENT');
			return '<span class="title">'+ tooltipTitle +'</span>'+
							'<p class="content">' + tooltipContent + '</p>';
    }
	});
}

MenuController.prototype.bindDeleteButtons = function bindDeleteButtons() {
	var self = this;
	$('.deleteButton').off('click'); // remove previous events
	$('.deleteButton').click(function(e) {
		if (confirm("Êtes vous sûr de vouloir supprimer ce fichier ?")) {
			var uploadCode = $(e.target).data('code');
			UploadManager.getInstance().removeUpload(uploadCode, function(err, code) {

				if (err) {
					NoticeManager.getInstance().showNotice({
						code: err.code,
						content: LocaleManager.getInstance().getValue('ERROR_'+err.code)
					});
				} else {
					NoticeManager.getInstance().showNotice({
						content: LocaleManager.getInstance().getValue('UPLOAD_DELETED', uploadCode)
					});
					self.refreshUploads();
				}
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
		UploadManager.getInstance().protectUpload(uploadCode, willBeProtected, function(err, code) {
			if (err) {
				NoticeManager.getInstance().showNotice({
					code: err.code,
					content: LocaleManager.getInstance().getValue('ERROR_'+err.code)
				});
			} else {
				var message = "";
				if (willBeProtected) {
					message = LocaleManager.getInstance().getValue('UPLOAD_PROTECTED', uploadCode);
				} else {
					message = LocaleManager.getInstance().getValue('UPLOAD_UNPROTECTED', uploadCode);
				}
				NoticeManager.getInstance().showNotice({
					content: message
				});
				self.refreshUploads();
			}
		});
	});

	$('.protectButton').tooltip({
		items: 'span',
		position: {
			my: "left top",
			at: "right bottom"
		},
		show: { duration: 100 },
		hide: { duration: 100 },
    content: function() {
    	var isProtected = !$(this).hasClass('disabled');

    	var tooltipTitle1 = LocaleManager.getInstance().getValue('PROTECT_TOOLTIP_TITLE_1');
    	var tooltipContent1 = LocaleManager.getInstance().getValue('PROTECT_TOOLTIP_CONTENT_1');

    	var tooltipTitle2 = LocaleManager.getInstance().getValue('PROTECT_TOOLTIP_TITLE_2');
    	var tooltipContent2 = LocaleManager.getInstance().getValue('PROTECT_TOOLTIP_CONTENT_2');

			var title = isProtected ? tooltipTitle1 : tooltipTitle2;
			var content = isProtected ? tooltipContent1 : tooltipContent2;
			
			var tooltipHtml = '<span class="title">' + title + '</span>'+
												'<p class="content">' + content + '</p>';
      return tooltipHtml;
    }
	});
}

MenuController.prototype.clearUploads = function clearUploads(showSpeech) {
	this.allUploadsDiv.html('');
	
	if (showSpeech)
		this.menuUploadsSpeech.show();
}

MenuController.prototype.refreshUploads = function refreshUploads() {
	var self = this;
	UploadManager.getInstance().getAllUploads(this.currentUserId, function(err, allUploads) {
  	self.clearUploads();
		if (!err && allUploads.length) {
  		// add new list
  		allUploads.forEach(function(upload) {
  			var tmpHtml = self.addUpload(upload);
  			self.onUploadFinished(tmpHtml, upload.code, location.origin+'/'+upload.code+'.'+upload.ext, upload.protected);
  		});
  	}
  	self.bindDeleteButtons();
  	self.bindProtectButtons();
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