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

    var titleText = new CPText({
        x: _w/2,
        y: 0,
        content: 'PlzUpload',
        anchor: Anchors.TOPCENTER,
        font: '70pt BeautifulEveryTime',
        color: 'rgb(0, 0, 0)'
    },this);
    this.backgroundLayer.insert("titleText", titleText);

    var subtitleText = new CPText({
        x: titleText.x + titleText.width/2,
        y: titleText.height,
        content: "I'm hungry",
        anchor: Anchors.CENTERRIGHT,
        font: '24pt BeautifulEveryTime',
        color: 'rgb(0, 0, 0)'
    },this);
    this.backgroundLayer.insert("subtitleText", subtitleText);

    // Create the sprite
    var animatedSprite = new CPSprite({
        x: _w/2-100,
        y: _h/2,
        width: 350,
        height: 400,
        anchor: Anchors.CENTER
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


    // Opening mouth animation
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

    animatedSprite.start('waiting');
    this.characterLayer.insert("animatedSprite", animatedSprite);

    _w = _h = null;

    $('body').on('fileDragOver', function() {
        animatedSprite.start('hystery');
    }.bind(this));

    $('body').on('fileDragFinished', function() {
        animatedSprite.start('waiting');
    }.bind(this));

    $('body').on('fileDropped', function() {
        animatedSprite.start('eating');
    }.bind(this));

    $('body').on('noUploadRunning', function() {
        animatedSprite.start('waiting');
    }.bind(this));


    $('body').on('resizeEnd', function(e) {
        titleText.x = CPGame.instance.canvasWidth/2;
        subtitleText.x = CPGame.instance.canvasWidth/2;
        titleText.draw();
        subtitleText.draw();

        animatedSprite.x = CPGame.instance.canvasWidth/2-100;
        animatedSprite.y = CPGame.instance.canvasHeight/2;
    });

    $(window).resize(function(e) {
    });
}
  
MainScene.inheritsFrom(CPScene);

MainScene.prototype.free = function () {
    console.log("free");
}