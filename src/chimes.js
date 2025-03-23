class Chime {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        let options = {
            friction: 0,
            restitution: 1,
            isStatic: true,
            label: 'chime'
        }

        this.body = Bodies.circle(this.x, this.y, this.r / 2, options);
    }

    draw() {
        let pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        strokeWeight(1);
        stroke(255);
        fill(0);
        ellipse(0, 0, this.r);
        pop();
    }
}