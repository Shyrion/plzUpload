var DragDropController = function(dropZoneId, menuController) {
	this.menuController = menuController;

  this.nbRunningUploads = 0;
  this.multiUploadAuthorized = false;

	var fileDropOK = true;

  //===== Glooty animation =====//

	$('#'+dropZoneId).on('dragover', function(e) {
		if (fileDropOK) {
			$('body').trigger('fileDragOver', e);
		}
	});

	$('#'+dropZoneId).on('dragenter', function(e) {
		if (fileDropOK) {
			$('body').trigger('fileDragEnter', e);
		} else {
			$('body').trigger('oneAtATime');
		}
	});

	$('#'+dropZoneId).on('dragleave', function(e) {
		if (fileDropOK) {
			$('body').trigger('fileDragOut');
		}
	});

	$('#'+dropZoneId).on('dragend', function(e) {
		$('body').trigger('fileDragFinished');
	});

	$('#'+dropZoneId).on('dragout', function(e) {
		$('body').trigger('fileDragOut');
	});

	$('body').on('noUploadRunning', function(e) {
		fileDropOK = true;
	});

	var dropZone = new DropZone(dropZoneId, function(file) {

    if (!file || file.type == '') { // No file (text) or no type (folder, without extensions)
    	$('body').trigger('fileDragOut');
    	return;
    }

		// If multiupload not authorized and we already have one running upload, return
		if (!this.multiUploadAuthorized && this.nbRunningUploads) {
			console.log('One at a time !');
			return;
		}

		var newUpload = {
			name: file.name,
			type: file.type
		};

		// Add new line in Menu
		var uploadItemHtml = this.menuController.addUpload(newUpload);

		// Create the corresponding progress bar
		var progress = new UploadProgress(uploadItemHtml);

		var self = this;
		UploadManager.getInstance().addUpload(file, {
			load: function() {
				console.log("load", newUpload);
			},
			error: function(err) {
				NoticeManager.getInstance().showNotice(err);
				this.menuController.onUploadFailed(uploadItemHtml);

				// Decrease running uploads counter + send even if no upload running
				self.nbRunningUploads--;

				if (self.nbRunningUploads <= 0) {
					$('body').trigger('noUploadRunning');
				}
			}.bind(this),
			loadstart: function(event) {
				console.log("load start");

				if (!this.menuController.isOpened()) this.menuController.open();
			}.bind(this),
			progress: function(progession) {
				progress.setProgress(progression);
			},
			success: function(fullUrl, uploadCode) {
				menuController.onUploadFinished(uploadItemHtml, uploadCode, fullUrl);

				NoticeManager.getInstance().showNotice({
					content: 'Your upload <span class="oblique colored">' + uploadCode + '</span> has been successfuly uploaded'
				});

				// Decrease running uploads counter + send even if no upload running
				self.nbRunningUploads--;

				if (self.nbRunningUploads <= 0) {
					$('body').trigger('noUploadRunning');
				}
			}

		});

		// Increase running uploads counter
		this.nbRunningUploads++;

		// Trigger event
		if (fileDropOK) {
			$('body').trigger('fileDropped');
			if (!this.multiUploadAuthorized) fileDropOK = false;
		}
	}.bind(this));
};

DragDropController.prototype.authorizeMultiUpload = function() {
  this.multiUploadAuthorized = true;
};

DragDropController.prototype.unauthorizeMultiUpload = function() {
	this.multiUploadAuthorized = false;
};