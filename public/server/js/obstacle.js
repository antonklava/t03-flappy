const {width, height} = require('./const.js');
const space = width*0.75;

function Obstacle(game) {
	const self = this
	self.width = 140;
	self.height = 604;
	self.window = 400;
	self.speed = -0.3;
	self.position = width;

	self.create = function(group) {
		self.obstacle = game.add.sprite(0, 0);
		self.obstacle_lower = game.add.sprite(0, self.height+self.window, 'obstacle');
		self.obstacle_upper = game.add.sprite(0, 0, 'obstacle');
		self.obstacle_upper.anchor.setTo(1, 1);
		self.obstacle_upper.angle = 180;
		self.obstacle.addChild(self.obstacle_upper);
		self.obstacle.addChild(self.obstacle_lower);

		self.obstacle_hitbox_upper = group.create(0, 0);
		self.obstacle_hitbox_lower = group.create(0, 0);
		self.obstacle_hitbox_upper.width = self.width;
		self.obstacle_hitbox_upper.height = self.height;
		self.obstacle_hitbox_lower.width = self.width;
		self.obstacle_hitbox_lower.height = self.height;
		game.physics.arcade.enable(self.obstacle_hitbox_upper);
		game.physics.arcade.enable(self.obstacle_hitbox_lower);
		self.obstacle_hitbox_upper.body.immovable = true;
		self.obstacle_hitbox_lower.body.immovable = true;
		self.random_window();
	};

	self.set_position = function(pos) {
		self.position = pos;
		self.obstacle.x = pos;
		self.obstacle_hitbox_upper.x = pos;
		self.obstacle_hitbox_lower.x = pos;
	};

	self.random_window = function() {
		const offset = game.rnd.integerInRange(-150, 150) - height/2;
		self.obstacle_upper.y = offset;
		self.obstacle_lower.y = offset + self.height+self.window/2;
		self.obstacle_hitbox_upper.y = offset - 15;
		self.obstacle_hitbox_lower.y = offset + self.height+self.window/2 + 15;
	};

	self.update = function() {
		// game.debug.body(self.obstacle_hitbox_upper);
		// game.debug.body(self.obstacle_hitbox_lower);
		self.set_position(self.position + game.time.elapsed*self.speed);
	};

	return this;
}

module.exports = function ObstacleSpawner(game) {
	const obstacles = [
		new Obstacle(game),
		new Obstacle(game),
		new Obstacle(game)
	];
	this.group = game.add.group();
	for (let i = 0; i < obstacles.length; i++) {
		obstacles[i].create(this.group);
		obstacles[i].set_position(obstacles[i].position + i*space);
	}

	this.update = function() {
		for (let i = 0; i < obstacles.length; i++) {
			if (obstacles[i].position < -obstacles[i].width) {
				const idx = (i+obstacles.length-1)%obstacles.length;
				const new_pos = obstacles[idx].position + space;
				obstacles[i].set_position(new_pos);
			} else {
				obstacles[i].update();
			}
		}
	};

	return this;
};
