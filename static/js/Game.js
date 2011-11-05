function Game() {
	Engine.call(this);
}
Game.prototype = new Engine();
Game.prototype.constructor = Game;

Game.prototype.start = function() {
	Engine.prototype.start.call(this);
};

Game.prototype.draw = function() {
	Engine.prototype.draw.call(this);
};

Game.prototype.update = function() {
	Engine.prototype.update.call(this);
};

Game.prototype.addPlayer = function(player) {
	this.entities[player.id] = player;
	this.physics.addBody(player);
};

Game.prototype.handleInput = function(event, data) {
	switch(event) {
		case 'join':
			this.addPlayer(new Player(this, data.id));
			break;
		case 'move':
			var player = this.entities[data.player];
			player.force = new b2Vec2(data.x, data.y);
			//player.oldForce = player.force.Copy();
			break;
		default:
			console.warn('Unhandled event: ' + event);
	}
};

