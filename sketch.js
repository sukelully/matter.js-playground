// Coding Train / Daniel Shiffman
// 15.7 Matter.js tutorial Basic Implemenation

// Youtube: https://www.youtube.com/watch?v=urR596FsU68

// Note that the syntax in the sketch has been updated. Refer to NOC Chapter 6

// let Engine = Matter.Engine,
//     World = Matter.World,
//     Bodies = Matter.Bodies;
    
const { Engine, World, Bodies, Composite } = Matter;

let engine;
let world;
let boxes = [];
let ground;

function setup() {
    createCanvas(400, 400);
    // create an engine
    engine = Engine.create();
    engine.world.gravity.y = 0;
    world = engine.world;
    // Engine.run is deprecated
    ground = new Boundary(200, height, width, 100);
    Composite.add(world, ground);
}
    
function mousePressed() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10,40)));
}

function draw() {
    background(51);
    Engine.update(engine);

    for (const box of boxes) {
        box.show();
        console.log(box.getVelocity());
    }
    
    ground.show();
}