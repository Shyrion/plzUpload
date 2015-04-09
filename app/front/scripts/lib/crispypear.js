function PxLoader(c){c=c||{};if(c.statusInterval==null){c.statusInterval=5000}if(c.loggingDelay==null){c.loggingDelay=20*1000}if(c.noProgressTimeout==null){c.noProgressTimeout=Infinity}var f=[],a=[],m,b=+new Date;var i={QUEUED:0,WAITING:1,LOADED:2,ERROR:3,TIMEOUT:4};var j=function(n){if(n==null){return[]}if(Array.isArray(n)){return n}return[n]};this.add=function(n){n.tags=j(n.tags);if(n.priority==null){n.priority=Infinity}f.push({resource:n,state:i.QUEUED})};this.addProgressListener=function(o,n){a.push({callback:o,tags:j(n)})};this.addCompletionListener=function(o,n){a.push({tags:j(n),callback:function(p){if(p.completedCount===p.totalCount){o()}}})};var h=function(n){n=j(n);var o=function(t){var u=t.resource,s=Infinity;for(var r=0,p=u.tags.length;r<p;r++){var q=n.indexOf(u.tags[r]);if(q>=0&&q<s){s=q}}return s};return function(q,p){var s=o(q),r=o(p);if(s<r){return -1}if(s>r){return 1}if(q.priority<p.priority){return -1}if(q.priority>p.priority){return 1}}};this.start=function(o){m=+new Date;var p=h(o);f.sort(p);for(var q=0,n=f.length;q<n;q++){var r=f[q];r.status=i.WAITING;r.resource.start(this)}setTimeout(d,100)};var d=function(){var r=false,s=(+new Date)-b,o=(s>=c.noProgressTimeout),p=(s>=c.loggingDelay);for(var q=0,n=f.length;q<n;q++){var t=f[q];if(t.status!==i.WAITING){continue}t.resource.checkStatus();if(t.status===i.WAITING){if(o){t.resource.onTimeout()}else{r=true}}}if(p&&r){e()}if(r){setTimeout(d,c.statusInterval)}};this.isBusy=function(){for(var o=0,n=f.length;o<n;o++){if(f[o].status===i.QUEUED||f[o].status===i.WAITING){return true}}return false};var l=function(p,o){for(var q=0,n=p.length;q<n;q++){if(o.indexOf(p[q])>=0){return true}}return false};var k=function(p,v){var u=null;for(var q=0,t=f.length;q<t;q++){if(f[q].resource===p){u=f[q];break}}if(u==null||u.status!==i.WAITING){return}u.status=v;b=+new Date;var n=p.tags.length;for(var q=0,s=a.length;q<s;q++){var o=a[q],r;if(o.tags.length===0){r=true}else{r=l(p.tags,o.tags)}if(r){g(u,o)}}};this.onLoad=function(n){k(n,i.LOADED)};this.onError=function(n){k(n,i.ERROR)};this.onTimeout=function(n){k(n,i.TIMEOUT)};var g=function(o,u){var r=0,t=0;for(var q=0,n=f.length;q<n;q++){var s=f[q],p;if(u.tags.length===0){p=true}else{p=l(s.resource.tags,u.tags)}if(p){t++;if(s.status===i.LOADED||s.status===i.ERROR||s.status===i.TIMEOUT){r++}}}u.callback({resource:o.resource,loaded:(o.status===i.LOADED),error:(o.status===i.ERROR),timeout:(o.status===i.TIMEOUT),completedCount:r,totalCount:t})};var e=this.log=function(q){if(!window.console){return}var p=Math.round((+new Date-m)/1000);window.console.log("PxLoader elapsed: "+p+" sec");for(var o=0,n=f.length;o<n;o++){var s=f[o];if(!q&&s.status!==i.WAITING){continue}var r="PxLoader: #"+o+" "+s.resource.getName();switch(s.status){case i.QUEUED:r+=" (Not Started)";break;case i.WAITING:r+=" (Waiting)";break;case i.LOADED:r+=" (Loaded)";break;case i.ERROR:r+=" (Error)";break;case i.TIMEOUT:r+=" (Timeout)";break}if(s.resource.tags.length>0){r+=" Tags: ["+s.resource.tags.join(",")+"]"}window.console.log(r)}}}if(!Array.isArray){Array.isArray=function(a){return Object.prototype.toString.call(a)=="[object Array]"}}if(!Array.prototype.indexOf){Array.prototype.indexOf=function(c){if(this==null){throw new TypeError()}var d=Object(this);var a=d.length>>>0;if(a===0){return -1}var e=0;if(arguments.length>0){e=Number(arguments[1]);if(e!=e){e=0}else{if(e!=0&&e!=Infinity&&e!=-Infinity){e=(e>0||-1)*Math.floor(Math.abs(e))}}}if(e>=a){return -1}var b=e>=0?e:Math.max(a-Math.abs(e),0);for(;b<a;b++){if(b in d&&d[b]===c){return b}}return -1}}function PxLoaderImage(a,i,f){var h=this,g=null;this.img=new Image();this.tags=i;this.priority=f;var b=function(){if(h.img.readyState=="complete"){c();g.onLoad(h)}};var e=function(){c();g.onLoad(h)};var d=function(){c();g.onError(h)};var c=function(){h.unbind("load",e);h.unbind("readystatechange",b);h.unbind("error",d)};this.start=function(j){g=j;h.bind("load",e);h.bind("readystatechange",b);h.bind("error",d);h.img.src=a};this.checkStatus=function(){if(h.img.complete){c();g.onLoad(h)}};this.onTimeout=function(){c();if(h.img.complete){g.onLoad(h)}else{g.onTimeout(h)}};this.getName=function(){return a};this.bind=function(j,k){if(h.img.addEventListener){h.img.addEventListener(j,k,false)}else{if(h.img.attachEvent){h.img.attachEvent("on"+j,k)}}};this.unbind=function(j,k){if(h.img.removeEventListener){h.img.removeEventListener(j,k)}else{if(h.img.detachEvent){h.img.detachEvent("on"+j,k)}}}}PxLoader.prototype.addImage=function(c,b,d){var a=new PxLoaderImage(c,b,d);this.add(a);return a.img};function PxLoaderSound(f,d,c,e){var b=this,a=null;this.tags=c;this.priority=e;this.sound=soundManager.createSound({id:f,url:d,autoLoad:false,onload:function(){a.onLoad(b)},onsuspend:function(){a.onTimeout(b)},whileloading:function(){var h=this["bytesLoaded"],g=this["bytesTotal"];if(h>0&&(h===g)){a.onLoad(b)}}});this.start=function(h){a=h;var g=navigator.userAgent.match(/(ipad|iphone|ipod)/i);if(g){a.onTimeout(b)}else{this.sound.load()}};this.checkStatus=function(){switch(b.sound.readyState){case 0:case 1:break;case 2:a.onError(b);break;case 3:a.onLoad(b);break}};this.onTimeout=function(){a.onTimeout(b)};this.getName=function(){return d}}PxLoader.prototype.addSound=function(e,b,a,c){var d=new PxLoaderSound(e,b,a,c);this.add(d);return d.sound};
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

/*
	Browser-dependent definition of "loop call"
	Used in CPSceneManager.js
*/
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame 
	// 		window.webkitRequestAnimationFrame || 
	// 		window.mozRequestAnimationFrame    || 
	// 		window.oRequestAnimationFrame      || 
	// 		window.msRequestAnimationFrame     || 
			/*return function(callback){
				window.setTimeout(callback, 1000 / 60);
			};*/
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
    }
}

CPImage.inheritsFrom(CPDisplayObject);
	
CPImage.prototype.draw = function () {
    this.context.save();

    var pos = CPDisplayObject.prototype.prepareDraw.call(this);

    this.context.drawImage(this.img,
        pos.x,
        pos.y,
        this.width,
        this.height);

    /*this.context.rect(pos.x,pos.y, this.width, this.height);
    this.context.stroke();*/

    this.context.restore();
}

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
	How to use ?
	
	var sprite = new CPSprite({
     x: 100,
     y: 100,
     width: 32, // useless
     height: 32, // useless
     canvas : document.id('canvas')
   });
   
   sprite.add({
     sequenceName: 'run',
     spriteSheet: 'spriteSheet.png',
     totalFrame: 4,
     offset: 0,
     frameSize: {w: 32, h: 32},
     framePerSecond: 1,
     scale: 1
   });
   
   sprite.add({
     sequenceName: 'walk',
     spriteSheet: 'spriteSheet.png',
     totalFrame: 4,
     offset: 4,
     frameSize: {w: 32, h: 32},
     framePerSecond: 0.5, // every 2 sec
     scale: 1
   });
   
   sprite.start('run');
   sprite.start('run'); // does nothing
   //sprite.start('walk', {startFrame: 2, repeatCount: 1});
*/

var CPSprite = function (params) {

	if (params) {
		CPDisplayObject.call(this, params);
	}

	// this.cpClass = "SpriteObject";
	this.sequences = {};
	this.currentSequence = null;

	this.nextTick = 1; // sec
	this.timeBeforeTick = 0; // sec
	this.paused = true;
	this.isLocked = false;

	this.firstDraw = false;
}

CPSprite.inheritsFrom(CPDisplayObject);

/*
	ADD a new sequence that can be played :
	sequenceName (MANDATORY)	: name of the sequence
	spriteSheet (MANDATORY)		: spriteSheet that contains the sequence
	totalFrame					: number of images of the animation
	offset						: offset of the first image
	framePerSecond				: images will change each 1/framePerSecond sec
	scale						: scale of the image
	frameSize					: size of an image of the animation
*/
CPSprite.prototype.add = function (params){
		var seq = {};
		seq.offset = 0;
		seq.totalFrame = 0;
		seq.nextTick = 1000;
		seq.frameSize = {w:0, h:0};
		seq.scale = 1;
		
		if(params.sequenceName)
			seq.sequenceName = params.sequenceName;
		else {
			console.log("No name for the sequence : "+params);
			return;
		}
		if (params.spriteSheet)
	    {
		    seq.img = params.spriteSheet;
		    seq.sheetSize = {w: seq.img.width, h: seq.img.height};
	    } else {
	    	console.log("invalid spriteSheet for " + seq.name);
				return;
	    }
	    if (params.totalFrame) seq.totalFrame = params.totalFrame;
	    if (params.offset) seq.offset = params.offset;
	    if (params.framePerSecond) seq.nextTick = 1/params.framePerSecond;
	    seq.timeBeforeTick = seq.nextTick;
	    if (params.scale) seq.scale = params.scale;
	    if (params.frameSize) seq.frameSize = params.frameSize;
	    seq.currentFrame = seq.offset+1;
	    seq.framePerRow = Math.floor(seq.sheetSize.w/seq.frameSize.w);
	    
	    this.width = seq.frameSize.w;
	    this.height = seq.frameSize.h;
		this.sequences[params.sequenceName] = seq;
		// this.currentSequence = seq;
	}
	
/*
	INCREASE the sprite counter. Returns true if the animation is finished.
*/
CPSprite.prototype.currentFramePlusPlus = function (){
	if (!this.paused) {
		if (this.currentSequence.currentFrame+1 > 
			this.currentSequence.totalFrame+this.currentSequence.offset) {
			// if repeatCount is set, we need to check...
			if (this.currentSequence.repeatCount != null) {
				// We decrease the counter
				if (this.currentSequence.repeatCount <= 1) {
					// The animation should be stopped
					//this.pause();
					if (this.currentSequence.onFinishCallback)
						this.currentSequence.onFinishCallback();
					return true;
				} else {
					this.currentSequence.repeatCount--;
				}
		  }
    	this.currentSequence.currentFrame = this.currentSequence.offset+1;
		} else {
    	this.currentSequence.currentFrame += 1;
    }
    return false;
	} else {
		return true;
	}
}
  
/*
	START the named animation. Optionally execute callback each time the animation ends
	params = {
	  repeatCount => plays the animation X times, then stop (no loop)
	  startFrame => starts the animation from this frame (useful when walk->run)
	}
*/
CPSprite.prototype.start = function (sequenceName, params, callback) {
	if (!this.locked()) {

		// return if we started an already started sequence.
		// Exception if the animation was previously paused.
		// IS THIS USEFUL ?
		/*if ( (this.currentSequence == this.sequences[sequenceName]) && !this.paused )
			return;*/

		this.paused = false;

		this.currentSequence = this.sequences[sequenceName]

		// update width and height
		this.width = this.currentSequence.frameSize.w;
		this.height = this.currentSequence.frameSize.h;
		this.scale = this.currentSequence.scale;
		this.anchor = this.anchor;

		if (params && params.repeatCount) this.currentSequence.repeatCount = params.repeatCount;

		// start the anim from the 1rst frame or not ?
		if (params && params.startFrame &&
			params.startFrame>0 && params.startFrame<=thisCurrentSequence.totalFrame)
			this.currentSequence.currentFrame = params.startFrame;
		else
			this.currentSequence.currentFrame = this.currentSequence.offset+1;

		this.currentSequence.onFinishCallback = callback;

		this.currentSequence.timeBeforeTick = this.currentSequence.nextTick;

		this.firstDraw = true;
	}
}

/*
	Play the named animation X times, then execute a callback
*/
CPSprite.prototype.playRepeat = function playRepeat(sequenceName, repeatCount, callback) {
	this.start(sequenceName, {repeatCount: repeatCount}, callback);
}

/*
	Play the named animation once, then execute a callback
*/
CPSprite.prototype.playOnce = function playOnce(sequenceName, callback) {
	this.playRepeat(sequenceName, 1, callback);
}
  
CPSprite.prototype.locked = function locked() {
	return this.isLocked;
}

CPSprite.prototype.lock = function lock() {
	this.isLocked = true;
}

CPSprite.prototype.unlock = function () {
	this.isLocked = false;
}

/*
	Pause the current animation (lock is stronger)
*/
CPSprite.prototype.pause = function (){
	this.paused = true;
	//console.log('pause');
}

/*
	Resume the current animation
*/
CPSprite.prototype.resume = function (){
	this.paused = false;
	//console.log('resume');
}
  
CPSprite.prototype.gotoAndStop = function (i)
{
	if (this.currentSequence.totalFrame >= i && i>0)
		this.currentSequence.currentFrame = i;
	this.draw();
	this.pause();
}
	
CPSprite.prototype.update = function (dt){
	// Need to redraw immediatly		
	if (this.firstDraw) {
		this.firstDraw = false;
		return this.context;
	}

	// If pause, no need to redraw...
	if (this.paused || this.isLocked) return false;

	this.currentSequence.timeBeforeTick = this.currentSequence.timeBeforeTick-dt;

	if (this.currentSequence.timeBeforeTick <= 0) {
		var needsToRedraw = !this.currentFramePlusPlus();
		this.currentSequence.timeBeforeTick += this.currentSequence.nextTick;
		return (needsToRedraw ? this.context : null);
	}
	return false;
}
	
CPSprite.prototype.draw = function (){

	this.context.save();

	var pos = CPDisplayObject.prototype.prepareDraw.call(this);

	//if (this.paused || this.isLocked) return;

	// calculate the good image to display
	var imgBounds = [((this.currentSequence.currentFrame-1)%this.currentSequence.framePerRow)*this.currentSequence.frameSize.w,
										(Math.floor((this.currentSequence.currentFrame-1)/this.currentSequence.framePerRow))*this.currentSequence.frameSize.h,
										this.currentSequence.frameSize.w,
										this.currentSequence.frameSize.h];

	this.context.drawImage( this.currentSequence.img, // image
		// (x,y,w,h) we will crop within the image
		imgBounds[0], imgBounds[1], imgBounds[2], imgBounds[3],
		// (x,y,w,h) of the final image
		pos.x,pos.y, this.width, this.height);

	/*this.context.rect(pos.x,pos.y, this.width*this.scale, this.height*this.scale);
	this.context.stroke();*/

	this.context.restore();
}

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

var CPDisplayGroup = function (){
	this.scale = 1;
	this.canvasToUpdate = [];
	this.displayObjects = {};
	this._x = this._y = 0;
	this._width = this._height = 0;
	this._boxMinX = this._boxMinY = null;
	this._boxMaxX = this._boxMaxY = null;

	function xValueChanged(newX) {
		var deltaX = newX - this._x;

		Object.each(this.displayObjects, function(item){
			item.x += deltaX;
			this.canvasToUpdate.push(item.context);
		}.bind(this));

		this._x = newX;
	}
	Object.defineProperty(this, 'x', {
		get : function(){ return this._x; },
		set : xValueChanged
	});

	function yValueChanged(newY) {
		var deltaY = newY - this._y;

		Object.each(this.displayObjects, function(item){
			item.y += deltaY;
			this.canvasToUpdate.push(item.context);
		}.bind(this));

		this._y = newY;
	}
	Object.defineProperty(this, 'y', {
		get : function(){ return this._y; },
		set : yValueChanged
	});
}

/*
	Destroy this and its children
*/
CPDisplayGroup.prototype.destroy = function () {
	Object.each(this.displayObjects, function(item) {
		item.destroy();
		item = null;
	});

	for (var key in this) {
		this[key] = null;
	}
}

/*
	Insert a new CPDisplayObject inside this
		- name : the name we will use to refer to the CPDisplayObject
			or CPDisplayGroup
		- object : the CPDisplayObject or CPDisplayGroup object
*/
CPDisplayGroup.prototype.insert = function (name, object) {
	this.displayObjects[name] = object;

	if (object.width > this._width) this._width = object.width;
	if (object.height > this._height) this._height = object.height;

	var minObjectX = object.x + object._anchorOffsetX;
	var minObjectY = object.y + object._anchorOffsetY;
	var maxObjectX = minObjectX + object.width;
	var maxObjectY = minObjectY + object.height;

	// Translate the object with displayGroup's coordinate
	object.x += this.x;
	object.y += this.y;

	// console.log(object.content, minObjectX, minObjectY, maxObjectX, maxObjectY);

	if ((this._boxMinX==null) || (this._boxMinX > minObjectX))
		this._boxMinX = minObjectX;
	if ((this._boxMinY==null) || (this._boxMinY > minObjectY))
		this._boxMinY = minObjectY;
	if ((this._boxMaxX==null) || (this._boxMaxX < maxObjectX))
		this._boxMaxX = maxObjectX;
	if ((this._boxMaxY==null) || (this._boxMaxY < maxObjectY))
		this._boxMaxY = maxObjectY;

	// console.log(this._boxMinX,this._boxMinY,
	// 	this._boxMaxX,this._boxMaxY);

	object.canvas = this.canvas;
	object.context = this.context;

	if (object.needsRedraw && object.context)
		object.needsRedraw();
}

/*
	Remove a CPDisplayObject from this
		- name : the name of the CPDisplayObject we want to remove
*/
CPDisplayGroup.prototype.remove = function (name) {
	this.displayObjects[name].needsRedraw();
	this.displayObjects[name] = null;
	delete this.displayObjects[name];
}

/*
	Update loop
		- dt : delta time since the last update call
*/
CPDisplayGroup.prototype.update = function (dt) {
	var toUpdate = this.canvasToUpdate;

	Object.each(this.displayObjects, function(item) {
		if (item.update) {
			var ctxOrCtxlist = item.update(dt);
			if (ctxOrCtxlist) {
				if (item instanceof CPDisplayGroup) { // One or more context
					ctxOrCtxlist.each(function(item) {
						toUpdate.push(item);
					});
				} else {
					toUpdate.push(ctxOrCtxlist); // Only one context
				}
			}
		}
	}.bind(this));

	// clean list of canvas to update
	this.canvasToUpdate = [];

	return toUpdate;
}

/*
	Called when the game is paused
*/
CPDisplayGroup.prototype.onPause = function () {
	Object.each(this.displayObjects, function(item){
		if (item.onPause)
			item.onPause();

		if (item.pause)
			item.pause();
	}.bind(this));
}

/*
	Called when the game is resumed
*/
CPDisplayGroup.prototype.onResume = function () {
	Object.each(this.displayObjects, function(item){
		if (item.onResume)
			item.onResume();

		if (item.resume)
			item.resume();
	}.bind(this));
}

/*
	Render the CPDisplayGroup
*/
CPDisplayGroup.prototype.render = function (ctxList) {
	var objs = [];

	Object.each(this.displayObjects, function(item) {
		if (item instanceof CPDisplayGroup) {
			objs.push(item.render(ctxList)); // recursive call
		} else { // regular display object
			if (ctxList.contains(item.context)) objs.push(item);
		}
	});

	objs.each(function(item) {
		if (item != null)
			item.draw();
	}, this);
}

/*
	Return the object named name
		- name : the object's name
*/
CPDisplayGroup.prototype.get = function (name) {
	return this.displayObjects[name];
}

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
    this.canvas.style.zIndex = 500;

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
    this.displayGroup.canvas = this.canvas;
    this.displayGroup.context = this.context;
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

var CPScene = function () {
	this.layers = [];
}

CPScene.prototype.update = function (dt){
	this.layers.each(function(layer) {
		layer.update(dt);
	});

	// if (this.timers) {
	// 	Object.each(this.timers, function(item) {
	// 		if(item.update) {
	// 			var ctxs = item.update(dt);
	// 			if(ctxs){
	// 				ctxs.each(function(ctx) {
	// 					this.needsRedraw(ctx);
	// 				});
	// 			}
	// 		}
	// 	}, this);
	// }
}

CPScene.prototype.destroy = function () {
	if (this.free) {
		this.free();
	}

	// this.layers.each(function(layer) {
	// 	layer.destroy();
	// 	layer = null;
	// }.bind(this));

	while (this.layers.length) {
		this.layers[0].destroy();
		this.layers[0] = null;
		this.layers.shift();
	}

	this.layers = [];
},

CPScene.prototype.addLayer = function (zIndex) {
	var layer = new CPLayer(zIndex);
	this.layers.push(layer);

	return layer;
},

CPScene.prototype.onPause = function () {
	this.layers.each(function(layer) {
		layer.onPause();
	});
},

CPScene.prototype.onResume = function () {
	this.layers.each(function(layer) {
		layer.onResume();
	});
}

// Rendering stuff

CPScene.prototype.needsRedraw = function (ctx) {
	CPSceneManager.instance.invalidate(ctx);
}

CPScene.prototype.render = function (ctxList){
	this.layers.each(function(layer) {
		layer.render(ctxList);
	});
}
