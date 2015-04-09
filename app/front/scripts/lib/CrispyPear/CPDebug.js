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

var CPDebug = new Class({
  
  Extends: CPText,
  fps: 0,
  lastValues: [],
  lastTime: 0,

  initialize: function(params){
    params.content = "- FPS";
    params.textAlign = 'center';
    params.textBaseline = 'top';
    params.font = '20pt Arial';
    params.color = 'rgb(0, 0, 0)';

    this.lastTime = Date.now();

    this.parent(params);
	},

  update: function update(dt) {
    return this.canvas.getContext('2d');
  },
	
  draw: function draw() {
    if (this.lastValues.length >= 10) {
      var m = 0;
      this.lastValues.each(function(fpsValue) {
        m += fpsValue;
      });
      this.content = Math.floor(m/10) + " FPS";
      this.lastValues = [];
    } else {
      this.fps = Math.round(1000 / (Date.now()-this.lastTime));
      this.lastTime = Date.now();
      this.lastValues.push(this.fps);
    }
    this.parent(draw);
  }
  
});