const {width, height} = require('./const.js');

const space = width*0.75;

function Obstacle(game) {
	const self = this
	self.scale = 1.25;
	self.width = 140;
	self.height = 247;
	self.window = 400;
	self.speed = -0.3;
	self.position = width + self.width*self.scale;

	self.create = function(group) {
		self.obstacle_lower = group.create(0, self.height+self.window, 'obstacle');
		self.obstacle_upper = group.create(0, 0, 'obstacle');
		self.obstacle_upper.angle = 180;
		self.obstacle_upper.anchor.setTo(1, 1);
		self.obstacle_lower.scale.setTo(self.scale);
		self.obstacle_upper.scale.setTo(self.scale);
		game.physics.arcade.enable(self.obstacle_lower);
		game.physics.arcade.enable(self.obstacle_upper);
		self.obstacle_lower.body.immovable = true;
		self.obstacle_upper.body.immovable = true;
		self.obstacle_upper.body.offset.x = self.obstacle_upper.width;
		self.obstacle_upper.body.offset.y = self.obstacle_upper.height;
		self.random_window()
	};

	self.set_position = function(pos) {
		self.position = pos;
		self.obstacle_lower.x = pos;
		self.obstacle_upper.x = pos;
	};

	self.random_window = function() {
		const offset = game.rnd.integerInRange(-150, 50);
		self.obstacle_lower.y = offset + self.height+self.window;
		self.obstacle_upper.y = offset;
	};

	self.update = function() {
		// game.debug.body(self.obstacle_lower);
		// game.debug.body(self.obstacle_upper);
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
	game.physics.arcade.enable(this.group, true); // Enable physics for all obstacles

	this.update = function() {
		for (let i = 0; i < obstacles.length; i++) {
			if (obstacles[i].position < -obstacles[i].width*obstacles[i].scale) {
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
