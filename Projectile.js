
// thuoc tinh cua vien dan
class Projectile {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
    }
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }
    // update de khi requestFrame se thay doi vi tri cua vien dan
    update() {
      this.draw();
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  }