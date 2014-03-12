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
