const { Engine, World, Bodies, Composite } = Matter;
const body = document.querySelector('body');
let clearMarblesBtn;

let engine;
let world;
let boxes = [];
let boundaries = [];
let balls = [];
let ground;
let mode = {
    balls: true,
    strings: false
};

function setup() {
    setupUI();  // This creates the buttons
    createCanvas(800, 800);
    engine = Engine.create();
    world = engine.world;

    generateBorders();

    boundaries.push(new Boundary(150, 100, width * 0.6, 20, 0.4));
    balls.push(new Ball(50, 50, 50));
}

function setupUI() {
    // div#controls-container
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controls-container';

    // button#clear-marbles-btn
    clearMarblesBtn = document.createElement('button');
    clearMarblesBtn.textContent = 'Clear Marbles';
    clearMarblesBtn.id = 'clear-marbles-btn';
    controlsContainer.appendChild(clearMarblesBtn);

    // button#place-marble-btn
    const placeMarbleBtn = document.createElement('button');
    placeMarbleBtn.textContent = 'Place Marble';
    placeMarbleBtn.id = 'place-marble-btn';
    controlsContainer.appendChild(placeMarbleBtn);

    // button#create-string-btn
    const createStringBtn = document.createElement('button');
    createStringBtn.textContent = 'Create String';
    createStringBtn.id = 'create-string-btn';
    controlsContainer.appendChild(createStringBtn);

    // Append controls container to body
    body.appendChild(controlsContainer);

    // Now that the button is created, we can safely add the event listener
    clearMarblesBtn.addEventListener('click', clearMarbles);
}

function mousePressed() {
    balls.push(new Ball(mouseX, mouseY, random(10, 40)));
}

function generateBorders() {
    const thickness = 50;

    boundaries.push(new Boundary(width / 2, (thickness / 2) * -1, width, thickness));
    boundaries.push(new Boundary((thickness / 2) * -1, height / 2, height, thickness, PI / 2));
    boundaries.push(new Boundary(width / 2, height + (thickness / 2), width, thickness));
    boundaries.push(new Boundary(width + (thickness / 2), height / 2, thickness, height));
}

// Empty balls array
function clearMarbles() {
    balls.length = 0;
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
