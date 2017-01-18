'use strict';

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  *[Symbol.iterator] () { yield* [this.x, this.y]; }

  static add(l, r) {
    return new Position(l.x + r.x, l.y + r.y);
  }
}

class Dimension {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }

  static infinite() {
    return new Dimension(Infinity, Infinity);
  }

  *[Symbol.iterator] () { yield* [this.w, this.h]; }
}

class Rectangle {
  constructor(x, y, w, h) {
    if(w === undefined) {
      [w, h] = y;
      [x, y] = x;
    }
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  static shift(rect, amt) {
    return new Rectangle(rect.x + amt.x, rect.y + amt.y, rect.w, rect.h);
  }
  *[Symbol.iterator] () { yield* [this.x, this.y, this.w, this.h]; }
};

export { Position, Dimension, Rectangle };
