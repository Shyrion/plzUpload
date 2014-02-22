requirejs.config({
    //By default load any module IDs from scripts
    baseUrl: 'scripts'
});


require(['lib/jquery-2.1.0.min', 'dragDrop', 'lib/MenuController'], function(a, DragDropController, MenuController) {
  var menuController = new MenuController();
  var dragDrop = new DragDropController(menuController);
});