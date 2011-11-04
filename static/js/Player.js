function Player(engine, id) {
	Entity.call(this, engine);
	this.id = id;
	this.x = 100;
	this.y = 100;
	this.angle = 2;
	this.radius = 10;
	//this.force = new b2Vec2(0, 0);
	//this.oldForce = new b2Vec(0, 0);
	this.isDead = false;
	this.ballImg = new Image();
	this.ballImg.src = '/img/wreck_ball_64x64.png';
	this.engineImg = new Image();
	this.engineImg.src = '/img/test_unit_25x35.png';
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
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x, this.y + 40);
	ctx.stroke();
	
	ctx.drawImage(this.ballImg, this.x - 32, this.y - 32);
	ctx.drawImage(this.engineImg, this.x - 13, this.y + 40);
	
	Entity.prototype.draw.call(this, ctx);
};
