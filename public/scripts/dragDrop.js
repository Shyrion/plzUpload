

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
        if (xhr.readyState==4) {
            if (xhr.status==200) {
                var response = JSON.parse(this.responseText);

                if (response.errorMessage) {
                    var title = 'Error';
                    var message = response.errorMessage;
                
                    new FlashMessage('error', title, message);
                } else {

                    var uploadUrl = response.uploadUrl;
                    var fullUrl = response.fullUrl;
                    
                    var title = 'Upload successful';
                    var message = 'Access your file here: <a href="%1">%2</a>';
                    message = message.replace('%1', uploadUrl).replace('%2', fullUrl);
                
                    new FlashMessage('success', title, message);
                }
            } else {
                new FlashMessage('error', 'Erf...', "Something has gone wrong...");
            }
        }
    }

    // création de l'objet FormData
    var formData = new FormData();
    formData.append('uploadedFile', file);
    xhr.send(formData);
}, function(val) {console.log(val)});
