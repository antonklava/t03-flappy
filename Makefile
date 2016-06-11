
watch:
	./node_modules/.bin/watchify public/server/js/main.js -o public/server/js/main.dist.js

server:
	node index.js
