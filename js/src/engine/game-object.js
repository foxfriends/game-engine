'use strict';

class GameObject {
  constructor() {}

  roomstart() {}
  stepstart() {}

  mousemove(where) {}
  keydown(which) {}
  mousedown(which) {}
  keyup(which) {}
  mouseup(which) {}

  step() {}
  stepend() {}

  roomend() {}

  proc(event) {
    this[event.type](event.data);
  }
}

export { GameObject };

export default GameObject;
