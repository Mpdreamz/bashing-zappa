// Imports:
var b2Vec2 = Box2D.Common.Math.b2Vec2
	, b2AABB = Box2D.Collision.b2AABB
	, b2BodyDef = Box2D.Dynamics.b2BodyDef
	, b2Body = Box2D.Dynamics.b2Body
	, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	, b2Fixture = Box2D.Dynamics.b2Fixture
	, b2World = Box2D.Dynamics.b2World
	, b2MassData = Box2D.Collision.Shapes.b2MassData
	, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	, b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;


function Physics(intervalRate, adaptive, width, height, scale) {
	this.intervalRate = parseInt(intervalRate);
	this.adaptive = adaptive;
	this.width = width;
	this.height = height;
	this.scale = scale;

	this.bodiesMap = {};
	
	this.world = new b2World(
		new b2Vec2(0, 0), // gravity
		true              // allow sleep
	);
	
	this.fixDef = new b2FixtureDef;
	this.fixDef.density = 1.0;
	this.fixDef.friction = 0.3;
	this.fixDef.restitution = 0.5;
}

Physics.prototype.setBounds = function(width, height) {
	//create ground
	var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    this.fixDef.shape = new b2PolygonShape;

	// Bovensten rand: hele breedte, 4px hoog
    this.fixDef.shape.SetAsBox(px2m(width) / 2, px2m(2));
    bodyDef.position.Set(px2m(width) / 2, px2m(2));
    this.world.CreateBody(bodyDef).CreateFixture(this.fixDef);

	// Onderste rand: hele breedte, 4px hoog
    bodyDef.position.Set(px2m(width) / 2, px2m(height - 2));
    this.world.CreateBody(bodyDef).CreateFixture(this.fixDef);

	// Linker rand, hele hoogte, 4px breed
    this.fixDef.shape.SetAsBox(px2m(2), px2m(height) / 2);
    bodyDef.position.Set(px2m(2), px2m(height) / 2);
    this.world.CreateBody(bodyDef).CreateFixture(this.fixDef);
	
	// Rechter rand, hele hoogte, 4px breed         
    bodyDef.position.Set(px2m(width - 2), px2m(height) / 2);
    this.world.CreateBody(bodyDef).CreateFixture(this.fixDef);
};

Physics.prototype.update = function() {
	var start = Date.now();
		
	var stepRate = (this.adaptive) ? (now - this.lastTimestamp) / 1000 : (1 / this.intervalRate);
	this.world.Step(
		stepRate, // frame-rate
		10,       // velocity iterations
		10        // position iterations
	);
	this.world.ClearForces();
	return (Date.now() - start);
};

Physics.prototype.getState = function() {
	var state = {};
	for (var b = this.world.GetBodyList(); b; b = b.m_next) {
		if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() != null) {
			state[b.GetUserData()] = this.getBodySpec(b);
		}
	}
	return state;
};

Physics.prototype.getBodySpec = function(b) {
	return {
		x: b.GetPosition().x,
		y: b.GetPosition().y,
		angle: b.GetAngle(),
		//c: {
		//	x: b.GetWorldCenter().x,
		//	y: b.GetWorldCenter().y
		//}
	};
}

Physics.prototype.setBodies = function(bodyEntities) {
    /*
    var bodyDef = new b2BodyDef;
    
    for(var id in bodyEntities) {
        var entity = bodyEntities[id];
        
        bodyDef.type = b2Body.b2_dynamicBody;
        
        bodyDef.position.x = entity.x;
        bodyDef.position.y = entity.y;
        bodyDef.userData = entity.id;
        bodyDef.angle = entity.angle;
        var body = this.registerBody(bodyDef);
        
        this.fixDef.shape = new b2CircleShape(entity.radius);
        body.CreateFixture(this.fixDef);
    }
    */
    
    this.ready = true;
};

Physics.prototype.addBody = function(entity) {
	var bodyDef = new b2BodyDef;
        
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.linearDamping = 0.9;
    bodyDef.angularDamping = 0.9;
    bodyDef.position.x = entity.x;
    bodyDef.position.y = entity.y;
    bodyDef.userData = entity.id;
    bodyDef.angle = entity.angle;
    var body = this.registerBody(bodyDef);
    
    this.fixDef.shape = new b2CircleShape(entity.radius);
    body.CreateFixture(this.fixDef);
    entity.body = body;
}

Physics.prototype.registerBody = function(bodyDef) {
	var body = this.world.CreateBody(bodyDef);
	this.bodiesMap[body.GetUserData()] = body;
	return body;
};

