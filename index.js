const koa = require('koa');
const koa_static = require('koa-static');
const websockify = require('koa-websocket');

const app = websockify(koa());

app.use(koa_static('public'));

app.use(function *(){
	// console.log(this.method, this.url);
});

let id = 0;
let server_socket = null;

app.ws.use(function *(){
	console.log(this.url);
	if (this.url === "/server") {
		console.log("Server connected");
		server_socket = this.websocket;
	}
	if (this.url === "/client") {
		let client_id = ++id;
		console.log("Client "+client_id+" connected");
		if (server_socket) {
			server_socket.send(JSON.stringify({client_id, message: "new"}));
		}
		this.websocket.on('message', function(message) {
			if (server_socket) {
				server_socket.send(JSON.stringify({client_id, message}));
			}
			console.log({client_id, message});
		});
	}
});

console.log("Starting webserver on :8080");
app.listen(8080);
