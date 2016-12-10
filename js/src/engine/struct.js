'use strict';

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Dimension {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    if(w !== undefined) {
      this.pos = new Position(x, y);
      this.dim = new Dimension(w, h);
    } else {
      this.pos = x;
      this.dim = y;
    }
  }
};

export { Position, Dimension, Rectangle };
