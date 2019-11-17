function Vector2(x, y) {
  var _x = x;
  var _y = y;

  function length() {
    return (_x * _x) + (_y * _y)
  }

  function normalize() {
    _x /= length();
    _y /= length();
  }

  return {
    x: _x,
    y: _y,
    length: length,
    normalize : normalize
  };
}