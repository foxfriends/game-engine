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

  static sub(l, r) {
    return new Position(l.x - r.x, l.y - r.y);
  }

  static equal(l, r) {
    return l.x === r.x && l.y === r.y;
  }

  static inside(p, o) {
    switch(o.constructor) {
      case Rectangle:
        return Rectangle.intersects(o, new Rectangle(...p, 0, 0));
      case Circle:
        return Circle.intersects(o, new Circle(...p, 0));
    }
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

  static extend(l, r) {
    return new Dimension(l.w + r.w, l.h + r.h);
  }

  static equal(l, r) {
    return l.w === r.w && l.h === r.h;
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

  static extend(rect, amt) {
    return new Rectangle(rect.x, rect.y, rect.w + amt.w, rect.h + amt.h);
  }

  static equal(l, r) {
    return l.x === r.x && l.y === r.y && l.w === r.w && l.h === r.h;
  }

  static intersects(r, o) {
    switch(o.constructor) {
      case Rectangle:
        return Math.abs((o.x + o.w / 2) - (r.x + r.w / 2)) < (o.w + r.w) / 2 &&
          Math.abs((o.y + o.h / 2) - (r.y + r.h / 2)) < (o.h + r.h) / 2;
      case Circle:
        return Circle.intersects(o, r);
    }
    throw "Rectangle.intersects: Non-shape given";
  }

  *[Symbol.iterator] () { yield* [this.x, this.y, this.w, this.h]; }
}

class Circle {
  constructor(x, y, r) {
    if(r === undefined) {
      r = y;
      [x, y] = x;
    }
    this.x = x;
    this.y = y;
    this.r = r;
  }

  static shift(circle, amt) {
    return new Circle(circle.x + amt.x, circle.y + amt.y, circle.r);
  }

  static equal(l, r) {
    return l.x === r.x && l.y === r.y && l.r === r.r;
  }

  static intersects(r, o) {
    switch(o.constructor) {
      case Rectangle:
        const [dx, dy] = [
          Math.abs(r.x - (o.x + o.w / 2)),
          Math.abs(r.y - (o.y + o.h / 2))
        ];
        if (dx > o.w / 2 + r.r) { return false; }
        if (dy > o.h / 2 + r.r) { return false; }
        if (dx <= o.w / 2) { return true; }
        if (dy <= o.h / 2) { return true; }
        const c = (dx - o.w / 2) ** 2 + (dy - o.h / 2) ** 2;
        return c <= r.r ** 2;
      case Circle:
        return (r.x - o.x) ** 2 + (r.y - o.y) ** 2 <= (r.r + o.r) ** 2;
    }
    throw "Circle.intersects: Non-shape given";
  }

  *[Symbol.iterator] () { yield* [this.x, this.y, this.r]; }
}

export { Position, Dimension, Rectangle, Circle };
