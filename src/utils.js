const GRID_SIZE = 50;
let buttonHighlight = '#252525';
let buttonHighlightText = 'white';
let stringPos1, stringPos2;
let mouseCount = 0;
let audioContext;
let source;
let octave = 1;

// Sets up the UI with buttons for different actions
function setupUI() {
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controls-container';

    const buttons = [
        { id: 'place-marble-btn', text: 'Place Marble', handler: () => setMode(true) },
        { id: 'create-string-btn', text: 'Create String', handler: () => setMode(false) },
        { id: 'clear-marbles-btn', text: 'Clear Marbles', handler: clearMarbles },
        { id: 'clear-strings-btn', text: 'Clear Strings', handler: clearStrings },
        { id: 'grid-btn', text: 'Grid', handler: toggleGrid }
    ];

    buttons.forEach(({ id, text, handler }) => {
        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = text;

        // Highlight the "Place Marble" button by default
        if (id === 'place-marble-btn') applyButtonHighlight(btn, true);

        btn.addEventListener('click', handler);
        controlsContainer.appendChild(btn);
    });

    body.appendChild(controlsContainer);
}

function smoothVelocity(velocity) {
    return 0.9995 - 0.1 * Math.exp(-0.35 * velocity);
}

// Clears all borders from the canvas
function clearBorders() {
    borders.forEach(border => border.remove());
    borders = [];
}

// Clears all marbles from the canvas
function clearMarbles() {
    marbles.forEach(marble => marble.remove());
    marbles = [];
}

// Clears all strings from the canvas
function clearStrings() {
    strings.forEach(string => string.remove());
    strings = [];
}

// Creates a line between two points and adds it to the specified array
function createLineBetweenPoints(arr, pos1, pos2, thickness = 5) {
    const midX = (pos2.x + pos1.x) / 2;
    const midY = (pos2.y + pos1.y) / 2;

    let opp = pos2.y - pos1.y;
    let adj = pos2.x - pos1.x;

    if (adj < 0) opp *= -1;

    const hyp = Math.hypot(opp, adj);
    const rotation = Math.asin(opp / hyp);

    if (arr === strings) {
        arr.push(new String(midX, midY, hyp, thickness, rotation));
    } else {
        arr.push(new Boundary(midX, midY, hyp, thickness, rotation));
    }
}

// Generates borders around the canvas
function generateBorders() {
    const thickness = 50;
    borders.push(new Boundary(width / 2, -thickness / 2, width, thickness));
    borders.push(new Boundary(-thickness / 2, height / 2, thickness, height));
    borders.push(new Boundary(width / 2, height + thickness / 2, width, thickness));
    borders.push(new Boundary(width + thickness / 2, height / 2, thickness, height));

    createCornerBorders();
}

// Creates corner borders with angled lines
function createCornerBorders() {
    if (screen.width > 640) {
        // Top-left corner
        createLineBetweenPoints(borders, { x: -6, y: 50 }, { x: 50, y: -6 }, 20);
        createLineBetweenPoints(borders, { x: 0, y: 25 }, { x: 75, y: -10 }, 20);
        createLineBetweenPoints(borders, { x: -10, y: 75 }, { x: 25, y: 0 }, 20);

        // Top-right corner
        createLineBetweenPoints(borders, { x: width + 6, y: 50 }, { x: width - 50, y: -6 }, 20);
        createLineBetweenPoints(borders, { x: width, y: 25 }, { x: width - 75, y: -10 }, 20);
        createLineBetweenPoints(borders, { x: width + 10, y: 75 }, { x: width - 25, y: 0 }, 20);

        // Bottom-left corner
        createLineBetweenPoints(borders, { x: -6, y: height - 50 }, { x: 50, y: height + 6 }, 20);
        createLineBetweenPoints(borders, { x: 0, y: height - 25 }, { x: 75, y: height + 10 }, 20);
        createLineBetweenPoints(borders, { x: -10, y: height - 75 }, { x: 25, y: height }, 20);

        // Bottom-right corner
        createLineBetweenPoints(borders, { x: width + 6, y: height - 50 }, { x: width - 50, y: height + 6 }, 20);
        createLineBetweenPoints(borders, { x: width, y: height - 25 }, { x: width - 75, y: height + 10 }, 20);
        createLineBetweenPoints(borders, { x: width + 10, y: height - 75 }, { x: width - 25, y: height }, 20);
    } else {
        // Top-left corner
        createLineBetweenPoints(borders, { x: -12, y: 50 }, { x: 50, y: -12 }, 20);
        createLineBetweenPoints(borders, { x: 0, y: 20 }, { x: 75, y: -13 }, 20);
        createLineBetweenPoints(borders, { x: -13, y: 75 }, { x: 20, y: 0 }, 20);

        // Top-right corner
        createLineBetweenPoints(borders, { x: width + 12, y: 50 }, { x: width - 50, y: -12 }, 20);
        createLineBetweenPoints(borders, { x: width, y: 20 }, { x: width - 75, y: -13 }, 20);
        createLineBetweenPoints(borders, { x: width + 13, y: 75 }, { x: width - 20, y: 0 }, 20);

        // Bottom-left corner
        createLineBetweenPoints(borders, { x: -12, y: height - 50 }, { x: 50, y: height + 12 }, 20);
        createLineBetweenPoints(borders, { x: 0, y: height - 20 }, { x: 75, y: height + 13 }, 20);
        createLineBetweenPoints(borders, { x: -13, y: height - 75 }, { x: 20, y: height }, 20);

        // Bottom-right corner
        createLineBetweenPoints(borders, { x: width + 12, y: height - 50 }, { x: width - 50, y: height + 12 }, 20);
        createLineBetweenPoints(borders, { x: width, y: height - 20 }, { x: width - 75, y: height + 13 }, 20);
        createLineBetweenPoints(borders, { x: width + 13, y: height - 75 }, { x: width - 20, y: height }, 20);


    }
}

// Checks if coordinates are within the canvas, accounting for rounded corners
function isWithinCanvas(x, y, radius) {
    if (x >= 0 && x <= width && y >= radius && y <= height - radius) return true;
    if (x >= radius && x <= width - radius && y >= 0 && y <= height) return true;

    const corners = [
        { cx: radius, cy: radius },                     // Top-left
        { cx: width - radius, cy: radius },             // Top-right
        { cx: radius, cy: height - radius },            // Bottom-left
        { cx: width - radius, cy: height - radius }     // Bottom-right
    ];

    return corners.some(({ cx, cy }) => (x - cx) ** 2 + (y - cy) ** 2 < radius ** 2);
}

function toggleGrid() {
    if (mode.grid) {
        mode.grid = false;
    } else {
        mode.grid = true;
    }
    applyButtonHighlight(document.getElementById('grid-btn'), mode.grid);
    drawGrid();
}

function drawGrid() {
    for (let i = 0; i < height; i++) {
        if (i % GRID_SIZE === 0) {
            grid.push(new GridLine(width / 2, i, width, 1));
        }
    }

    for (let j = 0; j < height; j++) {
        if (j % GRID_SIZE === 0) {
            grid.push(new GridLine(j, height / 2, 1, height));
        }
    }
}

// Toggles between marble and string placement modes
function setMode(marblesActive) {
    mode.marbles = marblesActive;
    mode.strings = !marblesActive;

    applyButtonHighlight(document.getElementById('place-marble-btn'), marblesActive);
    applyButtonHighlight(document.getElementById('create-string-btn'), !marblesActive);
}

// Highlights the active button
function applyButtonHighlight(button, isActive) {
    button.style.background = isActive ? buttonHighlight : '#efefef';
    button.style.color = isActive ? buttonHighlightText : 'black';
}

function drawCanvas() {
    const screenWidthCutoff = screen.width % 100;
    const screenHeightCutoff = screen.height % 100;
    const screenWidth = screen.width - screenWidthCutoff;
    const screenHeight = screen.height - screenHeightCutoff;

    const controlsContainer = document.getElementById('controls-container');
    const adjustedHeight = Math.floor((screenHeight - controlsContainer.offsetHeight) / 10) * 10;

    const isLandscape = screen.width > screen.height;
    const isLargeScreen = screen.width > 640;

    if (isLandscape) {
        createCanvas(isLargeScreen ? screenHeight : screenWidth, isLargeScreen ? screenHeight : adjustedHeight);
    } else {
        createCanvas(screenWidth, isLargeScreen ? screenWidth : adjustedHeight);
    }

    const canvasControlsWidth = (body.offsetWidth > body.offsetHeight)
        ? width + 200
        : width + controlsContainer.offsetWidth;

    if (canvasControlsWidth > screen.width) {
        applyColumnLayout(controlsContainer, isLargeScreen, adjustedHeight);
    } else {
        applyRowLayout(controlsContainer);
    }
}

function applyColumnLayout(controlsContainer, isLargeScreen, adjustedHeight) {
    body.style.flexDirection = 'column';
    body.style.gap = '1em';
    controlsContainer.style.flexDirection = 'row';
    controlsContainer.style.flexWrap = 'wrap';
    controlsContainer.style.justifyContent = 'center';

    if (isLargeScreen) {
        createCanvas(adjustedHeight, adjustedHeight);
    } else {
        createCanvas(width, adjustedHeight - 100);
    }
}

function applyRowLayout(controlsContainer) {
    body.style.flexDirection = 'row';
    body.style.gap = '3em';
    controlsContainer.style.flexDirection = 'column';
}