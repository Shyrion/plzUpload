define(['lib/CrispyPear/CPSprite'], function(CPSprite) {

  function Glooty(callback) {

    this.canvas = document.getElementById("glooty");
    this.ctx = this.canvas.getContext('2d');
    this.currentSprite = null;
    this.currentAnimationTimer = null;

    // ====== Wait Animation ====== //

    var waitImage = new Image();
    waitImage.src = "/images/Glooty/first.png";

    waitImage.onload = function () {
	    this.currentSprite = new CPSprite({
				x: 0,
				y: 0,
	      anchor: Anchors.CENTER,
				canvas: this.canvas
	   	});

	   	this.currentSprite.add({
				sequenceName: 'wait',
				spriteSheet: waitImage,
				totalFrame: 5,
				offset: 0,
				frameSize: {w: waitImage.width/5, h: waitImage.height},
				framePerSecond: 1,
				scale: 1
			});

			 // ====== Eat Animation ====== //

	    var preEatImage = new Image();
	    preEatImage.src = "/images/Glooty/second.png";

	    preEatImage.onload = function () {
		   	this.currentSprite.add({
					sequenceName: 'preEat',
					spriteSheet: preEatImage,
					totalFrame: 12,
					offset: 0,
					frameSize: {w: preEatImage.width/6, h: preEatImage.height/2},
					framePerSecond: 1,
					scale: 1
				});

				// ====== Eat Animation ====== //

		    var eatImage = new Image();
		    eatImage.src = "/images/Glooty/third.png";

		    eatImage.onload = function () {
			   	this.currentSprite.add({
						sequenceName: 'eat',
						spriteSheet: eatImage,
						totalFrame: 4,
						offset: 0,
						frameSize: {w: eatImage.width/4, h: eatImage.height/1},
						framePerSecond: 1,
						scale: 1
					});

					if (callback) callback(this);
				}.bind(this);
			}.bind(this);
		}.bind(this);
  };

  Glooty.prototype.play = function play(frameSpeed) {
    clearTimeout(this.currentAnimationTimer);
  	
  	var self = this;
		function animate() {
			var dt = frameSpeed || 1/50;
			if (self.currentSprite.update(dt)) {
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
				self.currentSprite.draw();
			}
			self.currentAnimationTimer = setTimeout(animate, dt);
		}

		animate();
  }

  Glooty.prototype.pause = function play(frameSpeed) {
    clearTimeout(this.currentAnimationTimer);
  }

  Glooty.prototype.setAnimation = function setAnimation(animation) {
		this.currentSprite.start(animation);
  }

	return Glooty;
});