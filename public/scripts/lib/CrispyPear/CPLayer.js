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

var CPLayer = function (zIndex, parentName) {
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = zIndex;
    this.canvas.width = CPGame.instance.canvasWidth;
    this.canvas.height = CPGame.instance.canvasHeight;
    document.id(CPGame.instance.parentDiv).appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');

    this.displayGroup = new CPDisplayGroup();
}

/*
    Destroy this and its children
*/
CPLayer.prototype.destroy = function () {

    this.displayGroup.destroy();
    this.displayGroup = null;

    this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null;

    for (var key in this) {
        this[key] = null;
    }
}

/*
    Insert a new CPDisplayObject inside the layer (actually inside its DG)
        - name : the name we will use to refer to the CPDisplayObject
        - object : the CPDisplayObject object
*/
CPLayer.prototype.insert = function (name, object) {
    object.canvas = this.canvas;
    object.context = object.canvas.getContext('2d');
    this.displayGroup.insert(name,object);
}

/*
    Remove a CPDisplayObject from the layer (actually from its DG)
        - name : the name of the CPDisplayObject
*/
CPLayer.prototype.remove = function (name) {
    this.displayGroup.remove(name);
}

CPLayer.prototype.update = function (dt){
    if (this.displayGroup) {
        var ctxToUpdate = this.displayGroup.update(dt);
        ctxToUpdate = ctxToUpdate.flatten() // moche...

        ctxToUpdate.each(function(ctx){
            CPSceneManager.instance.invalidate(ctx);
        }, this);
    }
}

CPLayer.prototype.onPause = function () {
    this.displayGroup.onPause();
}

CPLayer.prototype.onResume = function () {
    this.displayGroup.onResume();
}

CPLayer.prototype.render = function (ctxList){
    this.displayGroup.render(ctxList);
}