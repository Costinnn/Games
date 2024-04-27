let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "lightblue";

class Circle {
  constructor(xpos, ypos, radius, color, text, speed) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.radius = radius;
    this.color = color;
    this.text = text;
    this.speed = speed;

    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }
  draw(context) {
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = this.color;
    context.fillText(this.text, this.xpos, this.ypos);
    context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update() {
    this.draw(context);

    if (this.xpos + this.radius > window_width) {
      this.dx = -this.dx;
    }

    if (this.xpos - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.ypos + this.radius > window_height) {
      this.dy = -this.dy;
    }

    if (this.ypos - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.xpos += this.dx;
    this.ypos += this.dy;
  }
}

let getDistance = function (xpos1, ypos1, xpos2, ypos2) {
  var result = Math.sqrt(Math.pow(xpos2 - xpos1, 2) + Math.pow(ypos2 - ypos1, 2));
  return result;
};

let circle1 = new Circle(400, 400, 200, "black", "A", 0);
circle1.draw(context);

let circle2 = new Circle(100, 100, 50, "blue", "B", 1);
circle2.draw(context);

let updateCircle = () => {
  requestAnimationFrame(updateCircle);
  context.clearRect(0, 0, window_width, window_height);
  circle1.update();
  circle2.update();

  if (getDistance(circle1.xpos, circle1.ypos, circle2.xpos, circle2.ypos) < circle1.radius) {
    circle1.color = "red";
  }

  if (getDistance(circle1.xpos, circle1.ypos, circle2.xpos, circle2.ypos) >= circle1.radius) {
    circle1.color = "black";
  }
};
updateCircle();
