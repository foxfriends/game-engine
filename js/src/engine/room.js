'use strict';

import Drawable from './drawable';
import { PERSISTENT, PAGES } from './const';

const [OBJECTS, ENGINE, LOADED] = [Symbol(), Symbol(), Symbol()];

class Room {
  [OBJECTS] = [];
  [LOADED] = new Promise(() => {});


  constructor(engine) {
    this[ENGINE] = engine;
    this[LOADED] = (async () => {
      await this[ENGINE].texture.load(this.constructor[PAGES] || []);
      this[ENGINE].texture.purge();
    })();
  }

  // resolves when all required resources for the room have loaded
  // HACK : internalize
  get loaded() {
    return this[LOADED];
  }

  // run when the room starts loading
  load() {}
  // run at the start of the room (after loading)
  start() {}
  // trigger an event for each object in the room
  // HACK : internalize
  proc(event) {
    for(let obj of this[OBJECTS]) {
      obj.proc(event);
    }
  }
  // run at the end of the room
  end() {}

  // create an object in this room
  spawn(Obj, ...args) {
    if(Obj[PERSISTENT]) { return this[ENGINE].spawn(Obj, ...args); }
    const o = new Obj(this[ENGINE]);
    o.init(...args);
    this[OBJECTS].push(o);
    return o;
  }

  // destroy an object in this room
  destroy(obj) {
    const i = this[OBJECTS].indexOf(o);
    if(i >= 0) {
      this[OBJECTS].splice(i, 1);
    } else {
      this[ENGINE].destroy(obj);
    }
  }

  // draw this room
  // HACK : internalize
  draw(draw) {
    for(let obj of this[OBJECTS]) {
      obj instanceof Drawable && obj.draw(draw);
    }
  }
}

export { Room };
export default Room;
