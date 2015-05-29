// import json
$.getJSON( "/drawings/json", function( data ) {
aegaron.drawings = data;
aegaron.drawingsstr = JSON.stringify(data);
// console.log(aegaron.drawingsstr);
});
