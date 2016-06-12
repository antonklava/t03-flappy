window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');

const {width, height} = require('./const.js');

const Bird = require('./bird.js');
const ObstacleSpawner = require('./obstacle.js');

const objects = [];
let spawner;


const game = new Phaser.Game(width, height, Phaser.AUTO, '', {
	preload: function preload() {
		game.load.image('bg1', '/assets/background/city.png');
		game.load.image('bg2', '/assets/background/graveyard.png');
		game.load.image('bg3', '/assets/background/rock.png');
		game.load.image('bg4', '/assets/background/snow.png');
		game.load.spritesheet('bird', '/assets/flappy-dragon/sheet.png', 128, 128, 4);
		game.load.image('obstacle', '/assets/obstacle.png');
	},
	create: function create() {
		game.stage.disableVisibilityChange = true;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		const bg = game.add.sprite(0, 0, 'bg3');
		bg.scale.setTo(height/bg.height);
		spawner = new ObstacleSpawner(game);
		objects.push(spawner);

		const ws = new WebSocket("ws://localhost:8080/server");
		let birds = {}
		ws.onopen = function() {
			console.log("Connected");
		};
		ws.onmessage =function(ev){
			const {client_id, message} = JSON.parse(ev.data);
			console.log(client_id, message);
			if (!birds.hasOwnProperty(client_id)) {
				birds[client_id] = new Bird(game);
				birds[client_id].colliders = spawner.group;
				objects.push(birds[client_id]);
			}
			if (message === 'retry') {
				birds[client_id].destroy();
				delete birds[client_id];
				birds[client_id] = new Bird(game);
				objects.push(birds[client_id]);
				birds[client_id].colliders = spawner.group;
			} else if (message === 'right') {
				birds[client_id].right();
			} else if (message === 'left') {
				birds[client_id].left();
			}
		};
	},
	update: function update() {
		for (let obj of objects) {
			if (obj.hasOwnProperty('update')) {
				obj.update();
			}
		}
	}
});

