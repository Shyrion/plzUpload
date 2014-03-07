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
    Example:

    var img = new CPImage({
        img: res.getImage("middlebg"),
        x: 10,
        y: 10,
        width: 600,
        height: 400,
        canvas: aCanvas
    })
*/

var CPImage = function (params) {

    if (params) {
        this.parent.call(this,params);
        
        if (params.img) {
          this.img = params.img;
        } else {
          console.log("invalid img");
        }

        this.width = this.img.width;
        this.height = this.img.height;
        // if (params.scale) this.scale = params.scale;
        if (params.width) this.width = params.width;
        if (params.height) this.height = params.height;
    }
}

CPImage.inheritsFrom(CPDisplayObject);
	
CPImage.prototype.draw = function () {
    this.context.save();

    var pos = CPDisplayObject.prototype.prepareDraw.call(this);

    this.context.drawImage(this.img,
        pos.x * this.scale,
        pos.y * this.scale,
        this.width*this.scale,
        this.height*this.scale);

    this.context.restore();
}
