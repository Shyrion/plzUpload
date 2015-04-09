/*
    Copyright (C) 2011  Jeremy Gabriele

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

var DEFAULT_CANVAS_WIDTH = 480;
var DEFAULT_CANVAS_HEIGHT = 320;
var DEFAULT_PARENT_DIV = "game_div";

CPGame = function (settingPath, callback) {

    // Async get all settings
    var xhr = new XMLHttpRequest();
    xhr.open('GET', settingPath);

    //console.log(settingPath);

    xhr.onerror = function() {
      console.log("error");
    };

    var self = this;
    xhr.onreadystatechange=function() {
      if (xhr.readyState==4) {
        if (xhr.status==200 || xhr.status==0) { // REMOVE LAST ONE, ONLY FOR TEST on FF !
          
          var response = JSON.parse(this.responseText);

          //console.log(response);

          if (response.canvasSize) {
            if (response.canvasSize.width == 'max') {
              self.canvasWidth = document.body.clientWidth;
            } else {
              self.canvasWidth = response.canvasSize.width || DEFAULT_CANVAS_WIDTH;
            }

            if (response.canvasSize.height == 'max') {
              self.canvasHeight = document.body.clientHeight;
            } else {
            self.canvasHeight = response.canvasSize.height || DEFAULT_CANVAS_HEIGHT;
            }
          }

          self.allImages = response.allImages;

          self.parentDiv = response.parentDiv || DEFAULT_PARENT_DIV;

          if (callback) callback(self);
        } else {
          console.log("Error while loading settings. Cannot do much more :/.");
        }
      }
    }

    xhr.send();

    CPGame._instance = this;
}

/*
    Singleton instance
*/
CPGame.defineSingleton();