function Entity(engine, x, y, id) {
	this.engine = engine;
	this.id = id;
	this.x = x;
	this.y = y;
	this.removeFromWorld = false;
}

Entity.prototype.update = function() {
};

Entity.prototype.draw = function() {
};

Entity.prototype.outsideScreen = function() {
	return (this.x > this.engine.ctx.canvas.width || this.x < 0 ||
			this.y > this.engine.ctx.canvas.height || this.y < 0);
};
