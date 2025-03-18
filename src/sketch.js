const { Engine, World, Bodies, Composite } = Matter;
const body = document.querySelector('body');

let engine, world;
let strings = [], marbles = [];
let buttonHighlight = '#252525';
let buttonHighlightText = 'white';
let mouseCount = 0;
let stringPos1, stringPos2;

const mode = { marbles: true, strings: false };

function setup() {
    setupUI();
    createCanvas(800, 800);
    engine = Engine.create();
    world = engine.world;
    generateBorders();

    strings.push(new Boundary(150, 100, width * 0.6, 20, 0.4));
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
        console.log(isWithinCanvas(mouseX, mouseY, 100));
    } else {
        if (mouseCount === 0) {
            stringPos1 = { x: mouseX, y: mouseY };
            mouseCount++;
        } else {
            stringPos2 = { x: mouseX, y: mouseY };
            createStringBetweenPoints(stringPos1, stringPos2);
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

function createStringBetweenPoints(pos1, pos2) {
    const midX = (pos2.x + pos1.x) / 2;
    const midY = (pos2.y + pos1.y) / 2;

    let opp = pos2.y - pos1.y;
    let adj = pos2.x - pos1.x;
    // if (opp < 0) {
    //     opp *= -1;
    // }
    // console.log(opp, adj);
    const hyp = Math.hypot(opp, adj);
    if (adj < 0) {
        opp *= -1;
    }
    console.log(opp);
    const rotation = Math.asin(opp / hyp);

    strings.push(new String(midX, midY, hyp, 20, rotation));
}

function generateBorders() {
    const thickness = 50;
    new Boundary(width / 2, -thickness / 2, width, thickness);
    new Boundary(-thickness / 2, height / 2, thickness, height);
    new Boundary(width / 2, height + thickness / 2, width, thickness);
    new Boundary(width + thickness / 2, height / 2, thickness, height);

    // 100px
    // strings.push(new String(100, 0, 10, 10));
    // strings.push(new String(0, 100, 10, 10));
    // strings.push(new String(100, 100, 10, 10));

    // Top left corner (100, 100);
    // PI * r^2

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
    marbles.forEach(marble => marble.show());
}
