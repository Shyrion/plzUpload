/*
    This file is part of the Crispy Pear Demo.
    Copyright (C) 2011  Jérémy Gabriele, Romaric Pighetti, Wiz

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

var MainScene = function (params) {

    this.parent.call(this, params);

    this.backgroundLayer = this.addLayer(10);
    this.characterLayer = this.addLayer(20);

    var _w = CPGame.instance.canvasWidth;
    var _h = CPGame.instance.canvasHeight;

    // Background
    /*var bg = new CPImage({
      img: CPResourceManager.instance.getImage("animWaiting"),
      x: _w/2,
      y: _h/2,
      width: _w/2,
      height: _h/2,
      anchor: Anchors.CENTER
    });
    this.backgroundLayer.insert("bg",bg);*/

    var titleGroup = new CPDisplayGroup();

    var titleText = new CPText({
        x: 0,
        y: 0,
        content: 'PlzUpload',
        anchor: Anchors.TOPCENTER,
        font: '70pt BeautifulEveryTime',
        color: 'rgb(0, 0, 0)'
    },this);
    titleGroup.insert("titleText", titleText);
    this.backgroundLayer.insert("titleText", titleText);

    var subtitleText = new CPText({
        x: titleText.width/2,
        y: titleText.height,
        content: "I'm hungry",
        anchor: Anchors.CENTERRIGHT,
        font: '24pt BeautifulEveryTime',
        color: 'rgb(0, 0, 0)'
    },this);
    titleGroup.insert("subtitleText", subtitleText);
    this.backgroundLayer.insert("subtitleText", subtitleText);

    titleGroup.x = _w/2;
    titleGroup.y = 50;

    // Create the sprite
    var animatedSprite = new CPSprite({
        x: _w/2,
        y: _h/2,
        width: 40,
        height: 100,
        anchor: Anchors.CENTER
    });

    // Waiting animation
    animatedSprite.add({
        sequenceName: 'breathing',
        spriteSheet: CPResourceManager.instance.getImage('animBreathing'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 8,
        scale: 1/2,
        frameSize: {w:CPResourceManager.instance.getImage('animBreathing').width/6, h:CPResourceManager.instance.getImage('animBreathing').height}
    });

    // Breathing animation
    animatedSprite.add({
        sequenceName: 'waiting',
        spriteSheet: CPResourceManager.instance.getImage('animWaiting'),
        totalFrame: 5,
        offset: 0,
        framePerSecond: 8,
        scale: 1/2,
        frameSize: {w:CPResourceManager.instance.getImage('animWaiting').width/6, h:CPResourceManager.instance.getImage('animWaiting').height}
    });

    // Open mouth animation
    animatedSprite.add({
        sequenceName: 'openMouth',
        spriteSheet: CPResourceManager.instance.getImage('animOpenMouth'),
        totalFrame: 4,
        offset: 0,
        framePerSecond: 8,
        scale: 1/2,
        frameSize: {w:CPResourceManager.instance.getImage('animOpenMouth').width/4, h:CPResourceManager.instance.getImage('animOpenMouth').height}
    });

    // Hystery animation
    animatedSprite.add({
        sequenceName: 'hystery',
        spriteSheet: CPResourceManager.instance.getImage('animHystery'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 8,
        scale: 1/2,
        frameSize: {w:CPResourceManager.instance.getImage('animHystery').width/6, h:CPResourceManager.instance.getImage('animHystery').height}
    });

    // Waiting animation
    animatedSprite.add({
        sequenceName: 'eating',
        spriteSheet: CPResourceManager.instance.getImage('animEating'),
        totalFrame: 4,
        offset: 0,
        framePerSecond: 8,
        scale: 1/2,
        frameSize: {w:CPResourceManager.instance.getImage('animEating').width/4, h:CPResourceManager.instance.getImage('animEating').height}
    });

    // Disapointed animation
    animatedSprite.add({
        sequenceName: 'disapointed',
        spriteSheet: CPResourceManager.instance.getImage('animDisapointed'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 6,
        scale: 1/2,
        frameSize: {w:CPResourceManager.instance.getImage('animDisapointed').width/6, h:CPResourceManager.instance.getImage('animDisapointed').height}
    });

    animatedSprite.start('waiting');
    this.characterLayer.insert("animatedSprite", animatedSprite);

    _w = _h = null;

    var timer = null;
    $('body').on('fileDragEnter', function() {
        animatedSprite.start('openMouth');
        clearTimeout(timer);
        timer = setTimeout(function() {
            animatedSprite.start('hystery');
        }, 500);
        
    }.bind(this));

    $('body').on('fileDragOver', function() {
        // Move eyes
    }.bind(this));

    $('body').on('fileDragFinished', function() {
        clearTimeout(timer);
        animatedSprite.start('waiting');
    }.bind(this));

    $('body').on('fileDropped', function() {
        clearTimeout(timer);
        animatedSprite.start('eating');
    }.bind(this));

    $('body').on('fileDragOut', function() {
        animatedSprite.start('disapointed');
        clearTimeout(timer);
        timer = setTimeout(function() {
            animatedSprite.start('waiting');
        }, 3000);
    }.bind(this));

    $('body').on('noUploadRunning', function() {
        animatedSprite.start('breathing');
        clearTimeout(timer);
        timer = setTimeout(function() {
            animatedSprite.start('waiting');
        }, 3000);
    }.bind(this));


    $('body').on('resizeEnd', function(e) {
        titleGroup.x = CPGame.instance.canvasWidth/2;
        titleText.draw();
        subtitleText.draw();

        animatedSprite.x = CPGame.instance.canvasWidth/2;
        animatedSprite.y = CPGame.instance.canvasHeight/2;
    });

    $(window).resize(function(e) {
    });
}
  
MainScene.inheritsFrom(CPScene);

MainScene.prototype.free = function () {
    console.log("free");
}