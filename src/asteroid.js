const asteroidType = {
  BIG: "BIG",
  MED: "MED",
  SMALL: "SMALL"
};


function Asteroid(sprite, x, y, type, speed) {
  var _sprite = sprite
  _sprite.speed = speed;
  _sprite.velocity = Vector2(0, 0);
  _sprite.x = x;
  _sprite.y = y;
  _sprite.anchor = { x: 0.5, y: 0.5 };

  _type = type;

  let max_velocity = 25;

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

  function init() {
    _sprite.angle = Math.floor(Math.random() * 360);
    let direction = Vector2(Math.cos(_sprite.rotation), Math.sin(_sprite.rotation));
    direction.normalize();

    let new_movement = Vector2(direction.x * _sprite.speed, direction.y * _sprite.speed);

    _sprite.velocity.x += new_movement.x;
    _sprite.velocity.y += new_movement.y;
  }

  return {
    sprite: _sprite,
    init: init,
    update: update,
    type: type
  };
}