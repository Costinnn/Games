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
function spawnEnemies(spawnCount) {
  for (let i = 1; i <= spawnCount; i++) {
    const xOffset = i * 150;
    enemies.push(new Enemy({ position: { x: waypoints[0].x - xOffset, y: waypoints[0].y } }));
  }
}

const buildings = [];
let activeTile = undefined;
let enemyWaveCount = 3;
let hearts = 10;
let coins = 100;
const explosions = [];
spawnEnemies(enemyWaveCount);

//  FRAMES
function animate() {
  const animationId = requestAnimationFrame(animate);
  c.drawImage(mapImg, 0, 0);

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();

    // eliminate enemy when arrived at the end of the map
    if (enemy.position.x > canvas.width) {
      hearts -= 1;
      enemies.splice(i, 1);
      document.getElementById("hearts").innerHTML = hearts;

      // GAME OVER
      if (hearts <= 0) {
        window.cancelAnimationFrame(animationId);
        document.querySelector(".gameover").style.display = "flex";
      }
    }
  }

  //  render explosions
  for (let i = explosions.length - 1; i >= 0; i--) {
    const explosion = explosions[i];
    explosion.draw();
    explosion.update();

    if (explosion.frames.current >= explosion.frames.max - 1) {
      explosions.splice(i, 1);
    }
  }

  // track total amount of enemies and respawn
  if (enemies.length === 0) {
    enemyWaveCount += 2;
    spawnEnemies(enemyWaveCount);
  }

  placementTiles.forEach((tile) => tile.update(mouse));

  buildings.forEach((building) => {
    building.update();
    building.target = null;

    // check if enemy is in tower fire range
    const validEnemies = enemies.filter((enemy) => {
      const xDifference = enemy.center.x - building.center.x;
      const yDifference = enemy.center.y - building.center.y;
      const distance = Math.hypot(xDifference, yDifference);
      return distance < enemy.radius + building.radius;
    });
    building.target = validEnemies[0];

    //  projectile logic
    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];
      projectile.update();

      const xDifference = projectile.enemy.center.x - projectile.position.x;
      const yDifference = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(xDifference, yDifference);

      // check if projectile collided with the enemy
      if (distance < projectile.enemy.radius + projectile.radius) {
        // create damage to enemy
        projectile.enemy.health -= 20;

        //remove enemy
        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });

          if (enemyIndex > -1) {
            coins += 25;
            document.getElementById("coins").innerHTML = coins;
            enemies.splice(enemyIndex, 1);
          }
        }

        // delete projectile
        explosions.push(
          new Sprite({
            position: { x: projectile.position.x, y: projectile.position.y },
            imageSrc: "images/explosion.png",
            frames: { max: 4 },
            offset: { x: 0, y: 0 },
          })
        );
        building.projectiles.splice(i, 1);
      }
    }
  });
}

// EVENTS
const mouse = { x: undefined, y: undefined };

canvas.addEventListener("click", (event) => {
  if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
    coins -= 50;
    document.getElementById("coins").innerHTML = coins;
    buildings.push(new Building({ position: { x: activeTile.position.x, y: activeTile.position.y } }));
    // this work because active tile is a reference to placementTiles
    activeTile.isOccupied = true;

    // sort towers so they don't overlap on the map
    buildings.sort((a, b) => {
      return a.position.y - b.position.y;
    });
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
