
watch-server:
	./node_modules/.bin/watchify public/server/js/main.js -o public/server/js/main.dist.js

watch-client:
	./node_modules/.bin/watchify public/client/js/main.js -o public/client/js/main.dist.js

server:
	node index.js
