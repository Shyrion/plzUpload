requirejs.config({
    //By default load any module IDs from scripts
    baseUrl: 'scripts'
});


require(['lib/jquery-2.1.0.min', 'dragDrop', 'lib/MenuController', 'lib/Glooty'],
	function(a, DragDropController, MenuController, Glooty) {
  var menuController = new MenuController();
  var dragDrop = new DragDropController(menuController);

  var glooty = new Glooty(function(self) {
	  self.setAnimation('wait');
	  self.play();
  });

  /*$('#glooty').on('mouseenter', function(e) {
	  glooty.setAnimation('preEat');
  });

  $('#glooty').on('mouseleave', function(e) {
	  glooty.setAnimation('wait');
  });*/

  $('#glooty').on('dragover', function(e) {
	  glooty.setAnimation('preEat');
  });

  $('#glooty').on('dragend', function(e) {
	  glooty.setAnimation('wait');
  });

  $('#glooty').on('drop', function(e) {
	  glooty.setAnimation('eat');
  });
});