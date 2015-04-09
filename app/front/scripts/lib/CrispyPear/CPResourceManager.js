/*
    Copyright (C) 2011  Jeremy Gabriele, Romaric Pighetti, Wiz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
    Constructor :
        - allImages : array [ {imageName: name, imagePath: path}, ...] containing all
        images and their path
        - onLoadedCallback : function() which will be called when all images
        are loaded
        - onProgressCallback : function(progress) which will be called each time an
        image is loaded
*/
var CPResourceManager = function (allImages, onLoadedCallback, onProgressCallback) {

    // We load images using PxLoader : http://thinkpixellab.com/pxloader/
    this.loader = new PxLoader();
    this.images = {};
    this.sounds = {};

}

/*
    Init function, as it's a singleton, constructor does not have parameters
*/
CPResourceManager.prototype.init = function (allImages, onLoadedCallback, onProgressCallback) {

    // TODO: bundle of images

    if (allImages) {
        allImages.each(function(item) {
            this.images[item.imageName] = new PxLoaderImage(item.imagePath);
            this.loader.add(this.images[item.imageName]);
        }.bind(this));
    }

    // Progress listener. Dispatch events to all listeners
    this.loader.addProgressListener(function(e) {
        var progress = e.completedCount/e.totalCount*100;
        if (onProgressCallback) onProgressCallback(progress);
    }); 

    // Callback when all images are loaded
    this.loader.addCompletionListener(function() { 
        if (onLoadedCallback) onLoadedCallback(this);
    }.bind(this));
    this.loader.start();
}

/*
    Singleton instance
*/
CPResourceManager.defineSingleton();

/*
    Start loading the images and sounds
*/
CPResourceManager.prototype.startLoading = function () {
    this.loader.start();
}

/*
    Get an image by its name
*/
CPResourceManager.prototype.getImage = function (imageName) {
    return this.images[imageName].img;
}

/*
    Get a sound by its name
*/
CPResourceManager.prototype.getSound = function (soundName) {
    return this.sounds[soundName];
}