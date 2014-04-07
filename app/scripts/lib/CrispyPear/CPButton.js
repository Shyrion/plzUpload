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

var CPButton = function (params) {

    this.text = null;
    this.buttonNormal = null;
    this.buttonOver = null;
    this.buttonTouched = null;

    // state
    this.over = false;
    this.touched = false;

    // actions
    this._onClick = null;

    this._textWidth = 0;


    if (params) {
        this.parent.call(this,params);
        
        // text
        // bgColor
        // strokeColor
        // strokeWidth

        if (params.buttonNormal) this.buttonNormal = params.buttonNormal;
        if (params.buttonOver) this.buttonOver = params.buttonOver;
        if (params.buttonTouched) this.buttonTouched = params.buttonTouched;

        // this.text = new CPText({
        //     x: _w/2,
        //     y: 30,
        //     width: 100,
        //     height: 30,
        //     canvas: this.buttonsLayer.canvas,
        //     content: 'Jeu',
        //     textAlign: 'center',
        //     textBaseline: 'top',
        //     font: '30pt BeautifulEveryTime',
        //     color: 'rgb(255, 0, 0)'
        // });

        if (params.text) this.text = params.text;
        if (params.font) this.font = params.font;
        if (params.bgColor) this.bgColor = params.bgColor;
        if (params.strokeColor) this.strokeColor = params.strokeColor;
        if (params.bgColorOver) this.bgColorOver = params.bgColorOver;
        if (params.strokeColorOver) this.strokeColorOver = params.strokeColorOver;
        if (params.strokeWidth) this.strokeWidth = params.strokeWidth;
        if (params.bgColorTouched) this.bgColorTouched = params.bgColorTouched;
        if (params.strokeColorTouched) this.strokeColorTouched = params.strokeColorTouched;

        if (params.onClick) this._onClick = params.onClick;
    }

    CPButton.actionCanvas.addListener(this);

    this.over = false;
    this.touched = false;
}
	
CPButton.inheritsFrom(CPDisplayObject);

//== Mouse events callbacks ==//

/*
    Callback when mouse is over
*/
CPButton.prototype.onOver = function() {
    if (!this.over) {
        this.needsRedraw();
        this.over = true;
    }
}

/*
    Callback when mouse leaves the object
*/
CPButton.prototype.onLeave = function() {
    this.needsRedraw();
    this.touched = false;
    this.over = false;
}

/*
    Callback when mouse touches on the object
*/
CPButton.prototype.onTouch = function() {
    if (!this.touched) {
        this.needsRedraw();
        this.touched = true;
    }
}

/*
    Callback when mouse clicks on the object (touch down + touch up, actually)
*/
CPButton.prototype.onClick = function() {
    this.needsRedraw();
    this.touched = false;
    if (this._onClick) this._onClick();
}

CPButton.prototype.draw = function () {
    // draw rect
    // this.context.beginPath();
    // this.context.rect(this.x, this.y, this.width, this.height);
    // this.context.fillStyle = this['bgColor'+(this.touched? 'Touched' : (this.over? 'Over' : ''))];
    // this.context.fill();
    // this.context.lineWidth = this.strokeWidth;
    // this.context.strokeStyle = this['strokeColor'+(this.touched? 'Touched' : (this.over? 'Over' : ''))];
    // this.context.stroke();

    // if (this.context.measureText(this.text).width > this.width) {
    //     this.width = this.context.measureText(this.text).width;
    // }

    this.context.save();

    var pos = CPDisplayObject.prototype.prepareDraw.call(this);

    var button = (this.touched ? this.buttonTouched :
        (this.over ? this.buttonOver: this.buttonNormal));

    this.context.drawImage(button,
        pos.x * this.scale,
        pos.y * this.scale,
        this.width*this.scale,
        this.height*this.scale);

    if (this.text == null) return;

    // draw text
    this.context.font = this.font;
    this._textWidth = this.context.measureText("ee").width;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
    this.context.fillStyle = 'black';
    this.context.fillText(this.text,
        this.x+this.width/2,
        this.y+this.height/2+(this.touched? 1 : 0) - this._textWidth/2);

    this.context.restore();
}

CPButton.actionCanvas = null;
