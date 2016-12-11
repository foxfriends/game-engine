'use strict';

const [ENGINE, ROOM] = [Symbol(), Symbol()];

class GameObject {
  constructor(room = null, engine = null) { this[ROOM] = room; this[ENGINE] = engine; }
  init() {}

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
    this[event.type]  && this[event.type](event.data);
  }

  get game() {
    return new Proxy(this[ENGINE], {
      get(target, prop) {
        if(prop === 'room') {
          return target.room;
        } else {
          return target.game[prop];
        }
      }
    });
  }
}

export { GameObject };
export default GameObject;
