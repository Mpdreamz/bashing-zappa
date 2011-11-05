function Player(engine, id) {
	Entity.call(this, engine);
	this.id = id;
	this.name = id; // TODO
	this.x = 3;
	this.y = 3;
	this.angle = 0;
	this.radius = px2m(32);
	this.force = new b2Vec2(0, 0);
	//this.oldForce = new b2Vec(0, 0);
	this.isDead = false;
	this.ballImgs = [];
	for (var i = 1; i <= 5; i++) {
		this.ballImgs[i] = new Image();
		this.ballImgs[i].src = '/img/units/wreckingball'+i+'.png'
	}
	this.engineImg = new Image();
	this.engineImg.src = '/img/units/unit1.png';

}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function(state) {
	//if(this.isDead) {
	//	// TODO animation?
	//	this.removeFromWorld = true;
	//	Entity.prototype.update.call(this);
	//	return;
	//}
	
	this.x = state.x;
	this.y = state.y;
	this.angle = state.angle;
	
	//this.body.ApplyImpulse(new b2Vec2(
	this.body.ApplyForce(new b2Vec2(
		this.force.x, this.force.y), this.body.GetPosition());
	
	Entity.prototype.update.call(this);
};

Player.prototype.draw = function(ctx) {
	var forceMultiplier = 1;
	// Cable
	ctx.beginPath();
	ctx.moveTo(m2px(this.x), m2px(this.y));
	ctx.lineTo(m2px(this.x) + this.force.x * forceMultiplier, m2px(this.y) + this.force.y * forceMultiplier);
	ctx.stroke();
	
	ctx.save();
	ctx.translate(m2px(this.x), m2px(this.y));

	// Ball
	ctx.rotate(this.angle);
	var density = this.body.GetFixtureList().GetDensity();
	var ballImg = this.ballImgs[1];
	if(density < 0.2) ballImg = this.ballImgs[5];
	else if(density < 0.4) ballImg = this.ballImgs[4];
	else if(density < 0.6) ballImg = this.ballImgs[3];
	else if(density < 0.8) ballImg = this.ballImgs[2];
	console.log(density);
	ctx.drawImage(ballImg, - (ballImg.width /2), - (ballImg.height /2) , ballImg.width, ballImg.height);
	ctx.rotate(-this.angle);

	// Engine
	ctx.translate(this.force.x * forceMultiplier, this.force.y * forceMultiplier);
//	if (f.y == 0 && f.x == 0) {
	//	ctx.rotate(Math.atan2(oldForce.y, oldForce.x));
//	} else {
		ctx.rotate(Math.atan2(this.force.y, this.force.x));
	//}
	ctx.drawImage(this.engineImg, - (this.engineImg.width /2), - (this.engineImg.height /2) , this.engineImg.width, this.engineImg.height);

	ctx.restore();
	
	// Name
	// TODO ctx.fillStyle
	ctx.fillText(this.name, m2px(this.x), m2px(this.y));
};



