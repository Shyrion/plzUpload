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
    this.characterLayer = this.addLayer(15);

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


    //============================//
    //===== TITLE & SUBTITLE =====//
    //============================//

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
        frameSize: {w:CPResourceManager.instance.getImage('animBreathing').width/6, h:CPResourceManager.instance.getImage('animBreathing').height}
    });

    // Blinking animation
    animatedSprite.add({
        sequenceName: 'blink',
        spriteSheet: CPResourceManager.instance.getImage('animBlink'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 6,
        frameSize: {w:CPResourceManager.instance.getImage('animBlink').width/6, h:CPResourceManager.instance.getImage('animBlink').height}
    });

    // Jump animation
    animatedSprite.add({
        sequenceName: 'jump',
        spriteSheet: CPResourceManager.instance.getImage('animJump'),
        totalFrame: 4,
        offset: 0,
        framePerSecond: 8,
        frameSize: {w:CPResourceManager.instance.getImage('animJump').width/4, h:CPResourceManager.instance.getImage('animJump').height}
    });

    // Crying animation
    animatedSprite.add({
        sequenceName: 'crying',
        spriteSheet: CPResourceManager.instance.getImage('animCrying'),
        totalFrame: 5,
        offset: 0,
        framePerSecond: 8,
        frameSize: {w:CPResourceManager.instance.getImage('animCrying').width/6, h:CPResourceManager.instance.getImage('animCrying').height}
    });

    // Open mouth animation
    animatedSprite.add({
        sequenceName: 'openMouth',
        spriteSheet: CPResourceManager.instance.getImage('animOpenMouth'),
        totalFrame: 4,
        offset: 0,
        framePerSecond: 8,
        frameSize: {w:CPResourceManager.instance.getImage('animOpenMouth').width/4, h:CPResourceManager.instance.getImage('animOpenMouth').height}
    });

    // Hystery animation
    animatedSprite.add({
        sequenceName: 'hystery',
        spriteSheet: CPResourceManager.instance.getImage('animHystery'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 8,
        frameSize: {w:CPResourceManager.instance.getImage('animHystery').width/6, h:CPResourceManager.instance.getImage('animHystery').height}
    });

    // Waiting animation
    animatedSprite.add({
        sequenceName: 'eating',
        spriteSheet: CPResourceManager.instance.getImage('animEating'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 8,
        frameSize: {w:CPResourceManager.instance.getImage('animEating').width/6, h:CPResourceManager.instance.getImage('animEating').height}
    });

    // Waiting animation
    animatedSprite.add({
        sequenceName: 'glups',
        spriteSheet: CPResourceManager.instance.getImage('animGlups'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 8,
        frameSize: {w:CPResourceManager.instance.getImage('animGlups').width/6, h:CPResourceManager.instance.getImage('animGlups').height}
    });

    // Disapointed animation
    animatedSprite.add({
        sequenceName: 'disapointed',
        spriteSheet: CPResourceManager.instance.getImage('animDisapointed'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 6,
        frameSize: {w:CPResourceManager.instance.getImage('animDisapointed').width/6, h:CPResourceManager.instance.getImage('animDisapointed').height}
    });
    animatedSprite.add({
        sequenceName: 'disapointedBlink',
        spriteSheet: CPResourceManager.instance.getImage('animDisapointedBlink'),
        totalFrame: 6,
        offset: 0,
        framePerSecond: 6,
        frameSize: {w:CPResourceManager.instance.getImage('animDisapointedBlink').width/6, h:CPResourceManager.instance.getImage('animDisapointedBlink').height}
    });

    // Happy animation
    animatedSprite.add({
        sequenceName: 'happy',
        spriteSheet: CPResourceManager.instance.getImage('animHappy'),
        totalFrame: 4,
        offset: 0,
        framePerSecond: 8,
        frameSize: {w:CPResourceManager.instance.getImage('animHappy').width/4, h:CPResourceManager.instance.getImage('animHappy').height}
    });


    //====================//
    //======= EYES =======//
    //====================//


    var leftEye = new CPImage({
        x: 0,
        y: -2500,
        img: CPResourceManager.instance.getImage('eye'),
        width: 48,
        height: 39,
        scale: 1,
        anchor: Anchors.CENTER
    });
    cloud.insert("leftEye", leftEye);
    this.characterLayer.insert("leftEye", leftEye);

    var rightEye = new CPImage({
        x: 0,
        y: leftEye.y,
        img: CPResourceManager.instance.getImage('eye'),
        width: 48,
        height: 39,
        scale: 1,
        anchor: Anchors.CENTER
    });
    cloud.insert("rightEye", rightEye);
    this.characterLayer.insert("rightEye", rightEye);

    cloud.x = _w/2;
    cloud.y = _h/2;

    _w = _h = null;

    function wait() {
        exitHystery();
        animatedSprite.playRepeat('breathing', 7, function() {
            animatedSprite.playOnce('blink', function() {
                if (Math.floor(Math.random()*2)) {
                    cry();
                } else {
                    jump();
                }
            });
        });
    }

    function cry() {
        animatedSprite.playRepeat('crying', 6, function() {
            animatedSprite.playOnce('blink', function() {
                wait();
            });
        });
    }

    function jump() {
        animatedSprite.playRepeat('jump', 2, function() {
            wait();
        });
    }

    function disapointed() {
        animatedSprite.playRepeat('disapointed', 4, function() {
            animatedSprite.playOnce('disapointedBlink', function() {
                if (Math.floor(Math.random()*2)) {
                    disapointed();
                } else {
                    wait();
                }
            });
        });
    }

    function glups() {
        animatedSprite.playOnce('glups', function() {
            animatedSprite.playRepeat('happy', 12, function() {
                wait();
            });
        });
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

    $('body').on('fileDragEnter', function(eventTrigger, e) {
        exitHystery();
        animatedSprite.playOnce('openMouth', function() {
            hysteryMode = true;
            animatedSprite.start('hystery');
            $('body').trigger('fileDragOver', e);
        });
    }.bind(this));

    var eyesBaseY       = animatedSprite.y-25;
    var leftEyeBaseX    = animatedSprite.x-64;
    var rightEyeBaseX   = animatedSprite.x+73;
    var eyeRay          = 12;

    function computeEyesPosition(mousePos) {
        var filePosX = mousePos.x;
        var filePosY = mousePos.y;

        // eyeX - mouseX
        var leftEyeFileDelta = Math.abs(leftEyeBaseX - filePosX);
        var rightEyeFileDelta = Math.abs(rightEyeBaseX - filePosX);

        // eyeY - mouseY
        var eyesDeltaY = Math.abs(eyesBaseY - filePosY);

        // We calculate the angle the eye should have
        var leftEyeAngle = Math.atan(eyesDeltaY/leftEyeFileDelta);
        var rightEyeAngle = Math.atan(eyesDeltaY/rightEyeFileDelta);

        var leftEyeRayDeltaX = rightEyeRayDeltaX = leftEyeRayDeltaY = rightEyeRayDeltaY = eyeRay;
        
        // Mouse is "inside" an eye, we need to "stick it" to the mouse
        var hypLeft2 = leftEyeFileDelta * leftEyeFileDelta + eyesDeltaY * eyesDeltaY;
        if (hypLeft2 < eyeRay*eyeRay) {
            leftEyeRayDeltaX = leftEyeFileDelta;
            leftEyeRayDeltaY = eyesDeltaY;
        }
        var hypRight2 = rightEyeFileDelta * rightEyeFileDelta + eyesDeltaY * eyesDeltaY;
        if (hypRight2 < eyeRay*eyeRay) {
            rightEyeRayDeltaX = rightEyeFileDelta;
            rightEyeRayDeltaY = eyesDeltaY;
        }

        // We "report" the angle we have on a smaller triangle
        var leftEyeDeltaX = Math.cos(leftEyeAngle) * leftEyeRayDeltaX;
        var leftEyeDeltaY = Math.sin(leftEyeAngle) * leftEyeRayDeltaY;
        var rightEyeDeltaX = Math.cos(rightEyeAngle) * rightEyeRayDeltaX;
        var rightEyeDeltaY = Math.sin(rightEyeAngle) * rightEyeRayDeltaY;

        // Need to take care of negative values for cos
        leftEyeDeltaX *= (filePosX < leftEyeBaseX) ? 1 : -1;
        leftEyeDeltaY *= (filePosY < eyesBaseY) ? 1 : -1;
        rightEyeDeltaX *= (filePosX < rightEyeBaseX) ? 1 : -1;
        rightEyeDeltaY *= (filePosY < eyesBaseY) ? 1 : -1;

        // Set eyes position
        leftEye.x = leftEyeBaseX - leftEyeDeltaX ;
        leftEye.y = eyesBaseY - leftEyeDeltaY;
        rightEye.x = rightEyeBaseX - rightEyeDeltaX ;
        rightEye.y = eyesBaseY - leftEyeDeltaY;

        // We need to redraw the eyes
        leftEye.needsRedraw();
        rightEye.needsRedraw();
    }
    $('body').on('fileDragOver', function(eventTrigger, e) {
        if (!isHystery()) return;

        computeEyesPosition({
            x: e.originalEvent.clientX,
            y: e.originalEvent.clientY
        });

    }.bind(this));

    $('body').on('fileDragFinished', function() {
        exitHystery();
        wait();
    }.bind(this));

    $('body').on('fileDropped', function() {
        exitHystery();
        animatedSprite.start('eating');
    }.bind(this));

    $('body').on('fileDragOut', function() {
        exitHystery();
        disapointed();
    }.bind(this));

    $('body').on('noUploadRunning', function() {
        exitHystery();
        glups();
    }.bind(this));


    $('body').on('resizeEnd', function(e) {
        titleGroup.x = CPGame.instance.canvasWidth/2;
        titleText.draw();
        subtitleText.draw();

        animatedSprite.x = CPGame.instance.canvasWidth/2;
        animatedSprite.y = Math.max(titleGroup.y+subtitleText.y+subtitleText.height+animatedSprite.height/2*animatedSprite.scale, CPGame.instance.canvasHeight/2);
        console.log(titleGroup.y,subtitleText.y,subtitleText.height, CPGame.instance.canvasHeight/2, animatedSprite.y);
    });

    // Starts everything
    wait();
}
  
MainScene.inheritsFrom(CPScene);

MainScene.prototype.free = function () {
    console.log("free");
}