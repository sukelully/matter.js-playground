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

function createStringBetweenPoints(pos1, pos2) {
    const midX = (pos2.x + pos1.x) / 2;
    const midY = (pos2.y + pos1.y) / 2;
    const opp = pos2.y - pos1.y;
    const adj = pos2.x - pos1.x;
    const hyp = Math.hypot(opp, adj);
    const rotation = Math.asin(opp / hyp);
    
    strings.push(new String(midX, midY, hyp, 20, rotation));
}

function generateBorders() {
    const thickness = 50;
    new Boundary(width / 2, -thickness / 2, width, thickness);
    new Boundary(-thickness / 2, height / 2, thickness, height);
    new Boundary(width / 2, height + thickness / 2, width, thickness);
    new Boundary(width + thickness / 2, height / 2, thickness, height);
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
