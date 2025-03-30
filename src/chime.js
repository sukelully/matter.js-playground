class Chime {
    constructor(x, y, r, freq, chime, oct = 1) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.freq = freq;
        this.oct = oct;

        let options = {
            friction: 0,
            restitution: 1,
            isStatic: true,
            label: chime
        }

        this.body = Bodies.circle(this.x, this.y, this.r / 2, options);
        Composite.add(world, this.body);
    }

    draw() {
        let pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        strokeWeight(1);
        stroke(0);
        fill(0);
        ellipse(0, 0, this.r);
        pop();
    }

    // Play string pluck at given frequency
    play() {
        // Initialize audioContext if it doesn't exist
        if (!audioContext) {
            audioContext = new AudioContext();
        }

        const delaySamples = Math.round(audioContext.sampleRate / (this.freq * this.oct));
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
            delayBuffer[dbIndex] = sample + 0.995 * (delayBuffer[dbIndex] + delayBuffer[(dbIndex + 1) % delaySamples]) / 2;
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