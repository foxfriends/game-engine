'use strict';

class Room {
  objects = [];

  constructor() {}

  start() {}
  proc(event) {
    for(let obj of objects) {
      obj.proc(event);
    }
  }
  end() {}

  spawn(Obj, ...args) {
    const o = new Obj(...args);
    objects.push(o);
    return o;
  }

  destroy(obj) {
    const i = objects.indexOf(o);
    if(i >= 0) {
      objects.splice(i, 1);
    }
  }
}

export { Room };
export default Room;
