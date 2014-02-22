define([], function() {

	var UploadProgress = function (progressDiv) {
		this.progressDiv = progressDiv;
		this.progressBar = $("progress", this.progressDiv);
		this.progressValue = $(".progressValue", this.progressDiv);
	}

	UploadProgress.prototype.setProgress = function setProgress(newProgress) {
		this.progressBar.attr('value', newProgress);
		this.progressValue.html(newProgress + "%");
	}

	return UploadProgress;

});