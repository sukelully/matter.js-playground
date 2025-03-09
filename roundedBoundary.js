class RoundedBoundary {
    constructor(x, y, w, h, radius) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.radius = radius;
      
      // Create the physical boundaries (straight edges)
      this.top = Bodies.rectangle(x, y - h / 2, w, 20, { isStatic: true });
      this.bottom = Bodies.rectangle(x, y + h / 2, w, 20, { isStatic: true });
      this.left = Bodies.rectangle(x - w / 2, y, 20, h, { isStatic: true });
      this.right = Bodies.rectangle(x + w / 2, y, 20, h, { isStatic: true });
      
      // Create the rounded corners as arcs (for visual representation)
      this.topLeft = Bodies.circle(x - w / 2 + radius, y - h / 2 + radius, radius, { isStatic: true });
      this.topRight = Bodies.circle(x + w / 2 - radius, y - h / 2 + radius, radius, { isStatic: true });
      this.bottomLeft = Bodies.circle(x - w / 2 + radius, y + h / 2 - radius, radius, { isStatic: true });
      this.bottomRight = Bodies.circle(x + w / 2 - radius, y + h / 2 - radius, radius, { isStatic: true });
  
      // Add all boundaries to the world
      World.add(world, [this.top, this.bottom, this.left, this.right, this.topLeft, this.topRight, this.bottomLeft, this.bottomRight]);
    }
    
    show() {
      fill(255);
      noStroke();
      // Draw the rectangles
      rectMode(CENTER);
      rect(this.x, this.y - this.h / 2, this.w, 20); // Top
      rect(this.x, this.y + this.h / 2, this.w, 20); // Bottom
      rect(this.x - this.w / 2, this.y, 20, this.h); // Left
      rect(this.x + this.w / 2, this.y, 20, this.h); // Right
      
      // Draw the circles (rounded corners)
      ellipse(this.x - this.w / 2 + this.radius, this.y - this.h / 2 + this.radius, this.radius * 2);
      ellipse(this.x + this.w / 2 - this.radius, this.y - this.h / 2 + this.radius, this.radius * 2);
      ellipse(this.x - this.w / 2 + this.radius, this.y + this.h / 2 - this.radius, this.radius * 2);
      ellipse(this.x + this.w / 2 - this.radius, this.y + this.h / 2 - this.radius, this.radius * 2);
    }
  }
  