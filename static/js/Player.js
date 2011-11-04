function Player(engine, id) {
	Entity.call(this, engine);
	this.id = id;
	this.x = 100;
	this.y = 100;
	this.angle = 2;
	this.radius = 10;
	this.r = Math.floor(Math.random()*256);
	this.g = Math.floor(Math.random()*256);
	this.b = Math.floor(Math.random()*256);
	this.isDead = false;
	this.img = new Image();
	this.img.src = '/img/test_unit_outline.png';
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function(state) {
	if(this.isDead) {
		// TODO animation?
		this.removeFromWorld = true;
		Entity.prototype.update.call(this);
		return;
	}
	
	this.x = state.x;
	this.y = state.y;
	this.angle = state.angle;
	
	Entity.prototype.update.call(this);
};

Player.prototype.draw = function(ctx) {
	//ctx.beginPath();
	//ctx.fillStyle = 'rgb('+this.r+','+this.g+','+this.b+')';
	//ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
	//ctx.fill();
	
	ctx.drawImage(this.img, this.x, this.y);
	
	Entity.prototype.draw.call(this, ctx);
};
