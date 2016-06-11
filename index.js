const koa = require('koa');
const koa_static = require('koa-static');

const app = koa();

app.use(koa_static('public'));

app.use(function *(){
	console.log(this.method, this.url);
	this.body = 'Hello World';
});


console.log("Starting webserver on :8080");
app.listen(8080);
