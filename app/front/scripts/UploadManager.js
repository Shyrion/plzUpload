/**
* Upload Manager takes care of webservice calls for uploads
*/

/**
* @class UploadManager
* @constructor
*/
var UploadManager = function() {
}

UploadManager._uploadManager = null;
UploadManager.getInstance = function() {
	if (!this._uploadManager)  {
		this._uploadManager = new UploadManager();
	}
	return this._uploadManager;
}

/**
* Get all uploads that belongs to an user
*
* @method getAllUploads
* @param {String} userId User FB Id
* @param {Function} callback A function callback(err, allUploads)
*/
UploadManager.prototype.getAllUploads = function getAllUploads(userId, callback) {
	$.ajax('/users/'+userId+'/uploads', {
    type: 'GET',
    complete: function(result) {
      var resultJson = JSON.parse( result.responseText );
      if (resultJson.result == 'ok') {
    		if (callback) callback(null, resultJson.allUploads);
      } else {
        console.log("Error", resultJson);
    		if (callback) callback(resultJson.error, null);
      }
    }.bind(this)
  });
}


/**
* Upload a new file
*
* @method addUpload
* @param {String} uploadCode Upload code
* @param {Function} callback A function callback(err, code)
*/
UploadManager.prototype.addUpload = function addUpload(file, callbacks) {

	var xhr = new XMLHttpRequest();
	xhr.open('POST', location.href + 'uploadAjax');

	xhr.onload = function() {
		if (callbacks && callbacks.load) callbacks.load();
	};

	xhr.onerror = function(e) {
		if (callbacks && callbacks.error) callbacks.error(e.error);
	};

	xhr.upload.onprogress = function(event) {
		progression = Math.round(event.loaded/event.total*100*100/100);
		if (callbacks && callbacks.progress) callbacks.progress(progression);
	}


	xhr.upload.onloadstart = function(event) {
		if (callbacks && callbacks.loadstart) callbacks.loadstart();
	};

	xhr.onreadystatechange = function() {
		if (xhr.readyState==4) {
			if (xhr.status==200) {
				var response = JSON.parse(this.responseText);

				if (response.result == 'ok') {
					var fullUrl = response.fullUrl;
					var uploadCode = response.uploadCode;

					if (callbacks && callbacks.success) callbacks.success(fullUrl, uploadCode);
				} else {
					var error = response.error;
					var message = error.message;

					if (callbacks && callbacks.error) callbacks.error(error);
				}
			} else {
				var error = new Error('Something has gone wrong');
				if (callbacks && callbacks.error) callbacks.error(error);
			}
		}
	}

	// Create FormData object
	var formData = new FormData();
	formData.append('uploadedFile', file);
	xhr.send(formData);
}


/**
* Remove an upload
*
* @method removeUpload
* @param {String} uploadCode Upload code
* @param {Function} callback A function callback(err, code)
*/
UploadManager.prototype.removeUpload = function removeUpload(uploadCode, callback) {
	$.ajax('/upload/' + uploadCode + '/remove', {
    type: 'GET',
    complete: function(result) {
      var resultJson = JSON.parse( result.responseText );
      if (resultJson.result == 'ok') {
      	if (callback) callback(null, uploadCode);
      } else {
        console.log("Error", resultJson);
      	if (callback) callback(resultJson.error, uploadCode);
      }
    }.bind(this)
  });
}


/**
* Protect an upload
*
* @method protectUpload
* @param {String} uploadCode Upload code
* @param {bool} protectionLevel Protection level
* @param {Function} callback A function callback(err, code)
*/
UploadManager.prototype.protectUpload = function protectUpload(uploadCode, protectionLevel, callback) {
	var data = { isProtected: protectionLevel };
	$.ajax('/upload/' + uploadCode + '/updateProtection', {
    type: 'POST',
    data: data,
    complete: function(result) {
      var resultJson = JSON.parse( result.responseText );
      if (resultJson.result == 'ok') {
      	if (callback) callback(null, uploadCode);
      } else {
        console.log("Error", resultJson);
      	if (callback) callback(resultJson.error, uploadCode);
      }
    }.bind(this)
  });
}