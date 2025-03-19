const { Engine, World, Bodies, Composite } = Matter;
const body = document.querySelector('body');

let engine, world;
let strings = [], marbles = [], borders = [];
let buttonHighlight = '#252525';
let buttonHighlightText = 'white';
let mouseCount = 0;
let stringPos1, stringPos2;

const mode = { marbles: true, strings: false };

function setup() {
    // frameRate(15);
    setupUI();
    createCanvas(800, 800);
    engine = Engine.create();
    engine.world.gravity.x = -0.5;
    engine.world.gravity.y = -.5;
    world = engine.world;
    generateBorders();

    strings.push(new String(150, 100, width * 0.6, 20, 0.4));
    marbles.push(new Marble(50, 50, 30));
}

function setupUI() {
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controls-container';

    const buttons = [
        { id: 'place-marble-btn', text: 'Place Marble', handler: () => setMode(true) },
        { id: 'create-string-btn', text: 'Create String', handler: () => setMode(false) },
        { id: 'clear-marbles-btn', text: 'Clear Marbles', handler: clearMarbles },
        { id: 'clear-strings-btn', text: 'Clear Strings', handler: clearStrings }
    ];

    buttons.forEach(({ id, text, handler }) => {
        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = text;
        if (id === 'place-marble-btn') applyButtonHighlight(btn, true);
        btn.addEventListener('click', handler);
        controlsContainer.appendChild(btn);
    });

    body.appendChild(controlsContainer);
}

function setMode(marblesActive) {
    mode.marbles = marblesActive;
    mode.strings = !marblesActive;

    applyButtonHighlight(document.getElementById('place-marble-btn'), marblesActive);
    applyButtonHighlight(document.getElementById('create-string-btn'), !marblesActive);
}

function applyButtonHighlight(button, isActive) {
    button.style.background = isActive ? buttonHighlight : '#efefef';
    button.style.color = isActive ? buttonHighlightText : 'black';
}

function mousePressed() {
    // Limit mouse presses to canvas area
    if (mouseX < 0 || mouseY < 0 || mouseX >= width || mouseY >= height) return;

    if (mode.marbles) {
        marbles.push(new Marble(mouseX, mouseY, random(10, 40)));
        // console.log(isWithinCanvas(mouseX, mouseY, 100));
    } else {
        if (mouseCount === 0) {
            stringPos1 = { x: mouseX, y: mouseY };
            mouseCount++;
        } else {
            stringPos2 = { x: mouseX, y: mouseY };
            createLineBetweenPoints(strings, stringPos1, stringPos2);
            mouseCount = 0;
        }
    }
}

// Returns boolean indicating whether the provided coordinates are within the canvas
// (accounting for border rounding)
function isWithinCanvas(x, y, radius) {

    if (x >= 0 && x <= width && y >= radius && y <= height - radius) {
        return true;
    }

    if (x >= radius && x <= width - radius && y >= 0 && y <= height) {
        return true;
    }

    // Define corner centers
    const corners = [
        { cx: radius, cy: radius },                     // Top-left
        { cx: width - radius, cy: radius },             // Top-right
        { cx: radius, cy: height - radius },            // Bottom-left
        { cx: width - radius, cy: height - radius }     // Bottom-right
    ];

    // Check if entity is inside any rounded corner
    return corners.some(({ cx, cy }) => {
        return (x - cx) ** 2 + (y - cy) ** 2 < radius ** 2;
    });
}

function createLineBetweenPoints(arr, pos1, pos2) {
    const midX = (pos2.x + pos1.x) / 2;
    const midY = (pos2.y + pos1.y) / 2;

    let opp = pos2.y - pos1.y;
    let adj = pos2.x - pos1.x;

    if (adj < 0) {
        opp *= -1;
    }
    
    const hyp = Math.hypot(opp, adj);
    const rotation = Math.asin(opp / hyp);

    arr.push(new String(midX, midY, hyp, 20, rotation));
}

function generateBorders() {
    const thickness = 50;
    new Boundary(width / 2, -thickness / 2, width, thickness);
    new Boundary(-thickness / 2, height / 2, thickness, height);
    new Boundary(width / 2, height + thickness / 2, width, thickness);
    new Boundary(width + thickness / 2, height / 2, thickness, height);

    createCornerBorder();

}

function createCornerBorder() {
    const radius = 100;

    const corners = [
        { cx: radius, cy: radius },                     // Top-left
        { cx: width - radius, cy: radius },             // Top-right
        { cx: radius, cy: height - radius },            // Bottom-left
        { cx: width - radius, cy: height - radius }     // Bottom-right
    ];

    // Top left corner
    createLineBetweenPoints(borders, {x: -6, y: 50}, {x: 50, y: -6});
    createLineBetweenPoints(borders, {x: 0, y: 25}, {x: 75, y: -10});
}

function clearMarbles() {
    marbles.forEach(marble => marble.remove());
    marbles = [];
}

function clearStrings() {
    strings.forEach(string => string.remove());
    strings = [];
}

function draw() {
    background(255);
    Engine.update(engine);
    strings.forEach(string => string.show());
    borders.forEach(border => border.show());
    marbles.forEach(marble => {
        marble.show();
        marble.update();
    });

    Matter.Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(pair => {
            if (pair.bodyA.label === "string" || pair.bodyB.label === "string") {
                console.log("collision detected with string", pair.bodyA, pair.bodyB);
            }
        })
    })
}
