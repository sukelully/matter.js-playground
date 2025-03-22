class GridLine {
    constructor(x, y, w, h, a = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.a = a;
        this.color = 'rgba(206, 206, 206, 0.5)';
    }

    draw() {
        push();
        rotate(this.a);
        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(this.color);
        rect(this.x, this.y, this.w, this.h); 
        pop();
    }
}