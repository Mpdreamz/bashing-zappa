function Grid(engine) {
	this.dots = [];
	this.dotRadius = 1;
	this.dotSpacing = 20;
	this.margin = 50;
	this.dotsX = Math.floor((engine.ctx.canvas.width - 2*this.margin) / this.dotSpacing);
	this.dotsY = Math.floor((engine.ctx.canvas.height - 2*this.margin) / this.dotSpacing);
	this.maxX = this.margin + this.dotSpacing * (this.dotsX - 1);
	this.maxY = this.margin + this.dotSpacing * (this.dotsY - 1);
	
	for(var x = 0; x < this.dotsX; x++) {
		this.dots[x] = [];
		for(var y = 0; y < this.dotsY; y++) {
			this.dots[x][y] = true;
		}
	}
	
	this.superDotX = Math.floor(this.dotsX/2);
	this.superDotY = Math.floor(this.dotsY/2);
}

Grid.prototype.update = function() {
	var x = Math.floor(Math.random() * this.dotsX);
	var y = Math.floor(Math.random() * this.dotsY);
	this.dots[x][y] = true;
};

Grid.prototype.draw = function(ctx) {
	for(var x = 0; x < this.dotsX; x++) {
		for(var y = 0; y < this.dotsY; y++) {
			if(!this.dots[x][y]) continue;
			
			ctx.beginPath();
			ctx.fillStyle = 'rgb(256, 256, 256)';
			ctx.arc(this.margin + x * this.dotSpacing, 
					this.margin + y * this.dotSpacing, this.dotRadius, 0, Math.PI*2, true);
			ctx.fill();
		}
	}
	// SuperDot:
	if(this.superDotX != null) {
		ctx.beginPath();
		ctx.fillStyle = 'rgb(256, 0, 0)';
		ctx.arc(this.margin + this.superDotX * this.dotSpacing, 
				this.margin + this.superDotY * this.dotSpacing, this.dotRadius*4, 0, Math.PI*2, true);
		ctx.fill();
	}
};

Grid.prototype.coordsToGrid = function(x, y) {
	var gridX = Math.floor((x - this.margin) / this.dotSpacing);
	var gridY = Math.floor((y - this.margin) / this.dotSpacing);
	return { x: gridX, y: gridY };
};

Grid.prototype.eat = function(x, y) {
	if(this.superDotX == x && this.superDotY == y) {
		this.superDotX = null;
		this.superDotY = null;
		this.dots[x][y] = false;
		var _this = this;
		setTimeout(function() {
			_this.superDotX = Math.floor(Math.random() * _this.dotsX);
			_this.superDotY = Math.floor(Math.random() * _this.dotsY);
		}, 10000);
		return 2;
	}
	if(this.dots[x][y]) {
		this.dots[x][y] = false;
		return 1;
	}
	return 0;
};

