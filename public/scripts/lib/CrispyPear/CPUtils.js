/*
	Copyright (C) 2011  Jérémy Gabriele

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
	Browser-dependent definition of "loop call"
	Used in CPSceneManager.js
*/
window.requestAnimFrame = (function(){
	// return  window.requestAnimationFrame       || 
	// 		window.webkitRequestAnimationFrame || 
	// 		window.mozRequestAnimationFrame    || 
	// 		window.oRequestAnimationFrame      || 
	// 		window.msRequestAnimationFrame     || 
			return function(callback){
				window.setTimeout(callback, 1000 / 60);
			};
})();

/*
	Define POO's inheritance
*/
Function.prototype.inheritsFrom = function (parentClass) {
	this.prototype = new parentClass();
	this.prototype.parent = parentClass;
	this.prototype.constructor = this;
}

/*
	Define Singleton property
*/
Function.prototype.defineSingleton = function () {
	this._instance = null;
	this.args = arguments;

	function getSingletonInstance() {
		if (this._instance == null) {
			this._instance = new this();
		}

		return this._instance;
	}
	Object.defineProperty(this, 'instance', {
		get : getSingletonInstance,
		set : function() {
			console.log("Trying to set a singleton instance. Fuck you.");
		}
	});
}

/*
	Array methods
*/
Array.prototype.each = function(fn, bind){
	for (var i=0; i<this.length; i++){
		// if (i in this)
		fn.call(bind, this[i], i, this);
	}
	return this;
}

Array.prototype.flatten = function(){
	var array = [];
	for (var i=0; i<this.length; i++){
		var type = typeof(this[i]);
		if (type == 'null') continue;
		array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || (this[i] instanceof Array) ) ? Array.flatten(this[i]) : this[i]);
	}
	return array;
}

Array.prototype.contains = function(item) {
	return this.indexOf(item) != -1;
}

/*
	Object methods
*/

Object.each = function (obj, fn) {
	for (var key in obj) {
		fn.call(obj, obj[key], key);
	}
	return obj;
}

/*
	Keyboard events
*/

function getEventKey() {

	var allKeys = new Array(50);

	allKeys[16] = 'shift';
	allKeys[18] = 'alt';
	allKeys[20] = 'maj';
	allKeys[27] = 'esc';
	allKeys[32] = 'space';
	allKeys[37] = 'left';
	allKeys[38] = 'up';
	allKeys[39] = 'right';
	allKeys[40] = 'down';
	// allKeys[91] = 'cmd';

	this._key = allKeys[this.keyCode];

	return this._key;
}

KeyboardEvent.prototype._key = -1;
Object.defineProperty(KeyboardEvent.prototype, 'key', {
	get : getEventKey,
	set : function() {
		console.log("Trying to set key of an event. Fuck you.");
	}
});

// KEY_END		= 35;
// KEY_BEGIN	= 36;

// KEY_BACK_TAB 	= 8;
// KEY_TAB				= 9;
// KEY_SH_TAB  	= 16;
// KEY_ENTER			= 13;
// KEY_ESC				= 27;
// KEY_SPACE			= 32;
// KEY_DEL				= 46;

// KEY_A		= 65;
// KEY_B		= 66;
// KEY_C		= 67;
// KEY_D		= 68;
// KEY_E		= 69;
// KEY_F		= 70;
// KEY_G		= 71;
// KEY_H		= 72;
// KEY_I		= 73;
// KEY_J		= 74;
// KEY_K		= 75;
// KEY_L		= 76;
// KEY_M		= 77;
// KEY_N		= 78;
// KEY_O		= 79;
// KEY_P		= 80;
// KEY_Q		= 81;
// KEY_R		= 82;
// KEY_S		= 83;
// KEY_T		= 84;
// KEY_U		= 85;
// KEY_V		= 86;
// KEY_W		= 87;
// KEY_X		= 88;
// KEY_Y		= 89;
// KEY_Z		= 90;

// KEY_PF1		= 112;
// KEY_PF2		= 113;
// KEY_PF3		= 114;
// KEY_PF4		= 115;
// KEY_PF5		= 116;
// KEY_PF6		= 117;
// KEY_PF7		= 118;
// KEY_PF8		= 119;

/*
	Aliases and DOM functions
*/
document.id = document.getElementById;