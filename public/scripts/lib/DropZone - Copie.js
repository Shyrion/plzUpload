var MenuController = function (id, onDropCallback) {

	this.menuButton = $('#menuButton');
	this.opened = false;

	$('#menuButton').click(function() {
		this.opened ? this.close() : this.open();
		this.opened = !this.opened;
	}.bind(this));

}

MenuController.prototype.open = function open() {
	$('#mainContent').animate({
		right: "15%",
		duration: 600,
		easing: 'swing',
		queue: true,
		complete: function() {
			console.log("complete");
		},
		done: function() {
			console.log("done");
		}
	});
}

MenuController.prototype.close = function close() {
	$('#mainContent').animate({
		right: "0%",
		duration: 600,
		easing: 'swing',
		queue: true,
		complete: function() {
			console.log("complete");
		},
		done: function() {
			console.log("done");
		}
	});
}