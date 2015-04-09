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
