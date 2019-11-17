function Player(sprite, x, y, createBulletFn) {
  var _sprite = sprite
  _sprite.speed = 0;
  _sprite.velocity = Vector2(0, 0);
  _sprite.x = x;
  _sprite.y = y;
  _sprite.anchor = { x: 0.5, y: 0.5 };
  var _createBulletFn = createBulletFn;

  let max_velocity = 25;

  let left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40),
      fire = keyboard(32)

  left.down = function() {
    _sprite.angle -= 5;
  }

  right.down = function() {
    _sprite.angle += 5;
  }

  up.down = function() {
    if (_sprite.speed < 2)
      _sprite.speed += 0.25;

    updateDirection()
  }

  down.down = function() {
    if (_sprite.speed > -2)
      _sprite.speed -= 0.25;

    updateDirection()
  }

  fire.press = function() {
    // create bullets
    _createBulletFn()
  }

  function update() {

    if (_sprite.velocity.x > max_velocity) {
      _sprite.velocity.x = max_velocity;
    } else if (_sprite.velocity.x < -max_velocity) {
      _sprite.velocity.x = -max_velocity;
    }

    if (_sprite.velocity.y > max_velocity) {
      _sprite.velocity.y = max_velocity;
    } else if (_sprite.velocity.y < -max_velocity) {
      _sprite.velocity.y = -max_velocity;
    }

    _sprite.x += _sprite.velocity.x;
    _sprite.y += _sprite.velocity.y;
  }

  function updateDirection() {
    let direction = Vector2(Math.cos(_sprite.rotation), Math.sin(_sprite.rotation));
    direction.normalize();

    let new_movement = Vector2(direction.x * _sprite.speed, direction.y * _sprite.speed);

    _sprite.velocity.x += new_movement.x;
    _sprite.velocity.y += new_movement.y;
  }

  return {
    sprite: _sprite,
    update: update
  };
}