

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    !('draggable' in document.createElement('span')) ) {
    $('#oldSchoolUpload').show();
    console.log("Upload HTML5 dispo !");
} else {
    $('#dropUpload').show();
}

var dropZone = new DropZone('dropZone', function(file) {

    var xhr = new XMLHttpRequest();
    xhr.open('POST', location.href + 'uploadAjax');

    xhr.onload = function() {
        console.log("load");
        //result.innerHTML += this.responseText;
        //handleComplete(file.size);
    };

    xhr.onerror = function() {
        console.log("error");
        //result.textContent = this.responseText;
        //handleComplete(file.size);
    };

    xhr.upload.onprogress = function(event) {
    }

    xhr.upload.onloadstart = function(event) {
        console.log("load start");
    }

    xhr.onreadystatechange=function() {
        if (xhr.readyState==4 && xhr.status==200) {
            var response = JSON.parse(this.responseText);
            var uploadUrl = response.uploadUrl;
            var fullUrl = response.fullUrl;
            var flash = document.createElement("div");
            flash.className = "alert";
            var message = '<strong>Succès !</strong> Accédez au fichier à cette url :<br><a href="%1">%2</a>';
            message = message.replace('%1', uploadUrl).replace('%2', fullUrl);
            flash.innerHTML = message;
            $('body').prepend(flash);
        }
    }

    // création de l'objet FormData
    var formData = new FormData();
    formData.append('uploadedFile', file);
    xhr.send(formData);
}, function(val) {console.log(val)});