function Game() {
	Engine.call(this);
}
Game.prototype = new Engine();
Game.prototype.constructor = Game;

Game.prototype.start = function() {
	this.pollServer();
	Engine.prototype.start.call(this);
};

Game.prototype.draw = function() {
	Engine.prototype.draw.call(this);
	
	var entitiesCount = this.entities.length;
	for (var i = 0; i < entitiesCount; i++) {
		if(i >= 5) break;
		var player = this.entities[i];
		var x = this.grid.margin + 80 * i;
		var y = this.ctx.canvas.height - player.radius*2;
		this.ctx.beginPath();
		this.ctx.fillStyle = 'rgb('+player.r+','+player.g+','+player.b+')';
		this.ctx.arc(x, y, player.radius, 0, Math.PI*2, false);
		this.ctx.fill();
		this.ctx.fillStyle = 'rgb(255, 255, 255)';
		this.ctx.fillText(player.score, x + player.radius + 4, y + 4);
	}
};

Game.prototype.update = function() {
	Engine.prototype.update.call(this);
	this.entities.sort(function(p1, p2) {
		return p1.score < p2.score;
	});
};

Game.prototype.movePlayer = function(id, dir) {
	var entitiesCount = this.entities.length;
	for (var i = 0; i < entitiesCount; i++) {
		var player = this.entities[i]; 
		if (player.id == id) {
			player.requestedDir = dir;
		}
	}
};

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
