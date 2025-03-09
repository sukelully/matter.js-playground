const { Engine, World, Bodies, Composite } = Matter;

let engine;
let world;
let boxes = [];
let boundaries = [];
let balls = [];
let ground;


function setup() {
    createCanvas(800, 800);
    engine = Engine.create();
    // engine.world.gravity.y = 0.1;
    world = engine.world;

    generateBorders();

    boundaries.push(new Boundary(150, 100, width* 0.6, 20, 0.4));

    balls.push(new Ball(50, 50, 50));
}
    
function mousePressed() {
    balls.push(new Ball(mouseX, mouseY, random(10, 40)));
}

function generateBorders() {
    const thickness = 50;

    boundaries.push(new Boundary(width/2, (thickness/2) * -1, width, thickness));
    boundaries.push(new Boundary((thickness/2) * -1, height/2, height, thickness, PI / 2));
    boundaries.push(new Boundary(width/2, height + (thickness/2), width, thickness));
    boundaries.push(new Boundary(width + (thickness/2), height/2, thickness, height));
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