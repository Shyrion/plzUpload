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

    var cloud = new CPDisplayGroup();

    //===============================//
    //===== SPRITE & ANIMATIONS =====//
    //===============================//

    // Create the sprite
    var animatedSprite = new CPSprite({
        x: 0,
        y: 0,
        width: 40,
        height: 100,
        anchor: Anchors.CENTER
    });
    cloud.insert("animatedSprite", animatedSprite);
    this.characterLayer.insert("animatedSprite", animatedSprite);

    // Breathing animation
    animatedSprite.add({
        sequenceName: 'breathing',
        spriteSheet: CPResourceManager.instance.getImage('animBreathing'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 8,
        scale: 1/2,
        frameSize: {w:CPResourceManager.instance.getImage('animBreathing').width/6, h:CPResourceManager.instance.getImage('animBreathing').height}
    });

    // Blinking animation
    animatedSprite.add({
        sequenceName: 'blink',
        spriteSheet: CPResourceManager.instance.getImage('animBlink'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 6,
        scale: 1/2,
        frameSize: {w:CPResourceManager.instance.getImage('animBlink').width/6, h:CPResourceManager.instance.getImage('animBlink').height}
    });

    // Waiting animation
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

    animatedSprite.start('breathing');


    //====================//
    //======= EYES =======//
    //====================//


    var leftEye = new CPImage({
        x: -70,
        y: -2500,
        img: CPResourceManager.instance.getImage('eye'),
        width: 48,
        height: 39,
        anchor: Anchors.CENTER
    });
    cloud.insert("leftEye", leftEye);
    this.characterLayer.insert("leftEye", leftEye);

    var rightEye = new CPImage({
        x: 70,
        y: leftEye.y,
        img: CPResourceManager.instance.getImage('eye'),
        width: 48,
        height: 39,
        anchor: Anchors.CENTER
    });
    cloud.insert("rightEye", rightEye);
    this.characterLayer.insert("rightEye", rightEye);

    cloud.x = _w/2;
    cloud.y = _h/2;

    _w = _h = null;

    var timer = null;

    function wait() {
        animatedSprite.start('breathing');
        clearTimeout(timer);
        timer = setTimeout(function() {
            animatedSprite.start('blink');
            timer = setTimeout(function() {
                animatedSprite.start('waiting');
            }, 1000);
        }, 6000);
    }
    
    var hysteryMode = false;

    function isHystery() {
        return hysteryMode;
    }

    function enterHystery() {
        hysteryMode = true;
    }

    function exitHystery() {
        hysteryMode = false;
        leftEye.y = rightEye.y = -2500;
    }
    exitHystery();

    $('body').on('fileDragEnter', function() {
        exitHystery()
        animatedSprite.start('openMouth');
        clearTimeout(timer);
        timer = setTimeout(function() {
            hysteryMode = true;
            animatedSprite.start('hystery');
        }, 500);
        
    }.bind(this));

    $('body').on('fileDragOver', function(eventTrigger, e) {
        if (!isHystery()) return;

        // Move eyes
        var filePosX = e.originalEvent.clientX;
        var filePosY = e.originalEvent.clientY;

        var eyeY = animatedSprite.y-25;
        var leftEyeX = animatedSprite.x-70;
        var rightEyeX = animatedSprite.x+70;

        if (filePosX > leftEyeX) {
            console.log(filePosX, leftEyeX);
        }

        var eyeRay = 10;
        leftEye.x = (filePosX > leftEyeX) ? Math.min(leftEyeX+eyeRay, filePosX) : Math.max(leftEyeX-eyeRay, filePosX);
        leftEye.y = (filePosY > eyeY) ? Math.min(eyeY+eyeRay, filePosY) : Math.max(eyeY-eyeRay, filePosY);

        rightEye.x = (filePosX > rightEyeX) ? Math.min(rightEyeX+eyeRay, filePosX) : Math.max(rightEyeX-eyeRay, filePosX);
        rightEye.y = (filePosY > eyeY) ? Math.min(eyeY+eyeRay, filePosY) : Math.max(eyeY-eyeRay, filePosY);

    }.bind(this));

    $('body').on('fileDragFinished', function() {
        exitHystery()
        clearTimeout(timer);
        wait();
    }.bind(this));

    $('body').on('fileDropped', function() {
        exitHystery()
        clearTimeout(timer);
        animatedSprite.start('eating');
    }.bind(this));

    $('body').on('fileDragOut', function() {
        exitHystery()
        animatedSprite.start('disapointed');
        clearTimeout(timer);
        timer = setTimeout(function() {
            wait();
        }, 3000);
    }.bind(this));

    $('body').on('noUploadRunning', function() {
        exitHystery()
        animatedSprite.start('breathing');
        clearTimeout(timer);
        timer = setTimeout(function() {
            wait();
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