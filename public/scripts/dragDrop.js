define(['lib/DropZone', 'lib/MenuController', 'lib/UploadProgress'], function(DropZone, MenuController, UploadProgress) {

	var DragDropController = function(menuController) {
		this.menuController = menuController;

	  this.allUploads = {};

		var dropZone = new DropZone('glooty', function(file) {

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

			console.log(uploadItemHtml);

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

			xhr.onreadystatechange=function() {
				if (xhr.readyState==4) {
					if (xhr.status==200) {
						var response = JSON.parse(this.responseText);

						if (response.errorMessage) {
							var title = 'Error';
							var message = response.errorMessage;
							menuController.onUploadFailed(uploadItemHtml);
							//new FlashMessage('error', title, message);
						} else {
							var uploadUrl = response.uploadUrl;
							var fullUrl = response.fullUrl;
							var uploadCode = response.uploadCode;

							/*var title = 'Upload successful';
							var message = 'Access your file here: <a href="%1">%2</a>';
							message = message.replace('%1', uploadUrl).replace('%2', fullUrl);*/

							menuController.onUploadFinished(uploadItemHtml, uploadCode, fullUrl);

							console.log(newUpload);
							//new FlashMessage('success', title, message);
						}
					} else {
					//new FlashMessage('error', 'Erf...', "Something has gone wrong...");
					}
					$('#overlay').hide();
				}
			}
			// création de l'objet FormData
			var formData = new FormData();
			formData.append('uploadedFile', file);
			xhr.send(formData);
		}.bind(this));
	}

	return DragDropController;
});