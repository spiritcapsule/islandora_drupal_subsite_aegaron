
$( document ).ready(function() {

$('#metadata').appendTo('#metadata-container');

$('<span class="btn btn-info time-control"><span class="glyphicon glyphicon-minus-sign"></span></span>').appendTo('#metadata h2 a');

$('#metadata h2 a').on('click',function(e) {
  $(this).find('.glyphicon').toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
});

});



