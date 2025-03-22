class GridLine {
    constructor(x, y, w, h, a = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.a = a;
    }

    draw() {
        push();
        rotate(this.a);
        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(150);
        rect(0, 0, this.w, this.h);
    }
}