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
