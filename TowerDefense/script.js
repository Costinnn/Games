const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 768;
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

// create position where towers can be put
const placementTilesData2D = [];
for (let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20));
}

const placementTiles = [];
placementTilesData2D.forEach((row, yIdx) => {
  row.forEach((symbol, xIdx) => {
    if (symbol === 14) {
      // add building placement tile/create position for each tile
      placementTiles.push(new PlacementTile({ position: { x: xIdx * 64, y: yIdx * 64 } }));
    }
  });
});

// IMAGES
const createImage = (imgSrc) => {
  const img = new Image();
  img.src = imgSrc;
  return img;
};

mapImg = createImage("./images/map.png");

// OBJECTS

const enemies = [];
for (let i = 1; i < 10; i++) {
  const xOffset = i * 150;
  enemies.push(new Enemy({ position: { x: waypoints[0].x - xOffset, y: waypoints[0].y } }));
}

const buildings = [];
let activeTile = undefined;

//  FRAMES
function animate() {
  requestAnimationFrame(animate);
  c.drawImage(mapImg, 0, 0);

  enemies.forEach((enemy) => enemy.update());

  placementTiles.forEach((tile) => tile.update(mouse));

  buildings.forEach((building) => {
    building.update();
    building.target = null;

    const validEnemies = enemies.filter((enemy) => {
      const xDifference = enemy.center.x - building.center.x;
      const yDifference = enemy.center.y - building.center.y;
      const distance = Math.hypot(xDifference, yDifference);
      return distance < enemy.radius + building.radius;
    });

    building.target = validEnemies[0];

    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];
      projectile.update();

      const xDifference = projectile.enemy.center.x - projectile.position.x;
      const yDifference = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(xDifference, yDifference);
      if (distance < projectile.enemy.radius + projectile.radius) {
        building.projectiles.splice(i, 1);
      }
    }
  });
}

// EVENTS
const mouse = { x: undefined, y: undefined };

canvas.addEventListener("click", (event) => {
  if (activeTile && !activeTile.isOccupied) {
    buildings.push(new Building({ position: { x: activeTile.position.x, y: activeTile.position.y } }));
    // this work because active tile is a reference to placementTiles
    activeTile.isOccupied = true;
  }
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  activeTile = null;

  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (mouse.x > tile.position.x && mouse.x < tile.position.x + tile.size && mouse.y > tile.position.y && mouse.y < tile.position.y + tile.size) {
      activeTile = tile;
      break;
    }
  }
});

// TRIGGER
animate();
