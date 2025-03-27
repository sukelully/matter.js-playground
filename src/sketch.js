// Import Matter.js modules
const { Engine, World, Bodies, Body, Composite } = Matter;

const marbleCategory = 0x0001;
const bassMarbleCategory = 0x0002;
const worldCategory = 0x0003;

// DOM and global variables
const body = document.querySelector('body');
let engine, world;
let strings = [], marbles = [], borders = [], grid = [], chimes = [];
let isDragging = false;
let bassMarble;
let dragStart = null;

// Mode toggles for placing marbles or creating strings
const mode = { marbles: true, strings: false, grid: false };

// Call drawCanvas in setup and on resize
function setup() {
    setupUI();
    drawCanvas();

    // Initialize Matter.js engine and world
    engine = Engine.create();
    engine.gravity.y = 0
    world = engine.world;

    // Generate borders and add initial objects
    createBorders();
    createChimes();

    // Create bass marble
    bassMarble = new BassMarble(width/2, height/2 + 200, 50);

    // Add collision event listener
    Matter.Events.on(engine, 'collisionStart', handleCollision);
    redrawCanvas();   // Resize canvas 
}

// Handles collisions between marbles and strings
function handleCollision(event) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        // Check if one body is a marble and the other is a string
        const isMarbleAndString =
            (bodyA.label === 'marble' && bodyB.label === 'chime') ||
            (bodyA.label === 'chime' && bodyB.label === 'marble');

        const isBassMarbleAndString =
            (bodyA.label === 'bass-marble' && bodyB.label === 'chime') ||
            (bodyA.label === 'chime' && bodyB.label === 'bass-marble');

        if (isMarbleAndString) {
            const chimeBody = bodyA.label === 'chime' ? bodyA : bodyB;
            
            // const marbleBody = bodyB;
            // const velocity = Math.hypot(marbleBody.velocity.x, marbleBody.velocity.y);

            // Find the corresponding String instance and play sound
            const chimeInstance = chimes.find(chime => chime.body === chimeBody);
            if (chimeInstance) {
                // stringInstance.play(smoothVelocity(velocity));
                chimeInstance.play();
            }
        }

        if (isBassMarbleAndString) {
            const chimeBody = bodyA.label === 'chime' ? bodyA : bodyB;

            // const marbleBody = bodyB;

            const chimeInstance = chimes.find(chime => chime.body === chimeBody);
            if (chimeInstance) {
                console.log('bass-marble collision');
            }
        }
    });
}

function changeChimeFreq(first, third, fifth, seventh, extended) {

}

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
    // borders.forEach(border => border.draw());
    chimes.forEach(chime => chime.draw());
    bassMarble.draw();
    strings.forEach(string => string.draw());
    marbles.forEach(marble => marble.draw());
}

function redrawCanvas() {
    bassMarble.remove();
    bassMarble = new BassMarble(width/2, height/2 + 200, 50);
    clearBorders();
    clearChimes();
    drawCanvas();
    drawGrid();
    createBorders();
    createChimes();
}

window.addEventListener('resize', redrawCanvas);