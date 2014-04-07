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

var CPText = function (params) {

    this._content = 'no content';
    this.textAlign = 'left';
    this.textBaseline = 'top';
    this.font = '20pt Courier';
    this.color = 'rgb(0, 0, 0)';

    function contentChanged(newContent) {
        this._content = newContent;
        if (this.context) {

            this.context.font = this.font;
            this.width = this.context.measureText(this._content).width;
            this.height = this.context.measureText("eee").width;
            this.anchor = this.anchor;

            this.needsRedraw();
        }
    }
    Object.defineProperty(this, 'content', {
        get : function(){ return this._content; },
        set : contentChanged
    });

    function canvasChanged(newCanvas) {
        this._canvas = newCanvas;
        if (this._canvas) {
            this.context = this._canvas.getContext('2d');

            this.context.font = this.font;
            this.width = this.context.measureText(this._content).width;
            this.height = this.context.measureText("eee").width;
            this.anchor = this.anchor;
        }
    }
    Object.defineProperty(this, 'canvas', {
        get : function(){ return this._canvas; },
        set : canvasChanged
    });

    if (params) {
        CPDisplayObject.call(this, params);
        
        if (params.content) this.content = params.content;
        if (params.textAlign) this.textAlign = params.textAlign;
        if (params.textBaseline) this.textBaseline = params.textBaseline;
        if (params.font) this.font = params.font;
        if (params.color) this.color = params.color;
        if (params.backgroundColor) this.backgroundColor = params.backgroundColor;
    }
}

CPText.inheritsFrom(CPDisplayObject);
	
CPText.prototype.draw = function (){

    this.context.save();
    // Update width and height (size of the content with the font used)

    var pos = CPDisplayObject.prototype.prepareDraw.call(this);

    if (this.backgroundColor) {
        this.context.beginPath();
        this.context.rect(pos.x, pos.y, this.width, this.height);
        this.context.fillStyle = this.backgroundColor;
        this.context.fill();
    }

    // this.context.strokeStyle = 'black';
    // this.context.lineWidth = 3;
    // this.context.strokeText(this.content, pos.x, pos.y);
    this.context.textAlign = this.textAlign;
    this.context.textBaseline = this.textBaseline;
    this.context.font = this.font;
    this.context.fillStyle = this.color;
    this.context.fillText(this.content, pos.x, pos.y);

    this.context.restore();
}
