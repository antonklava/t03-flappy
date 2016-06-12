const {width, height} = require('./const.js');

const c_horizontal = 400;
const c_vertical = 1000;

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
	game.physics.arcade.enable(this.bird);
	this.bird.anchor.setTo(0.5, 0.5);
	this.bird.scale.setTo(this.scale, this.scale);
	this.bird.body.gravity.set(0, 3000);
	this.bird_flap = this.bird.animations.add('flap');
	this.bird.animations.play('flap', this.flap_speed);

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
			self.destroy();
		}
		if (self.colliders && self.dies === false) {
			game.physics.arcade.collide(self.bird, self.colliders, self.die);
		}
		// game.debug.body(self.bird);
	}

	this.destroy = function() {
		self.die();
		self.bird.destroy();
	};

	const space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	space.onDown.add(function() {
		// bird.reset()
		self.die();
	});

	const flap = function(x, y) {
		if (self.dies) { return; }
		self.bird_flap.restart();
		self.bird.animations.play('flap', self.flap_speed);

		self.bird.body.velocity.x = x*c_horizontal;
		self.bird.body.velocity.y = y*c_vertical;
		self.bird.body.acceleration.y = 0;
		self.bird.body.acceleration.x = 0;
	};

	this.right = function() {
		flap(0.25, -0.75);
	};

	this.left = function() {
		flap(-0.25, -0.75);
	};

	return this;
}
