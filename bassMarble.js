class Marble {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.colour = Marble.getRandomColour();

        let options = {
            friction: 0,
            frictionAir: 0,
            restitution: 1,
            label: 'bass-marble',
        };
        this.body = Bodies.circle(this.x, this.y, this.r / 2, options);
        Composite.add(world, this.body);

        // Set a random velocity
        const randomVelocity = Marble.getRandomVelocity();
        Body.setVelocity(this.body, randomVelocity);
    }

    static getRandomColour() {
        const colours = ['#d2f1e4', '#fbcaef', '#acf39d', '#f2dc5d', '#ffb997', '#157a63', '#499f68', '#77b28c', '#87255b', '#7dd181', '#8075ff', '#437f97', '#ffb30f'];
        return colours[Math.floor(Math.random() * colours.length)];
    }

    static getRandomVelocity() {
        const maxSpeed = 5;
        const vx = (Math.random() - 0.5) * 2 * maxSpeed;
        const vy = (Math.random() - 0.5) * 2 * maxSpeed;
        return { x: vx, y: vy };
    }

    draw() {
        let pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        strokeWeight(1);
        stroke(255);
        fill(this.colour);
        ellipse(0, 0, this.r);
        pop();
    }

    remove() {
        Composite.remove(world, this.body);
    }
}