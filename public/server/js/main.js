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
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, 'bg1');
		const bird = new Bird(game);
		objects.push(bird);
		spawner = new ObstacleSpawner(game);
		bird.colliders = spawner.group;
		objects.push(spawner);
	},
	update: function update() {
		for (let obj of objects) {
			if (obj.hasOwnProperty('update')) {
				obj.update();
			}
		}
	}
});

