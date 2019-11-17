let type = "WebGL"
if ( !PIXI.utils.isWebGLSupported() ) {
  type = "canvas"
}

let app;

window.onload = function() {
  app = new PIXI.Application({width: 1024 , height: 1024});
  document.body.appendChild(app.view)

  PIXI.loader.add('ship', 'assets/images/spr_ship.png')
    .add('asteroid_huge', 'assets/images/spr_asteroid_huge.png')
    .add('asteroid_med', 'assets/images/spr_asteroid_med.png')
    .add('asteroid_small', 'assets/images/spr_asteroid_small.png')
    .add('bullet', 'assets/images/spr_bullet.png')
    .load(setup)
}

let state;
let gameScene;
let gameOverScene;
let player;
let initialAsteroidCount = 3;
let asteroids = [];
let bullets = [];

function setup(loader, resources) {
  state = play
  app.ticker.add(delta => gameLoop(delta))

  gameScene = new PIXI.Container();
  app.stage.addChild(gameScene);

  gameOverScene = new PIXI.Container();
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;


  setupPlayer(gameScene);
  setupAsteroids(gameScene);
}

function setupPlayer(scene) {
  let sprite = new PIXI.Sprite(PIXI.loader.resources["ship"].texture);
  player = Player(sprite, (app.view.width / 2) - (sprite.width / 2), (app.view.height / 2) - (sprite.height / 2),
    playerFire);
  scene.addChild(player.sprite);
}

function setupAsteroids(scene) {
  for (let i = 0; i < initialAsteroidCount; ++i) {
    let x = Math.random() * app.view.width;
    let y = Math.random() * app.view.height;
    createAsteroid(scene, asteroidType.BIG, x, y);
  }
}

function createAsteroid(scene, type, x, y) {
  let res = ""
  let speed = 0
  switch (type) {
    case asteroidType.BIG:
      res = "asteroid_huge"
      speed = 0.1
      break;

    case asteroidType.MED:
      res = "asteroid_med"
      speed = 0.5
      break;

    case asteroidType.SMALL:
      res = "asteroid_small"
      speed = 1
      break;
  }

  let sprite = new PIXI.Sprite(PIXI.loader.resources[res].texture);
  let asteroid = Asteroid(sprite, x, y, type, speed);
  asteroid.init();
  scene.addChild(asteroid.sprite);
  asteroids.push(asteroid);
}

function playerFire() {
  let sprite = new PIXI.Sprite(PIXI.loader.resources["bullet"].texture)
  let x = player.sprite.x
  let y = player.sprite.y
  let bullet = Bullet(sprite, x, y, player.sprite.angle);
  bullet.init();

  bullets.push(bullet);
  gameScene.addChild(bullet.sprite);
}

function gameLoop(delta) {
  state(delta)
}

function contain(sprite, container) {
  let collision = undefined;

  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  return collision;
}

function play(delta) {
  updatePlayer()
  updateAsteroids()
  updateBullets();
}

function updatePlayer() {
  player.update();
  contain(player)
}

function updateAsteroids() {
  for (let i = 0; i < asteroids.length; ++i) {
    asteroids[i].update();
    contain(asteroids[i])
  }
}

function updateBullets() {
  // remove when leave stage
  for (let i = 0; i < bullets.length; ++i) {
    bullets[i].update()

    if (bullets[i].x > app.view.width || bullets[i].x < 0) {
      gameScene.removeChild(bullets[i].sprite)
      bullets.splice(i, 1)
      i--;
    } else if (bullets[i].y > app.view.height || bullets[i].y < 0) {
      gameScene.removeChild(bullets[i].sprite)
      bullets.splice(i, 1)
      i--;
    } else {
      for (let j = 0; j < asteroids.length; ++j) {
        if (hitTestRectangle(bullets[i].sprite, asteroids[j].sprite)) {
          gameScene.removeChild(bullets[i].sprite)
          bullets.splice(i, 1)
          i--;

          asteroidHit(asteroids[j]);
          gameScene.removeChild(asteroids[j].sprite)
        }
      }
    }
  }
}

function asteroidHit(asteroid) {
  if (asteroid.type == asteroidType.BIG) {
    createAsteroid(gameScene, asteroidType.MED, asteroid.sprite.x, asteroid.sprite.y);
    createAsteroid(gameScene, asteroidType.MED, asteroid.sprite.x, asteroid.sprite.y);
  } else if (asteroid.type == asteroidType.MED) {
    createAsteroid(gameScene, asteroidType.SMALL, asteroid.sprite.x, asteroid.sprite.y);
    createAsteroid(gameScene, asteroidType.SMALL, asteroid.sprite.x, asteroid.sprite.y);
  }
}

function contain(obj) {
  if (obj.sprite.x + obj.sprite.width > app.view.width) {
    obj.sprite.x = 0;
  } else if (obj.sprite.x < 0) {
    obj.sprite.x = app.view.width - obj.sprite.width;
  }

  if (obj.sprite.y + obj.sprite.height > app.view.height) {
    obj.sprite.y = 0;
  } else if (obj.sprite.y < 0) {
    obj.sprite.y = app.view.height - obj.sprite.height;
  }
}

function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  //hit will determine whether there's a collision
  hit = false;
  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;
  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;
  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }
  //`hit` will be either `true` or `false`
  return hit;
};
