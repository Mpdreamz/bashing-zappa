var GAME_DURATION = 3 * 60 * 1000;

function Game() {
	Engine.call(this);
	this.forceMultiplier = 50;
	this.starttime = null;
}
Game.prototype = new Engine();
Game.prototype.constructor = Game;

Game.prototype.start = function() {
	Engine.prototype.start.call(this);
	this.starttime = +new Date;
};

Game.prototype.draw = function() {
	Engine.prototype.draw.call(this);

	var timerEl = $("#timer");
	if (!timerEl.hasClass("positioned")) {
		var tleft = $(window).width() / 2 - 50;
		timerEl.css({
			"position": "absolute",
			"top": 20,
			"left": tleft
		}).addClass("positioned");
	}
};

Game.prototype.update = function() {
	if (this.starttime) {
		var timeleft = GAME_DURATION - (+new Date - this.starttime);
		if (timeleft <= 0) {
			// TODO END GAME LOGIC
			console.log("END OF GAME");
		}
		else {
			var mins = Math.floor(timeleft / 60000);
			var secs = Math.floor(timeleft / 1000 % 60);
			$("#timer").text(mins + ":" + (secs < 10 ? "0" + secs : secs));
		}
	}
	Engine.prototype.update.call(this);
};

Game.prototype.addPlayer = function(player) {
	this.entities[player.id] = player;
	this.physics.addBody(player);
};

Game.prototype.respawnPlayer = function(playerId) {
    for (entityId in this.entities) {
	    if (this.entities[entityId].isDead) {
	        console.log('undeading the player for respawn');
	        var player = new Player(this, entityId, this.entities[entityId].name);
	        this.physics.addBody(player);
	        this.entities[playerId] = player;
        }
    }
};

Game.prototype.handleInput = function(event, data) {
	switch(event) {
		case 'join':
			this.addPlayer(new Player(this, data.id, data.playername));
			break;
		case 'move':
			var player = this.entities[data.player];
			if (player != null) {
				player.force = new b2Vec2(data.x, data.y);
			}
			break;
		case 'respawn':
		    this.respawnPlayer(data.player);
		    break;
		default:
			console.warn('Unhandled event: ' + event);
	}
};

