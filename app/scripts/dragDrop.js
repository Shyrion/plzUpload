var DragDropController = function(dropZoneId, menuController) {
	this.menuController = menuController;

  this.nbRunningUploads = 0;
  this.allUploads = {};
  this.multiUploadAuthorized = false;

	var dropZone = new DropZone(dropZoneId, function(file) {

		// If multiupload not authorized and we already have one running upload, error
		if (!this.multiUploadAuthorized && this.nbRunningUploads) {
			console.log('One at a time !');
			return;
		}

		var xhr = new XMLHttpRequest();
		xhr.open('POST', location.href + 'uploadAjax');

		var newUpload = {
			name: file.name,
			type: file.type
		};

		// If we're already uploading the file, return
		if (this.allUploads[file.name]) {
			console.log("File already uploading...");
			return;
		}

		this.allUploads[name] = newUpload;

		// Add new line in Menu
		var uploadItemHtml = this.menuController.addUpload(newUpload);

		// Create the corresponding progress bar
		var progress = new UploadProgress($('.progress', uploadItemHtml)[0]);

		xhr.onload = function() {
			console.log("load", newUpload);
		};

		xhr.onerror = function() {
			console.log("error");

			menuController.onUploadFailed(uploadItemHtml);
		};

		xhr.upload.onprogress = function(event) {
			progression = Math.round(event.loaded/event.total*100*100/100);
			progress.setProgress(progression);
		}


		xhr.upload.onloadstart = function(event) {
			console.log("load start");

			if (!this.menuController.isOpened()) this.menuController.open();
		}.bind(this);

		var self = this;
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				if (xhr.status==200) {
					var response = JSON.parse(this.responseText);

					console.log(response);

					if (response.result == 'ok') {
						var fullUrl = response.fullUrl;
						var uploadCode = response.uploadCode;

						menuController.onUploadFinished(uploadItemHtml, uploadCode, fullUrl);
					} else {
						var error = response.error;
						var message = error.message;

						menuController.onUploadFailed(uploadItemHtml);
					}

					// Decrease running uploads counter + send even if no upload running
					self.nbRunningUploads--;

					if (!self.nbRunningUploads) {
						$('body').trigger('noUploadRunning');
					}
				} else {
				//new FlashMessage('error', 'Erf...', "Something has gone wrong...");
				}
			}
		}
		// création de l'objet FormData
		var formData = new FormData();
		formData.append('uploadedFile', file);
		xhr.send(formData);

		// Increase running uploads counter
		this.nbRunningUploads++;
	}.bind(this));
};

DragDropController.prototype.authorizeMultiUpload = function() {
  this.multiUploadAuthorized = true;
};

DragDropController.prototype.unauthorizeMultiUpload = function() {
	this.multiUploadAuthorized = false;
};