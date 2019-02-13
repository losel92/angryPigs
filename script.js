function start() {
	var sceneWidth = 800,
		sceneHeight = 600,
		xoffset = 5,
		groundHeight = 50,
		boxWidth = 25,
		boxHeight = 40,
		pyramid1N = 9,
		pyramid2N = 5;

	var ground2 = {
			x: sceneWidth*(3/4),
			y: sceneHeight/2.4,
			width: sceneWidth/4,
			height: 20
	};

	var rock = {
		x: sceneWidth*(1/5),
		y: sceneHeight*(5/7),
		edgesNumber: 8,
		radius: 20,
		options: {
			density: 0.004,
			render: {
				sprite: {
					texture: "images/pigo.png"
				}
			}

		}

	}

	var Engine = Matter.Engine,
		Render = Matter.Render,
		Runner = Matter.Runner,
		Composites = Matter.Composites,
		Events = Matter.Events,
		Constraint = Matter.Constraint,
		MouseConstraint = Matter.MouseConstraint,
		Mouse = Matter.Mouse,
		World = Matter.World,
		Bodies = Matter.Bodies;

	var engine = Engine.create(),
		world = engine.world;

	var render = Render.create(
		{
			element: document.body,
			engine: engine,
			options: {
				width: sceneWidth,
				height: sceneHeight,
				showAngleIndicator: false,
				wireframes: false,
				background: "images/space2.gif"
			}
		}
	);

	Render.run(render);
	var runner = Runner.create();

	Runner.run(runner, engine);

		var ground = Bodies.rectangle(sceneWidth/2, sceneHeight, sceneWidth + 2*xoffset, groundHeight, 
			{
				isStatic: true,
				render: {
					sprite: {
						texture: "images/g1.png"
					}
				}
			}
		);

		ground2.show = Bodies.rectangle(ground2.x, ground2.y, ground2.width, ground2.height,
			{
				isStatic: true,
				render: {
					sprite: {
						texture: "images/g2.png"
					}
				}
			}
		);

		var pyramidX = ground2.x - (pyramid1N/2) * boxWidth;
		var pyramid = Composites.pyramid(pyramidX, sceneHeight/2, pyramid1N, 10, 0, 0, function(x, y){
			return Bodies.rectangle(x, y, boxWidth, boxHeight,
				{
					render: {
						sprite: {
							texture: "images/birdo.png"
						}
					}
				}
			);
		});

		var pyramid2X = ground2.x - (pyramid2N/2) * boxWidth;
		var pyramid2 = Composites.pyramid(pyramid2X, 0, pyramid2N, 10, 0, 0, function(x, y){
			return Bodies.rectangle(x, y, boxWidth, boxHeight,
					{
					isStatic: false,
					render: {
						sprite: {
							texture: "images/birdo.png"
						}
					}
				}
			);
		});

		//var rockOptions = {density: 0.004};
		rock.obj = Bodies.polygon(rock.x, rock.y, rock.edgesNumber, rock.radius, rock.options);
		var elastic = Constraint.create({
				pointA: {x: rock.x, y: rock.y},
				bodyB: rock.obj,
				stiffness: 0.05
		});


		World.add(engine.world, [ground, ground2.show, pyramid, pyramid2, rock.obj, elastic]);

		var userMouse = Mouse.create(render.canvas);
		var mouseConstraint = MouseConstraint.create(engine, {
				mouse: userMouse,
				constraint: {
					stiffness: 0.2,
					render: {visible: false}
				}
		});

		World.add(world, mouseConstraint);
		render.mouse = userMouse;

		
		Events.on(engine, "afterUpdate", function(){
			var canShoot = rock.obj.position.x > rock.x + rock.radius;
			if(mouseConstraint.mouse.button === -1 && canShoot){
				
				rock.obj = Bodies.polygon(rock.x, rock.y, rock.edgesNumber, rock.radius, rock.options);
				
				World.add(engine.world, rock.obj);
				
				elastic.bodyB = rock.obj;
			}
		});





	Render.lookAt(render, {
		min: {x: 0, y: 0},
		max: {x: sceneWidth, y: sceneHeight}
	})
}