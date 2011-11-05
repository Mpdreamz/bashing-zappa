function Engine() {
	this.entities = {};
	this.ctx = null;
	this.timer = new Timer();
	this.stats = new Stats();
	this.physics = null;
	this.SCALE = 30;
}

Engine.prototype.init = function(ctx) {
	this.ctx = ctx;
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.left = '0px';
	this.stats.domElement.style.top = '0px';
	document.body.appendChild(this.stats.domElement);
	this.physics = new Physics(60, false, this.ctx.canvas.width, this.ctx.canvas.height, this.SCALE);
	
	this.physics.setBounds(this.ctx.canvas.width, this.ctx.canvas.height);
	this.physics.setBodies(this.entities);
};

Engine.prototype.start = function() {
	this.lastUpdateTimestamp = Date.now();
	var that = this;
	(function gameLoop() {
		that.loop();
		requestAnimFrame(gameLoop, that.ctx.canvas);
	})();
};

Engine.prototype.draw = function() {
	this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	//this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
	//this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	
	for(var e in this.entities) {
		if (!this.entities.hasOwnProperty(e))
			continue;
		
		this.entities[e].draw(this.ctx);
	}
};

Engine.prototype.update = function() {
	this.physics.update();
	
	var bodiesState = this.physics.getState();
	var entitiesToRemove = new Array();
	for(var e in this.entities) {
		if (!this.entities.hasOwnProperty(e))
			continue;
		
		var entity = this.entities[e];
		if (!entity.removeFromWorld) {
			entity.update(bodiesState[e]);
		} else {
			entitiesToRemove.push(this.entities[e]);
			console.log(entitiesToRemove);
		}
	}

	for(var i = 0; i < entitiesToRemove.length; i++) {
		var entity = entitiesToRemove[i];
		entitiesToRemove[i].body.SetActive(false);
		this.physics.world.DestroyBody(entity.body);
		delete this.entities[entity.id];
	}
};

Engine.prototype.loop = function() {
	this.clockTick = this.timer.tick();
	this.update();
	this.draw();
	this.stats.update();
};
