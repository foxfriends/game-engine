'use strict';

import Drawable from './drawable';

const [OBJECTS, ENGINE] = [Symbol(), Symbol()];

class Room {
  [OBJECTS] = [];

  constructor(engine) { this[ENGINE] = engine; }

  start() {}
  proc(event) {
    for(let obj of this[OBJECTS]) {
      obj.proc(event);
    }
  }
  end() {}

  spawn(Obj, ...args) {
    const o = new Obj(this, this[ENGINE]);
    o.init(...args);
    this[OBJECTS].push(o);
    return o;
  }

  destroy(obj) {
    const i = this[OBJECTS].indexOf(o);
    if(i >= 0) {
      this[OBJECTS].splice(i, 1);
    }
  }

  draw(draw) {
    for(let obj of this[OBJECTS]) {
      obj instanceof Drawable && obj.draw(draw);
    }
  }
}

export { Room };
export default Room;
