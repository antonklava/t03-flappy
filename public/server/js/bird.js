const {width, height} = require('./const.js');

const c_horizontal = 400;
const c_vertical = 1000;

module.exports = function Bird(game) {
	const self = this;
	self.scale = 0.5;
	self.flap_speed = 5;
	self.width = 128;
	self.height = 128;
	self.colliders = null;
	self.game = game;
	self.dies = false;
	self.facing_right = true;
	self.start_x = width*0.5;
	self.start_y = height*0.5;

	self.bird = game.add.sprite(0, 0, 'bird');
	self.bird.anchor.setTo(0.5, 0.5);
	self.bird.scale.setTo(self.scale, self.scale);
	self.bird_flap = self.bird.animations.add('flap');
	self.bird.animations.play('flap', self.flap_speed);
	self.hitbox = game.add.sprite(self.start_x, self.start_y);
	self.hitbox.anchor.setTo(0.5, 0.5);
	self.hitbox.width = self.width*0.4;
	self.hitbox.height = self.height*0.4;
	self.hitbox.addChild(self.bird);
	game.physics.arcade.enable(self.hitbox);
	self.hitbox.body.gravity.set(0, 3000);

	self.die = function() {
		self.bird_flap.stop();
		self.bird.angle = 180;
		self.colliders = null;
		self.dies = true;
		console.log("Bird daead!");
	};

	self.update = function() {
		if ((self.bird.x < 0 ||
			 self.bird.y > height ||
			 self.bird.x > width) && self.dies === false) {
			self.destroy();
		}
		if (self.colliders && self.dies === false) {
			game.physics.arcade.collide(self.hitbox, self.colliders, self.die);
		}
		// game.debug.body(self.hitbox);
	}

	self.destroy = function() {
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

		self.hitbox.body.velocity.x = x*c_horizontal;
		self.hitbox.body.velocity.y = y*c_vertical;
		self.hitbox.body.acceleration.y = 0;
		self.hitbox.body.acceleration.x = 0;
	};

	self.right = function() {
		flap(0.25, -0.75);
	};

	self.left = function() {
		flap(-0.25, -0.75);
	};

	return this;
}
