class String {
    constructor(x, y, w, h, a = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        let options = {
            friction: 0,
            restitution: 1,
            angle: a,
            isStatic: true,
            label: 'string'
        }
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);

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
        noStroke();
        fill(0);
        rect(0, 0, this.w, this.h);
        pop();
    }

    remove() {
        Composite.remove(world, this.body);
    }
}