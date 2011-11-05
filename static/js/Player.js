function Player(engine, id) {
	Entity.call(this, engine);
	this.id = id;
	this.name = id; // TODO
	this.x = 3;
	this.y = 3;
	this.angle = 0;
	this.radius = px2m(32);
	this.force = new b2Vec2(0, 0);
	this.label = null;
	//this.oldForce = new b2Vec(0, 0);
	this.isDead = false;
	this.ballImg = new Image();
	this.ballImg.src = '/img/units/wreckingball1.png';
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
	ctx.drawImage(this.ballImg, - (this.ballImg.width /2), - (this.ballImg.height /2) , this.ballImg.width, this.ballImg.height);
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
	//ctx.fillText(this.name, m2px(this.x), m2px(this.y));

	if (!this.label) {
		this.label = $("<div/>", { "text": "Aad!", "class": "playerLabel" });
		$(document.body).append(this.label);
	}
	this.label.css({ "top": m2px(this.y), "left": m2px(this.x) })
};



