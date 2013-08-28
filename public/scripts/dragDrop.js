// variables
var dropArea = document.getElementById('dropZone');
//var canvas = document.querySelector('canvas');
//var context = canvas.getContext('2d');
var fileToUpload = null;
var totalProgress = 0;

if('draggable' in document.createElement('span')) {
    console.log("Upload HTML5 dispo !");
    $('#oldSchoolUpload').hide();
    $('#dropZone').css("width", $(window).width()*0.5);
    $('#dropZone').css("height",$(window).height()*0.4);
} else {
    $('#dropZone').hide();
}

// initialisation
(function(){

    // gestionnaires
    function initHandlers() {
        dropArea.addEventListener('drop', handleDrop, false);
        dropArea.addEventListener('dragover', handleDragOver, false);
    }

    function handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();

        console.log("Hover");
        dropArea.className = 'hover';
    }

    // glisser déposer
    function handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        processFile(event.dataTransfer.files[0]);
    }

    // traitement du lot de fichiers
    function processFile(file) {
        if (!file) return;

        fileToUpload = file;
        uploadFile(file, null);
    }

    // mise à jour de la progression
    function handleProgress(event) {
        var progress = totalProgress + event.loaded;
        console.log(progress);
    }

    // transfert du fichier
    function uploadFile(file, status) {

        // création de l'objet XMLHttpRequest
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://plzupload.fruitygames.fr/uploadAjax');
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
            handleProgress(event);
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
                flash.className = "flash";
                flash.id = "flashNotice";
                var message = 'Accédez au fichier à cette url :<br><a href="%1">%2</a>';
                message = message.replace('%1', uploadUrl).replace('%2', fullUrl);
                flash.innerHTML = message;
                $('body').prepend(flash);
            }
        }

        // création de l'objet FormData
        var formData = new FormData();
        formData.append('uploadedFile', file);
        xhr.send(formData);
    }

    initHandlers();
})();
