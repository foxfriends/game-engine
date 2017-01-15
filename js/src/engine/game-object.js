'use strict';

const [ENGINE] = [Symbol()];

class GameObject {
  constructor(engine) {
    this[ENGINE] = engine;
  }
  // initialize things on being created (use instead of constructor)
  init() {}

  // run before each room starts
  roomload(prev, next) {}
  // run at the beginning of each room
  roomstart(prev, next) {}
  // run at the beginning of the game
  gamestart() {}

  // run at the beginning of each frame
  stepstart() {}

  // react to various user inputs
  keydown(which) {}
  keyup(which) {}
  mousedown(which) {}
  mouseup(which) {}
  mousemove(where) {}

  // run once all inputs have been received
  step() {}
  // run after everything else
  stepend() {}

  // run at the end of each room
  roomend(prev, next) {}
  // run at the end of the game
  gameend() {}

  // trigger an event
  proc(event) {
    this[event.type] && this[event.type](...event.data);
  }

  // utilities
  // TODO: reduce duplication of Room#game
  get game() {
    return new Proxy(this[ENGINE], {
      get(target, prop) {
        return target.util[prop];
      }
    });
  }
}

export { GameObject };
export default GameObject;
