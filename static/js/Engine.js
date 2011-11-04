function Engine() {
	this.entities = [];
	this.ctx = null;
	this.timer = new Timer();
	this.stats = new Stats();
}

Engine.prototype.init = function(ctx) {
	this.ctx = ctx;
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.left = '0px';
	this.stats.domElement.style.top = '0px';
	document.body.appendChild(this.stats.domElement);
};

Engine.prototype.start = function() {
	this.lastUpdateTimestamp = Date.now();
	var that = this;
	(function gameLoop() {
		that.loop();
		requestAnimFrame(gameLoop, that.ctx.canvas);
	})();
};

Engine.prototype.addEntity = function(entity) {
	this.entities.push(entity);
};

Engine.prototype.draw = function() {
	//this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	this.ctx.fillStyle = 'rgba(0, 0, 0, .04)';
	this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	
	var entitiesCount = this.entities.length;
	for (var i = 0; i < entitiesCount; i++) {
		this.entities[i].draw(this.ctx);
	}
};

Engine.prototype.update = function() {
	var entitiesCount = this.entities.length;

	for (var i = 0; i < entitiesCount; i++) {
		var entity = this.entities[i];
		
		if (!entity.removeFromWorld) {
			entity.update();
		}
	}

	for (var i = this.entities.length-1; i >= 0; --i) {
		if (this.entities[i].removeFromWorld) {
			this.entities.splice(i, 1);
		}
	}
};

Engine.prototype.loop = function() {
	this.clockTick = this.timer.tick();
	this.update();
	this.draw();
	this.stats.update();
};
