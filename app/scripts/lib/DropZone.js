var DropZone = function (id, onDropCallback) {

    this.dropElement = document.getElementById(id);
    this.fileToUpload = null;
    this.progress = 0;


    function onDragStart(event) {
        event.stopPropagation();
        event.preventDefault();
        this.className = 'dragover';
    }
    this.dropElement.addEventListener('dragstart', onDragStart, false);

    function onDragEnter(event) {
        event.stopPropagation();
        event.preventDefault();
        this.className = 'dragover';
    }
    this.dropElement.addEventListener('dragenter', onDragEnter, false);

    function onDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    this.dropElement.addEventListener('dragover', onDragOver, false);

    function onDragLeave(event) {
        event.stopPropagation();
        event.preventDefault();
        this.className = 'dragout';
    }
    this.dropElement.addEventListener('dragleave', onDragLeave, false);

    function onDragEnd(event) {
        event.stopPropagation();
        event.preventDefault();
        this.className = 'dragout';
    }
    this.dropElement.addEventListener('dragend', onDragEnd, false);

    function onDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        this.className = 'dragout';

        processFile(event.dataTransfer.files[0], onDropCallback);
    }
    this.dropElement.addEventListener('drop', onDrop, false);

    function processFile(file, callback) {
        if (!file) return;

        this.fileToUpload = file;

        if (callback) callback(file);
    }
}