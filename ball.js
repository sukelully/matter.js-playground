class Ball {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        let options = {
            friction: 0.1,
            restitution: 0.6,
            isStatic: true
        }
        this.body = Bodies.circle(this.x, this.y, this.r / 2, options);

        Composite.add(world, this.body);
    }


    show() {
        let pos = this.body.position;
        let angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(255)
        fill(127);
        ellipse(0, 0, this.r);
        pop();
    }

    remove() {
        Composite.remove(world, this.body);
    }
}