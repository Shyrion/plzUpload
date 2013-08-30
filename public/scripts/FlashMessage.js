var FlashMessage = function (type, title, message) {

    var template = '<div class="container alert alert-block %1">' +
      '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
      '<h4>%2</h4>' +
      '%3' +
    '</div>'

    // type = error, success, info,
    var cssType = ((type == 'warning') && '') ||
        ((type == 'error') && 'alert-error') || 
        ((type == 'success') && 'alert-success') || 
        ((type == 'info') && 'alert-info')

    console.log(cssType);
    template = template.replace('%1', cssType)
                    .replace('%2', title)
                    .replace('%3', message);
    
    var alertDiv = $(template);

    $('#content').prepend(alertDiv);

    alertDiv = null;
    template = null;
}
