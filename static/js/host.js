function resizeScreen() {
  canvas.width = $(window).width();
  canvas.height = $(window).height();      
}

function init() {               
  var players = {};
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext('2d');
//  resizeScreen();
  
//  $(window).resize(resizeScreen);
  

    var cwidth = 1 * canvas.width;
    var cheight=  1 * canvas.height;
  
  

        var bgImage = new Image();
        bgImage.src = "/img/background.png";
        
        var engineImage = new Image();
        engineImage.src = "/img/test_unit01.png";

        var wbImage = new Image();
        wbImage.src = "/img/wreck_ball_64x64.png";

      
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
               new b2Vec2(0, 0)    //gravity
               ,  true                 //allow sleep
         );
         
         var fixDef = new b2FixtureDef;
         fixDef.density = 1;
//         fixDef.friction = 0.5;
//         fixDef.restitution = 0.2;
//         fixDef.linearDamping = 1000;
         
         var bodyDef = new b2BodyDef;
         
         function px2m(px) { return px / 30; }
         function m2px(m) { return m * 30; }
         
         //create ground
         bodyDef.type = b2Body.b2_staticBody;
         fixDef.shape = new b2PolygonShape;

// Bovensten rand: hele breedte, 4px hoog
         fixDef.shape.SetAsBox(px2m(cwidth) / 2, px2m(4) / 2);
         bodyDef.position.Set(px2m(cwidth) / 2, px2m(4) / 2);
         world.CreateBody(bodyDef).CreateFixture(fixDef);

// Onderste rand: hele breedte, 4px hoog
         bodyDef.position.Set(px2m(cwidth) / 2, px2m(cheight - 2));
         world.CreateBody(bodyDef).CreateFixture(fixDef);

// Linker rand, hele hoogte, 4px breed
         fixDef.shape.SetAsBox(px2m(4) / 2, px2m(cheight) / 2);
         bodyDef.position.Set(px2m(2), px2m(cheight / 2));
         world.CreateBody(bodyDef).CreateFixture(fixDef);
// Rechter rand, hele hoogte, 4px breed         
         bodyDef.position.Set(px2m(cwidth - 2), px2m(cheight / 2));
         world.CreateBody(bodyDef).CreateFixture(fixDef);

         
         //maak ff 2 players aan

         bodyDef.type = b2Body.b2_dynamicBody;
         for(var i = 1; i < 3; ++i) {

          fixDef.shape = new b2CircleShape(1);

          bodyDef.position.x = px2m(Math.random() * (cwidth / 2));
          bodyDef.position.y = px2m(Math.random() * (cheight / 2));
          
          bodyDef.linearDamping = 1;
          bodyDef.angularDamping = 1;
          players['player' + i] = {
            body: world.CreateBody(bodyDef),
            force: new b2Vec2(0, 0),
            oldForce: new b2Vec2(0, 0)
          };
          
          players['player' + i].body.CreateFixture(fixDef);
         }
         
         //setup debug draw
         var debugDraw = new b2DebugDraw();
  			 debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
	  		 debugDraw.SetDrawScale(30.0);
	  		 debugDraw.SetFillAlpha(0.5);
	   		 debugDraw.SetLineThickness(1.0);
			   debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		     //world.SetDebugDraw(debugDraw);
         
      window.setInterval(update, 1000 / 30);
      
      
      var track = false;
        $("#pad").live("mousedown", function(e) {
        track = true;
      });
      $("#pad").live("mousemove", function(e) {
        if (track) {
        var x = e.offsetX - 100;
        var y = e.offsetY - 100;
        players.player1.force = new b2Vec2(x, y);
        $("#pad").text(x + ", " + y)

        }
      })
      
      $("#pad").live("mouseup", function(e) {
        track = false;
        $("#pad").text("0, 0")
        players.player1.force = new b2Vec2(0, 0);
      });
      
      $(document).keydown(function(c) {
        if (c.keyCode == 37) {
          players['player2'].force = new b2Vec2(-10,0);
        }
        if (c.keyCode == 38) {
          players['player2'].force = new b2Vec2(0,-10);
        }
        if (c.keyCode == 39) {
          players['player2'].force = new b2Vec2(10,0);
        }
        if (c.keyCode == 40) {
          players['player2'].force = new b2Vec2(0,10);
        }
        players['player2'].oldForce = players['player1'].force.Copy();
      });

      $(document).keyup(function(c) {
        players['player2'].oldForce = players['player2'].force.Copy();
        players['player2'].force = new b2Vec2(0, 0);
      }); 


       //update
       
       function update() {


        context.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        
for(var i = 1; i < 3; ++i) {

      var player = players['player' + i];

        var f = player.force.Copy();
        var oldForce = player.oldForce.Copy();
        f.Multiply(0.05);
        var pos = player.body.GetPosition();
     	player.body.ApplyImpulse(f, player.body.GetPosition());
 



      context.save();
      context.translate(m2px(pos.x) , m2px(pos.y));

      context.drawImage(wbImage, - (wbImage.width /2), - (wbImage.height /2) , wbImage.width, wbImage.height);


      context.translate(f.x * 15, f.y * 15);
      
      if (f.y == 0 && f.x == 0) {
        context.rotate(Math.atan2(oldForce.y, oldForce.x));
      } else {
        context.rotate(Math.atan2(f.y, f.x));
      }

      context.drawImage(engineImage, - (engineImage.width /2), - (engineImage.height /2) , engineImage.width, engineImage.height);

         context.restore();
}

          world.Step(1 / 30, 10, 10);
          world.DrawDebugData();
          world.ClearForces();
       };
         


      };
      
    

      
