function Game() {
	Engine.call(this);
}
Game.prototype = new Engine();
Game.prototype.constructor = Game;

Game.prototype.start = function() {
	//this.pollServer();
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
			//var player = this.physics.bodiesMap[data.player];
			//player.ApplyImpulse(new b2Vec2(data.x, data.y), player.GetPosition());
			break;
		default:
			console.warn('Unhandled event: ' + event);
	}
};

/*
Game.prototype.pollServer = function() {
	var _this = this;
	$.get('poll', function(data) {
		if(data != null) {
			for (var i in data.messages) {
				var msg = data.messages[i];
				if (msg.action == 'createPlayer') {
					_this.addEntity(new Player(_this, msg.id));
				} else if (msg.action == 'move') {
					_this.movePlayer(msg.id, msg.dir);
				}
			}
		}
		setTimeout(function(){ _this.pollServer(); }, 50);
	});
};
*/

