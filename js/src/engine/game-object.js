'use strict';

import { SPRITE as INITIAL_SPRITE } from './const';
const [ENGINE, SPRITE] = [Symbol(), Symbol()];

class GameObject {
  [SPRITE] = null;

  constructor(engine) {
    this[ENGINE] = engine;
    if(this.constructor[INITIAL_SPRITE]) {
      this.sprite = this.constructor[INITIAL_SPRITE];
    }
  }
  // initialize things on being created (use instead of constructor)
  init() {}

  // run at the beginning of each room
  roomstart() {}
  // run at the beginning of the game
  gamestart() {}

  // run at the beginning of each frame
  stepstart() {}

  // react to various user inputs
  mousemove(where) {}
  keydown(which) {}
  mousedown(which) {}
  keyup(which) {}
  mouseup(which) {}

  // run once all inputs have been received
  step() {}
  // run after everything else
  stepend() {}

  // run at the end of each room
  roomend() {}
  // run at the end of the game
  gameend() {}

  // trigger an event
  proc(event) {
    this[event.type] && this[event.type](event.data);
  }

  // the current sprite for this object (if any)
  get sprite() { return this[SPRITE]; }
  set sprite(sprite) {
    if(this[SPRITE] && this[SPRITE].name === sprite) { return; }
    const {x, y} = this[SPRITE] || {x: 0, y: 0};
    this[SPRITE] = sprite ? this[ENGINE].texture.sprite(sprite) : null;
    this[SPRITE].x = x;
    this[SPRITE].y = y;
  }

  // utilities
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
