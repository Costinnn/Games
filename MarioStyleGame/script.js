const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = { x: 0, y: 0 };
    this.width = 30;
    this.height = 30;
  }

  draw() {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

class Platform {
  constructor({ x, y }, width, height) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
  }

  draw() {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player1 = new Player();
const platforms = [new Platform({ x: 200, y: 800 }, 100, 20), new Platform({ x: 500, y: 800 }, 50, 20)];

const keys = {
  right: { pressed: false },
  left: { pressed: false },
};

//  CREATE FRAMES
function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player1.update();
  platforms.forEach((platform) => {
    return platform.draw();
  });

  // move  left/right
  if (keys.right.pressed && player1.position.x < 400) {
    player1.velocity.x = 5;
  } else if (keys.left.pressed && player1.position.x > 100) {
    player1.velocity.x = -5;
  } else {
    player1.velocity.x = 0;
    if (keys.right.pressed) {
      platforms.forEach((platform) => {
        return (platform.position.x -= 5);
      });
    } else if (keys.left.pressed) {
      platforms.forEach((platform) => {
        return (platform.position.x += 5);
      });
    }
  }

  //    platform colision detection
  platforms.forEach((platform) => {
    if (
      player1.position.y + player1.height <= platform.position.y &&
      player1.position.y + player1.height + player1.velocity.y >= platform.position.y &&
      player1.position.x + player1.width >= platform.position.x &&
      player1.position.x <= platform.position.x + platform.width
    ) {
      player1.velocity.y = 0;
    }
  });
}
animate();

//  KEYBOARD MOVEMENT
window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w": // up
      player1.velocity.y -= 20;
      break;
    case "a":
      // left
      keys.left.pressed = true;
      break;
    case "s":
      // down
      break;
    case "d":
      // right
      keys.right.pressed = true;
      break;
  }
});
window.addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      // up
      //   player1.velocity.y = 0;
      break;
    case "a":
      // left
      keys.left.pressed = false;
      break;
    case "s":
      // down
      break;
    case "d":
      // right
      keys.right.pressed = false;
      break;
  }
});
