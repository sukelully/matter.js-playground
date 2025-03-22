class String {
    constructor(x, y, w, h, a = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.freq = String.getFreq();
        let options = {
            friction: 0,
            restitution: 1,
            angle: a,
            isStatic: true,
            label: 'string'
        };
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);

        Composite.add(world, this.body);
    }

    static getFreq() {
        const cMajPent = [261.63, 329.63, 392, 493.88, 523.25, 587.33, 659.25];

        return cMajPent[Math.floor(Math.random() * cMajPent.length)];
    }

    draw() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(0);
        rect(0, 0, this.w, this.h);
    
        // Draw circles at the ends of the string
        // fill(0);
        // ellipse(-this.w / 2, 0, 30);
        // ellipse(this.w / 2, 0, 30);
    
        pop();
    }

    // Play string pluck at given frequency
    play(freq = this.freq) {
        // Initialize audioContext if it doesn't exist
        if (!audioContext) {
            audioContext = new AudioContext();
        }
        freq *= 0.5;
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

        const source = audioContext.createBufferSource();
        source.buffer = outputBuffer;
        source.connect(audioContext.destination);
        source.start();
    }

    remove() {
        Composite.remove(world, this.body);
    }
}