var   b2Vec2 = Box2D.Common.Math.b2Vec2
            ,  b2AABB = Box2D.Collision.b2AABB
         	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
         	,	b2Body = Box2D.Dynamics.b2Body
         	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
         	,	b2Fixture = Box2D.Dynamics.b2Fixture
         	,	b2World = Box2D.Dynamics.b2World
         	,	b2MassData = Box2D.Collision.Shapes.b2MassData
         	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
         	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
         	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
            ;

var world = new b2World(
	new b2Vec2(0, 10)
	,  true                 //allow sleep
);
         
var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0.2;
 
 
var bodyDef = new b2BodyDef;
 
 
bodyDef.type = b2Body.b2_dynamicBody;
for(var i = 0; i < 4; ++i) {
	fixDef.shape = new b2CircleShape(
		Math.random() + 0.1 //radius
	);
	bodyDef.position.x = Math.random() * 10;
	bodyDef.position.y = Math.random() * 10;
	world.CreateBody(bodyDef).CreateFixture(fixDef);
}


