// Import Matter.js modules
const { Engine, World, Bodies, Composite } = Matter;

const GRID_SIZE = 50;

// DOM and global variables
const body = document.querySelector('body');
let engine, world;
let strings = [], marbles = [], borders = [], grid = [];
let buttonHighlight = '#252525';
let buttonHighlightText = 'white';
let mouseCount = 0;
let stringPos1, stringPos2;

let audioContext;
let source;

// Mode toggles for placing marbles or creating strings
const mode = { marbles: true, strings: false, grid: false };

// Call drawCanvas in setup and on resize
function setup() {
    setupUI();
    drawCanvas();

    // Initialize Matter.js engine and world
    engine = Engine.create();
    world = engine.world;

    // Generate borders and add initial objects
    generateBorders();
    strings.push(new String(150, 100, width * 0.6, 5, 0.4));
    marbles.push(new Marble(50, 50, 30));

    // Add collision event listener
    Matter.Events.on(engine, 'collisionStart', handleCollision);
}

// Handles collisions between marbles and strings
function handleCollision(event) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        // Check if one body is a marble and the other is a string
        const isMarbleAndString =
            (bodyA.label === 'marble' && bodyB.label === 'string') ||
            (bodyA.label === 'string' && bodyB.label === 'marble');

        if (isMarbleAndString) {
            const stringBody = bodyA.label === 'string' ? bodyA : bodyB;

            // Find the corresponding String instance and play sound
            const stringInstance = strings.find(string => string.body === stringBody);
            if (stringInstance) {
                stringInstance.play(stringInstance.w); // Play sound at 440 Hz
            }
        }
    });
}

// Handles mouse press events for placing marbles or creating strings
function mousePressed() {
    // Limit mouse presses to canvas area
    let gridX, gridY;
    if (mouseX < 0 || mouseY < 0 || mouseX >= width || mouseY >= height) return;

    // Place marbles
    if (mode.marbles) {
        marbles.push(new Marble(mouseX, mouseY, 30));
    // Or create strings
    } else {
        // Round to nearest grid cell size
        if (mode.grid) {
            gridX = Math.round(mouseX / GRID_SIZE) * GRID_SIZE;
            gridY = Math.round(mouseY / GRID_SIZE) * GRID_SIZE;
            console.log(gridX, gridY);
        } else {
            gridX = mouseX;
            gridY = mouseY;
        }
        if (mouseCount === 0) {
            stringPos1 = { x: gridX, y: gridY };
            mouseCount++;
        } else {
            stringPos2 = { x: gridX, y: gridY };
            createLineBetweenPoints(strings, stringPos1, stringPos2);
            mouseCount = 0;
        }
    }
}

// Main draw loop
function draw() {
    clear();
    background(255);
    Engine.update(engine);

    if (mode.grid) grid.forEach(gridLine => gridLine.draw());
    borders.forEach(border => border.draw());
    strings.forEach(string => string.draw());
    marbles.forEach(marble => marble.draw());
}

window.addEventListener('resize', () => {
    clearBorders();
    drawCanvas();
    drawGrid();
    generateBorders();
});