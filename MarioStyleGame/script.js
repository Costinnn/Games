const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

// IMAGES

const createImage = (imageSrc) => {
  const image = new Image();
  image.src = imageSrc;
  return image;
};

const platformImg = createImage("./images/platform.png");
const platformSTImg = createImage("./images/platformSmallTall.png");
const hillsImg = createImage("./images/hills.png");
const backgroundImg = createImage("./images/background.png");
const playerRLImg = createImage("./images/spriteRunLeft.png");
const playerRRImg = createImage("./images/spriteRunRight.png");
const playerSLImg = createImage("./images/spriteStandLeft.png");
const playerSRImg = createImage("./images/spriteStandRight.png");

// CLASSES
class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = { x: 0, y: 0 };
    this.width = 66;
    this.height = 150;

    this.frames = 0;

    this.playerImages = {
      stand: { right: playerSRImg, left: playerSLImg, width: 66, cropWidth: 177 },
      run: { right: playerRRImg, left: playerRLImg, width: 127.875, cropWidth: 341 },
    };

    this.currentPlayerImg = this.playerImages.stand.right;
    this.currentCropWidth = 177;
  }

  draw() {
    // cropping each character from the sprite image
    context.drawImage(
      this.currentPlayerImg,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;

    // standing image has 59 frames
    if (this.frames > 59 && (this.currentPlayerImg === this.playerImages.stand.right || this.currentPlayerImg === this.playerImages.stand.left)) {
      this.frames = 0;
      // running image has 29 frames
    } else if (this.frames > 29 && (this.currentPlayerImg === this.playerImages.run.right || this.currentPlayerImg === this.playerImages.run.left)) {
      this.frames = 0;
    }

    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
    //else {
    //   this.velocity.y = 0;
    // }
  }
}

class Platform {
  constructor({ x, y }, image) {
    this.position = { x, y };
    this.image = image;
    this.width = image.width;
    this.height = image.heightw;
  }

  draw() {
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y }, image) {
    this.position = { x, y };
    this.image = image;
    this.width = image.width;
    this.height = image.heightw;
  }

  draw() {
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}

// FUNCTIONS

function restartGame() {
  player = new Player();

  platforms = [
    new Platform({ x: platformImg.width * 5, y: 270 }, platformSTImg),
    new Platform({ x: -1, y: 470 }, platformImg),
    new Platform({ x: platformImg.width - 3, y: 470 }, platformImg),
    new Platform({ x: platformImg.width * 2 + 100, y: 470 }, platformImg),
    new Platform({ x: platformImg.width * 3 + 300, y: 470 }, platformImg),
    new Platform({ x: platformImg.width * 4 + 298, y: 470 }, platformImg),
    new Platform({ x: platformImg.width * 5 + 700, y: 470 }, platformImg),
  ];

  genericObjects = [new GenericObject({ x: -1, y: -1 }, backgroundImg), new GenericObject({ x: 0, y: 0 }, hillsImg)];
  scrollOffset = 0;
}

// CREATE OBJECTS
let player = new Player();
let platforms = [];
let genericObjects = [];

const keys = {
  right: { pressed: false },
  left: { pressed: false },
};
let lastKey = "";

// track player traveled distance
let scrollOffset = 0;

//  CREATE FRAMES
function animate() {
  requestAnimationFrame(animate);

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();

  // move  left/right
  if (keys.right.pressed && player.position.x < 400) {
    // move PLAYER right
    player.velocity.x = player.speed;
  } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
    // move PLAYER left
    player.velocity.x = -player.speed;
  } else {
    // move PLATFORM when player reached 100 <-> 400 px move limit
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        return (platform.position.x -= player.speed);
      });
      genericObjects.forEach((genericObject) => (genericObject.position.x -= player.speed * 0.66));
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        return (platform.position.x += player.speed);
      });
      genericObjects.forEach((genericObject) => (genericObject.position.x += player.speed * 0.66));
    }
  }

  //    platform colision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // player images switching
  if (keys.right.pressed && lastKey === "right" && player.currentPlayerImg !== player.playerImages.run.right) {
    player.currentPlayerImg = player.playerImages.run.right;
    player.currentCropWidth = player.playerImages.run.cropWidth;
    player.width = player.playerImages.run.width;
  } else if (keys.left.pressed && lastKey === "left" && player.currentPlayerImg !== player.playerImages.run.left) {
    player.currentPlayerImg = player.playerImages.run.left;
    player.currentCropWidth = player.playerImages.run.cropWidth;
    player.width = player.playerImages.run.width;
  } else if (!keys.right.pressed && lastKey === "right" && player.currentPlayerImg !== player.playerImages.stand.right) {
    player.currentPlayerImg = player.playerImages.stand.right;
    player.currentCropWidth = player.playerImages.stand.cropWidth;
    player.width = player.playerImages.stand.width;
  } else if (!keys.left.pressed && lastKey === "left" && player.currentPlayerImg !== player.playerImages.stand.left) {
    player.currentPlayerImg = player.playerImages.stand.left;
    player.currentCropWidth = player.playerImages.stand.cropWidth;
    player.width = player.playerImages.stand.width;
  }

  // winning point
  if (scrollOffset > platformImg.width * 5 + 400) {
    console.log("You won!");
  }

  //  lose condition
  if (player.position.y > canvas.height) {
    restartGame();
  }
}

restartGame();
animate();

//  KEYBOARD MOVEMENT
window.addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w": // up
      player.velocity.y -= 15;
      break;
    case "a":
      // left
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case "s":
      // down
      break;
    case "d":
      // right
      keys.right.pressed = true;
      lastKey = "right";
      break;
  }
});
window.addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      // up
      //   player.velocity.y = 0;
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
