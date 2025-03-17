const { Engine, World, Bodies, Composite } = Matter;
const body = document.querySelector('body');
let placeMarbleBtn;
let createStringBtn;
let clearMarblesBtn;
let clearStringsBtn;

let engine;
let world;
let strings = [];
let marbles = [];
let ground;

let buttonHighlight = '#252525';
let buttonHighlightText = 'white';
let mouseCount = 0;
let stringPos1;
let stringPos2;

let mode = {
    marbles: true,
    strings: false
};

function setup() {
    setupUI();  // This creates the buttons
    createCanvas(800, 800);
    engine = Engine.create();
    world = engine.world;

    generateBorders();

    strings.push(new Boundary(150, 100, width * 0.6, 20, 0.4));
    marbles.push(new Ball(50, 50, 50));
}

function setupUI() {
    // div#controls-container
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controls-container';

    // button#place-marble-btn
    placeMarbleBtn = document.createElement('button');
    placeMarbleBtn.textContent = 'Place Marble';
    placeMarbleBtn.id = 'place-marble-btn';
    placeMarbleBtn.style.background = buttonHighlight;
    placeMarbleBtn.style.color = buttonHighlightText;
    controlsContainer.appendChild(placeMarbleBtn);

    // button#create-string-btn
    createStringBtn = document.createElement('button');
    createStringBtn.textContent = 'Create String';
    createStringBtn.id = 'create-string-btn';
    controlsContainer.appendChild(createStringBtn);

    // button#clear-marbles-btn
    clearMarblesBtn = document.createElement('button');
    clearMarblesBtn.textContent = 'Clear Marbles';
    clearMarblesBtn.id = 'clear-marbles-btn';
    controlsContainer.appendChild(clearMarblesBtn);

    // button#clear-strings-btn
    clearStringsBtn = document.createElement('button');
    clearStringsBtn.textContent = 'Clear Strings';
    clearStringsBtn.id = 'clear-strings-btn';
    controlsContainer.appendChild(clearStringsBtn);

    // Append controls container to body
    body.appendChild(controlsContainer);

    // Event listeners
    placeMarbleBtn.addEventListener('click', placeMarbleBtnPressed);
    createStringBtn.addEventListener('click', createStringBtnPressed);
    clearMarblesBtn.addEventListener('click', clearMarbles);
    clearStringsBtn.addEventListener('click', clearStrings);
}

function placeMarbleBtnPressed() {
    mode.marbles = true;
    mode.strings = false;

    placeMarbleBtn.style.background = buttonHighlight;
    placeMarbleBtn.style.color = buttonHighlightText;
    createStringBtn.style.background = 'white';
    createStringBtn.style.color = 'black';
}

function createStringBtnPressed() {
    mode.marbles = false;
    mode.strings = true;

    placeMarbleBtn.style.background = 'white';
    placeMarbleBtn.style.color = 'black';
    createStringBtn.style.background = buttonHighlight;
    createStringBtn.style.color = buttonHighlightText;
}

function mousePressed() {
    // Limits interaction to canvas area
    if (mouseX < width && mouseY < height) {
        if (mouseX > 0 && mouseY > 0) {
            // Functionality depends on selected mode
            if (mode.marbles) {
                marbles.push(new Ball(mouseX, mouseY, random(10, 40)))
            } else if (mode.strings) {
                // strings.push(new String(mouseX, mouseY, width * 0.6, 20, 0.4));
                if (mouseCount === 0) {
                    stringPos1 = { x: mouseX, y: mouseY };
                    // marbles.push(new Ball(stringPos1.x, stringPos1.y, 20));
                    console.log(`stringPos1.x: ${stringPos1.x}`);
                    mouseCount++;
                } else if (mouseCount === 1) {
                    stringPos2 = { x: mouseX, y: mouseY };
                    // marbles.push(new Ball(stringPos2.x, stringPos2.y, 20));
                    console.log(`stringPos2.x: ${stringPos2.x}`);
                    mouseCount = 0;

                    let midX = ((stringPos2.x - stringPos1.x) / 2) + stringPos1.x;
                    // let midY = stringPos2.y - stringPos1.y;
                    let midY = ((stringPos2.y - stringPos1.y) / 2) + stringPos1.y;
                    strings.push(new String(midX, midY, width * 0.6, 20, 0));
                    console.log(`midX: ${midX}`);
                    // console.log(midY);

                    // strings.push(new String(midX, midY, width * 0.6, 20, 0));
                    // strings.push(new String(mouseX, mouseY, width * 0.6, 20, 0.4));
                }
            }
        } else {
            console.error('Error: Invalid mode selected');
        }
    }
}

function generateBorders() {
    const thickness = 50;

    new Boundary(width / 2, (thickness / 2) * -1, width, thickness)
    new Boundary((thickness / 2) * -1, height / 2, height, thickness, PI / 2);
    new Boundary(width / 2, height + (thickness / 2), width, thickness);
    new Boundary(width + (thickness / 2), height / 2, thickness, height);
}

// Empty marbles array
function clearMarbles() {
    for (const marble of marbles) {
        marble.remove();
    }

    marbles.length = 0;
}

function clearStrings() {
    for (const string of strings) {
        string.remove();
    }

    strings.length = 0;
}

function draw() {
    background(255);
    Engine.update(engine);

    for (const string of strings) {
        string.show();
    }

    for (const marble of marbles) {
        marble.show();
    }
}
