
const $ = require('jquery');

const ws = new WebSocket("ws://192.168.1.187:8080/client");
let id = null;

ws.onopen = function(ev) {
	$("#status").text("Connected!");
};

$("#retry").on('click', function() {
	ws.send('retry');
	console.log("Sending retry");
});

$("#left").on('click', function() {
	ws.send('left');
	console.log("Sending left");
});

$("#right").on('click', function() {
	ws.send('right');
	console.log("Sending right");
});

$(document).on('keydown', function(e) {
	if (e.key === "ArrowLeft") {
		console.log("Sending left");
		ws.send('left');
	} else if (e.key === "ArrowRight") {
		console.log("Sending right");
		ws.send('right');
	} else if (e.keyCode === 32 /*space*/) {
		console.log("Sending retry");
		ws.send('retry');
	}
});





