// import json
$.getJSON( "/drawings/json", function( data ) {
aegaron.drawings = JSON.stringify(data);
console.log(aegaron.drawings);
});
