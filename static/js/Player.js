function Player(engine, id) {
	Entity.call(this, engine);
	this.id = id;
	this.x = 100;
	this.y = 100;
	this.angle = 2;
	this.radius = 30;
	this.force = new b2Vec2(0, 0);
	//this.oldForce = new b2Vec(0, 0);
	this.isDead = false;
	this.ballImg = new Image();
	this.ballImg.src = '/img/wreck_ball_64x64.png';
	this.engineImg = new Image();
	this.engineImg.src = '/img/test_unit01.png';
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
	
	this.body.ApplyImpulse(new b2Vec2(this.force.x * 10000, this.force.y * 10000), this.body.GetPosition());
	
	Entity.prototype.update.call(this);
};

Player.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x + this.force.x, this.y + this.force.y);
	ctx.stroke();
	
	/*
	ctx.drawImage(this.ballImg, this.x - 32, this.y - 32);
	ctx.drawImage(this.engineImg, this.x - 13, this.y + 40);
*/
	ctx.save();
	ctx.translate(this.x , this.y);

	ctx.drawImage(this.ballImg, - (this.ballImg.width /2), - (this.ballImg.height /2) , this.ballImg.width, this.ballImg.height);

	ctx.translate(this.force.x * 1.2, this.force.y * 1.2);

//	if (f.y == 0 && f.x == 0) {
	//	ctx.rotate(Math.atan2(oldForce.y, oldForce.x));
//	} else {
		ctx.rotate(Math.atan2(this.force.y, this.force.x));
	//}

	ctx.drawImage(this.engineImg, - (this.engineImg.width /2), - (this.engineImg.height /2) , this.engineImg.width, this.engineImg.height);

	ctx.restore();
};



