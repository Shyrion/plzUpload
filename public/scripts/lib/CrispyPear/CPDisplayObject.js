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

Anchors = {
	TOPLEFT:      0,
	TOPCENTER:    1,
	TOPRIGHT:     2,
	CENTERLEFT:   3,
	CENTER:       4,
	CENTERRIGHT:  5,
	BOTTOMLEFT:   6,
	BOTTOMCENTER: 7,
	BOTTOMRIGHT:  8
}

var CPDisplayObject = function (params) {

	// cpClass: 'DisplayableObject';

	this.x = this.y = 0;
	this.width = this.height = 0;
	this.flipX = this.flipY = false;
	
	this._anchor = Anchors.TOPLEFT;
	this._anchorOffsetX = this._anchorOffsetY = 0;

	function anchorChanged(newAnchor) {

		this._anchor = newAnchor;

		if ((this._anchor == Anchors.CENTER) ||
			(this._anchor == Anchors.TOPCENTER) ||
			(this._anchor == Anchors.BOTTOMCENTER)) {
			this._anchorOffsetX = -this.width/2;
		}
		if ((this._anchor == Anchors.CENTERRIGHT) ||
			(this._anchor == Anchors.TOPRIGHT) ||
			(this._anchor == Anchors.BOTTOMRIGHT)) {
			this._anchorOffsetX = -this.width;
		}
		if ((this._anchor == Anchors.CENTERLEFT) ||
			(this._anchor == Anchors.CENTER) ||
			(this._anchor == Anchors.CENTERRIGHT)) {
			this._anchorOffsetY = -this.height/2;
		}
		if ((this._anchor == Anchors.BOTTOMLEFT) ||
			(this._anchor == Anchors.BOTTOMCENTER) ||
			(this._anchor == Anchors.BOTTOMRIGHT)) {
			this._anchorOffsetY = -this.height;
		}
	}
	Object.defineProperty(this, 'anchor', {
		get : function() { return this._anchor; },
		set : anchorChanged.bind(this)
	});
	
	this.canvas = null;
	this.context = null;

	this._scale = 1;
	this.alpha = 1;

	function scaleChanged(newScale) {
		// Reset the sites to 100%
		this.width *= 1/this._scale;
		this.height *= 1/this._scale;

		// Update scale
		this._scale = newScale;

		// Apply it to width and height
		this.width *= this._scale;
		this.height *= this._scale;

		//this.anchor = this.anchor; // Need to update _anchorOffsets
	}
	Object.defineProperty(this, 'scale', {
		get : function() { return this._scale; },
		set : scaleChanged
	});

	if (params) {
		if (params.name) this.name = params.name;
		if (params.x) this.x = params.x;
		if (params.y) this.y = params.y;
		if (params.width) this.width = params.width;
		if (params.height) this.height = params.height;
		if (params.scale) this.scale = params.scale;
		if (typeof(params.anchor) != 'undefined') this.anchor = params.anchor;
	}
}

CPDisplayObject.prototype.destroy = function () {
	for (var key in this) {
		this[key] = null;
	}
}

CPDisplayObject.prototype.needsRedraw = function () {
	CPSceneManager.instance.invalidate(this.context);
}

CPDisplayObject.prototype.prepareDraw = function () {

	var posX = this.x+this._anchorOffsetX;
	var posY = this.y+this._anchorOffsetY;

  this.context.globalAlpha = this.alpha;

	if (this.flipX) {
	  this.context.scale(-1, 1);
	  posX = (posX*(-1))-this.width;
	}

	if (this.flipY) {
	  this.context.scale(1, -1);
	  posY = (posY*(-1))-this.height;
	}

	return {x: posX, y: posY}

}

CPDisplayObject.prototype.draw = function (){
}

