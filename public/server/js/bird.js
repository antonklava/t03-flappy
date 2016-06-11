const {width, height} = require('./const.js');

const c_horizontal = 40;
const c_vertical = 150;

module.exports = function Bird(game) {
	const self = this;
	this.scale = 0.8;
	this.flap_speed = 5;
	this.width = 128;
	this.height = 128;
	this.colliders = null;
	this.game = game;
	this.dies = false;
	this.facing_right = true;

	this.bird = game.add.sprite(width*0.5, height*0.5, 'bird');
	game.physics.enable(this.bird, Phaser.Physics.ARCADE);
	this.bird.scale.setTo(this.scale);
	this.bird.body.gravity.set(0, 250);
	this.bird_flap = this.bird.animations.add('flap');
	this.bird.animations.play('flap', this.flap_speed);
	this.bird.anchor.setTo(0.5, 0.5);

	this.die = function() {
		self.bird_flap.stop();
		self.bird.angle = 180;
		self.colliders = null;
		self.dies = true;
		console.log("Bird daead!");
	};

	this.update = function() {
		if ((self.bird.x < 0 ||
			 self.bird.y > height ||
			 self.bird.x > width) && self.dies === false) {
			self.die();
		}
		if (self.colliders && self.dies === false) {
			game.physics.arcade.collide(self.bird, self.colliders, self.die);
		}
	}

	const space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	space.onDown.add(function() {
		// bird.reset()
		self.die();
	});

	const right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	right.onDown.add(function() {
		if (self.dies) { return; }
		self.bird_flap.restart();
		self.bird.animations.play('flap', self.flap_speed);
		self.bird.scale.setTo(self.scale, self.scale);
		self.bird.body.offset.x = 0;
		self.facing_right = true;
		self.bird.y -= c_vertical;
		self.bird.x += c_horizontal;
		self.bird.body.velocity.x = c_horizontal;
		self.bird.body.acceleration.x = c_horizontal;
		self.bird.body.velocity.y = c_vertical;
		self.bird.body.acceleration.y = c_vertical;
	});

	const left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	left.onDown.add(function() {
		if (self.dies) { return; }
		self.bird_flap.restart();
		self.bird.animations.play('flap', self.flap_speed);
		if (self.facing_right) {
			self.facing_right = false;
			self.bird.scale.x *= -1;
			self.bird.body.offset.x = self.bird.width;
		}
		self.bird.y -= c_vertical;
		self.bird.x -= c_horizontal;
		self.bird.body.velocity.x = -c_horizontal;
		self.bird.body.acceleration.x = -c_horizontal;
		self.bird.body.velocity.y = c_vertical;
		self.bird.body.acceleration.y = c_vertical;
	});

	game.input.keyboard.addKeyCapture([Phaser.Keyboard.RIGHT, Phaser.Keyboard.LEFT])

	return this;
}
