/*
    Copyright (C) 2012  Jeremy Gabriele

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
    Constructor
*/
var CPSceneManager = function () {

    var game = CPGame.instance;

    this.currentScene       = null;

    this.allCanvas          = [];
    this.allContexts        = [];
    this.allCanvasToRedraw  = [];

    this.timeLastFrame      = 0;

    this.invalidated        = false;
    this.paused             = false;

    // Instantiate the CPActionCanvas, responsible for catching mouse events
    this.actionCanvas = new CPActionCanvas(game.canvasWidth, game.canvasHeight);
    this.actionCanvas.canvas.width = game.canvasWidth;
    this.actionCanvas.canvas.height = game.canvasHeight;
    CPButton.actionCanvas = this.actionCanvas;


    // keydown call the scene's keydown and prevent default (arrow keys for ex)
    document.addEventListener('keydown', function(event){
        if(this.currentScene.keyDown) {
            // In the currentScene keyDown, we return false if we bind the key
            if (!this.currentScene.keyDown(event))
                event.preventDefault();
            }
    }.bind(this));

    document.addEventListener('keyup', function(event){
        if(this.currentScene.keyUp) {
            // In the currentScene keyUp, we return false if we bind the key
            if (!this.currentScene.keyUp(event))
                event.preventDefault();
            }
    }.bind(this));


    // Handle tabs (from tab bar) state
    /*focusActive = function focusActive() {
        this.resumeScene();
    }.bind(this);

    focusDesactive = function focusDesactive() {
        this.pauseScene();
    }.bind(this);

    // TODO: refactor with mootools' addEvent ?
    if(document.all) { // ie
        //console.log("ie");
        window.onfocusin = focusActive;
        window.onfocusout = focusDesactive;
    } else {
        window.onfocus = focusActive;
        window.onblur = focusDesactive;
    }*/

    this.update();
}

/*
    Singleton instance
*/
CPSceneManager.defineSingleton();

/*
    Set next scene with name sceneName using blendMode blending mode :
        - sceneName : the next scene's name
        - blendMode : the blending mode (fade, slide,...)
*/
CPSceneManager.prototype.setScene = function (sceneName, blendMode) {
    if (this.currentScene) {
        this.currentScene.destroy();
    }

    this.currentScene = null;
    this.currentScene = eval('new ' + sceneName + '()');
    this.currentScene.sceneManager = this;

    this.allContexts.each(function(ctx) {
        this.invalidate(ctx);
    }, this);
}

/*
    Tells the Scene Manager we need to redraw the canvas with context ctx :
        - ctx : the canvas' context that need to be redrawn
*/
CPSceneManager.prototype.invalidate = function (ctx) {
    this.invalidated = true;
    this.allCanvasToRedraw.push(ctx);
}

/*
    The game loop
*/
CPSceneManager.prototype.update = function (){
    window.requestAnimationFrame(function(time){

        if (this.paused) return;

        // calculate delta time (time now - last update() call)
        if (!time) time = new Date().getTime(); // ie
        var dt = (this.timeLastFrame == 0) ? 0 : 0.001 * (time - this.timeLastFrame);
        this.timeLastFrame = time;
        // console.log(dt);

        //CPGame.instance.fps = 1/dt;

        // call current scene's update(dt)
        if (this.currentScene) {
            if (this.currentScene.update) {
                this.currentScene.update(dt);
            } else {
                console.error("The currentScene does not have an update() function !");
            }
        }

        // Someone called "invalidate", so we need to redraw
        if (this.invalidated) {
            this.render();
            this.invalidated = false;
            this.allCanvasToRedraw = [];
        }

        // That makes the loop
        this.update();
    }.bind(this));
}

/*
    Pauses the game loop
*/
CPSceneManager.prototype.pauseScene = function (){
    this.paused = true;
    this.currentScene.onPause();
}

/*
    Resumes the game loop
*/
CPSceneManager.prototype.resumeScene = function () {
    this.paused = false;
    this.currentScene.onResume();
    this.timeLastFrame = 0; // TODO : trouver mieux, on perd une frame
    this.update();
}

/*
    Calls render on all the current scene's canvas
*/
CPSceneManager.prototype.render = function () {
    this.allCanvasToRedraw.each(function(ctx) {
        ctx.clearRect(0, 0, CPGame.instance.canvasWidth, CPGame.instance.canvasHeight);
    }, this);
    this.currentScene.render(this.allCanvasToRedraw);
}

CPSceneManager._sceneManager = null;
