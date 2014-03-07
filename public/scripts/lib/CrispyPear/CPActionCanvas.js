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

var CPActionCanvas = function (width, height) {
    this.canvas = document.createElement('canvas');
    document.id(CPGame.instance.parentDiv).appendChild(this.canvas);

    // function getOffset( el ) {
    //     var _x = 0;
    //     var _y = 0;
    //     while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
    //         _x += el.offsetLeft - el.scrollLeft;
    //         _y += el.offsetTop - el.scrollTop;
    //         el = el.offsetParent;
    //         console.log(_x + "," + _y);
    //     }
    //     return { x: _x, y: _y };
    // }
    // this.originX = getOffset(this.canvas).x;
    // this.originY = getOffset(this.canvas).y;

    var bounds = this.canvas.getBoundingClientRect();
    this.originX = Math.round(bounds.left);
    this.originY = Math.round(bounds.top);

    this.mouseX = -1;
    this.mouseY = -1;
    this.listeners = [];
    this.active = true;

    this.canvas.id = 'cpactioncanvas';

    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = 1000;

    // Mouse move
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    this.canvas.addEventListener('mouseenter', this.mouseEnter.bind(this));
    this.canvas.addEventListener('mouseleave', this.mouseLeave.bind(this));

    // Mouse action
    // this.canvas.addEvent('click', this.mouseClick.bind(this));
    this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
}
  
/*
    Add a new mouse event listener
        - listener : the listening object
*/
CPActionCanvas.prototype.addListener = function (listener) {
    this.listeners.push(listener);
}

/*
    Remove a previously added event listener
        - listener : the former listening object
*/
CPActionCanvas.prototype.removeListener = function (listener) {
    // TODO remove
}

/*
    Update the mouse position
        - event : the mouse event
*/
CPActionCanvas.prototype.setMousePos = function (event) {
    this.mouseX = event.pageX-this.originX;
    this.mouseY = event.pageY-this.originY;

    // console.log('(' + event.event.pageX + ',' + event.event.pageY + ')');
    // console.log('(' + this.mouseX + ',' + this.mouseY + ')');
}

/*
    Callback on mouse move
        - event : the mouse event
*/
CPActionCanvas.prototype.mouseMove = function (event) {
    if (!this.active) return;

    this.setMousePos(event);

    // check if the mouse is on one of our listeners
    this.listeners.each(function(object) {
        if ((object.x+object._anchorOffsetX < this.mouseX &&
            this.mouseX < (object.x+object._anchorOffsetX+object.width) ) &&
            (object.y+object._anchorOffsetY < this.mouseY &&
            this.mouseY < (object.y+object._anchorOffsetY+object.height))) {
            // console.log('over : ', object);
            object.overed = true;
            if (object.onOver) object.onOver();
        } else { // Mouse off of the object
            if (object.over) {
                object.overed = false;
                // mouse just leave the object
                if (object.onLeave) object.onLeave();
            }
        }
    }.bind(this));
}

/*
    Callback on mouse enter
        - event : the mouse event
*/
CPActionCanvas.prototype.mouseEnter = function (event) {
    if (!this.active) return;
    
    // console.log(this.originX, this.originY);
}

/*
    Callback on mouse leave
        - event : the mouse event
*/
CPActionCanvas.prototype.mouseLeave = function (event) {
    if (!this.active) return;
    
    this.mouseX = -1;
    this.mouseY = -1;
}

/*
    Callback on mouse click
        - event : the mouse event
*/
CPActionCanvas.prototype.mouseClick = function (event) {
    if (!this.active) return;
    
    if (this.mouseX == -1 || this.mouseY == -1) // ???
        console.error("We shouldn't be here...");
}


/*
    Callback on mouse down
        - event : the mouse event
*/
CPActionCanvas.prototype.mouseDown = function (event) {
    if (!this.active) return;
    
    if (this.mouseX == -1 || this.mouseY == -1) // ???
        console.error("We shouldn't be here...");

    // check if the mouse is on one of our listeners
    this.listeners.each(function(object) {
        if (object.overed) {
            if (object.onTouch) object.onTouch();
        }
    }.bind(this));
}

/*
    Callback on mouse up
        - event : the mouse event
*/
CPActionCanvas.prototype.mouseUp = function (event) {
    if (!this.active) return;
    
    if (this.mouseX == -1 || this.mouseY == -1) // ???
        console.error("We shouldn't be here...");



    // check if the mouse is on one of our listeners
    this.listeners.each(function(object) {
        if (object.touched) {
            // down + up = click
            if (object.onClick) object.onClick();
        }
    });
}