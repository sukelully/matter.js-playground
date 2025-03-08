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
let boundaries = [];
let balls = [];
let ground;

function setup() {
    createCanvas(400, 400);
    engine = Engine.create();
    world = engine.world;

    boundaries.push(new Boundary(150, 100, width* 0.6, 20, 0.3));
    boundaries.push(new Boundary(250, 300, width * 0.6, 20, -0.3));
    boxes.push(new Box(50, 20, 20, 20));
    balls.push(new Ball(50, 50, 50));
    
}
    
function mousePressed() {
    boxes.push(new Box(mouseX, mouseY, random(10, 40), random(10,40)));
}

function draw() {
    background(51);
    Engine.update(engine);

    for (const box of boxes) {
        box.show();
    }
    
    for (const boundary of boundaries) {
        boundary.show();
    }

    for (const ball of balls) {
        ball.show();
    }
}