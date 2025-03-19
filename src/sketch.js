const { Engine, World, Bodies, Composite } = Matter;
const body = document.querySelector('body');

let engine, world;
let strings = [], marbles = [], borders = [];
let buttonHighlight = '#252525';
let buttonHighlightText = 'white';
let mouseCount = 0;
let stringPos1, stringPos2;

let audioContext;
let source;

const mode = { marbles: true, strings: false };

function setup() {
    // frameRate(15);
    setupUI();
    if (screen.width > 1024) {
        createCanvas(800, 800);
    } else if (screen.width > 640) {
        createCanvas(600, 600);
    } else {
        createCanvas(400, 400);
    }
    console.log(screen.width);
    engine = Engine.create();
    world = engine.world;
    generateBorders();

    strings.push(new String(150, 100, width * 0.6, 20, 0.4));
    marbles.push(new Marble(50, 50, 30));

    Matter.Events.on(engine, 'collisionStart', handleCollision);
}

function handleCollision(event) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        // Check if one body is a marble and the other is a string
        const isMarbleAndString =
            (bodyA.label === 'marble' && bodyB.label === 'string') ||
            (bodyA.label === 'string' && bodyB.label === 'marble');

        if (isMarbleAndString) {
            playFreq(440);
        }
    });
}

function playFreq(freq) {
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    // Delay line buffer
    const delaySamples = Math.round(audioContext.sampleRate / freq);
    const delayBuffer = new Float32Array(delaySamples);
    let dbIndex = 0;

    // 7s output buffer
    const bufferSize = audioContext.sampleRate * 7;
    const outputBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = outputBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        const noiseBurst = audioContext.sampleRate / 100;
        const sample = (i < noiseBurst) ? Math.random() * 2 * 0.2 - 0.2 : 0;

        // Apply lowpass by averaging adjacent delay line samples
        delayBuffer[dbIndex] = sample + 0.99 * (delayBuffer[dbIndex] + delayBuffer[(dbIndex + 1) % delaySamples]) / 2;
        output[i] = delayBuffer[dbIndex];

        // Loop delay buffer
        if (++dbIndex >= delaySamples) {
            dbIndex = 0;
        }
    }

    source = audioContext.createBufferSource();
    source.buffer = outputBuffer;
    source.connect(audioContext.destination);
    source.start();
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
        marbles.push(new Marble(mouseX, mouseY, 30));
        // console.log(isWithinCanvas(mouseX, mouseY, 100));
    } else {
        if (mouseCount === 0) {
            stringPos1 = { x: mouseX, y: mouseY };
            mouseCount++;
        } else {
            stringPos2 = { x: mouseX, y: mouseY };
            createLineBetweenPoints(strings, stringPos1, stringPos2);
            createString(stringPos1, stringPos2);
            mouseCount = 0;
        }
    }
}

function createString(pos1, pos2) {
    const ballOptions = {
        isStatic: true
    }

    const point1 = Bodies.circle(pos1.x, pos1.y, 20, ballOptions);
    Composite.add(world, point1);
    rectMode(CENTER);
    fill(0);
    ellipse(pos1.x, pos1.y, 20);
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

    if (arr === strings) {
        arr.push(new String(midX, midY, hyp, 20, rotation));
    } else {
        arr.push(new Boundary(midX, midY, hyp, 20, rotation));
    }
}

function generateBorders() {
    const thickness = 50;
    new Boundary(width / 2, -thickness / 2, width, thickness);
    new Boundary(-thickness / 2, height / 2, thickness, height);
    new Boundary(width / 2, height + thickness / 2, width, thickness);
    new Boundary(width + thickness / 2, height / 2, thickness, height);

    createCornerBorders();
}

function createCornerBorders() {
    // Top-left corner
    createLineBetweenPoints(borders, {x: -6, y: 50}, {x: 50, y: -6});
    createLineBetweenPoints(borders, {x: 0, y: 25}, {x: 75, y: -10});
    createLineBetweenPoints(borders, {x: -10, y: 75}, {x: 25, y: 0});
    
    // Top-right corner
    createLineBetweenPoints(borders, {x: width + 6, y: 50}, {x: width - 50, y: -6});
    createLineBetweenPoints(borders, {x: width, y: 25}, {x: width - 75, y: -10});
    createLineBetweenPoints(borders, {x: width + 10, y: 75}, {x: width - 25, y: 0});
    
    // Bottom-left corner
    createLineBetweenPoints(borders, {x: -6, y: height - 50}, {x: 50, y: height + 6});
    createLineBetweenPoints(borders, {x: 0, y: height - 25}, {x: 75, y: height + 10});
    createLineBetweenPoints(borders, {x: -10, y: height - 75}, {x: 25, y: height});
    
    // Bottom-right corner
    createLineBetweenPoints(borders, {x: width + 6, y: height - 50}, {x: width - 50, y: height + 6});
    createLineBetweenPoints(borders, {x: width, y: height - 25}, {x: width - 75, y: height + 10});
    createLineBetweenPoints(borders, {x: width + 10, y: height - 75}, {x: width - 25, y: height});
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

    strings.forEach(string => string.draw());
    borders.forEach(borders => borders.draw());
    marbles.forEach(marble => {
        marble.draw();
        marble.update();
    });
}

window.addEventListener('resize', () => {
    if (screen.width > 1024) {
        createCanvas(800, 800);
        borders = [];
        generateBorders();
    } else if (screen.width > 640) {
        createCanvas(600, 600);
        borders = [];
        generateBorders();
    } else {
        createCanvas(400, 400);
        borders = [];
        generateBorders();
    }
});