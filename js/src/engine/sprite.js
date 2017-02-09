'use strict';

import { Rectangle, Position } from './struct';

const [PAGE, FRAMES, FRAME] = [Symbol(), Symbol(), Symbol()];

class Sprite extends Rectangle {
  constructor(page, frames, name) {
    super(...page.frame(frames[0]));
    this.name = name;
    this[PAGE] = page;
    this[FRAMES] = frames;
    this[FRAME] = 0;
  }

  // the current frame that this sprite is showing
  set frame(frame) {
    this[FRAME] = frame;
    if(this[FRAME] >= this[FRAMES].length) {
      this[FRAME] -= this[FRAMES].length;
    } else if(this[FRAME] < 0) {
      this[FRAME] += this[FRAMES].length;
    }
  }
  get frame() { return this[FRAME]; }

  // accessors for the drawing methods and for custom surface drawing
  get texture() { return this[PAGE]; }
  get src() { return this[PAGE].frame(this[FRAMES][Math.floor(this[FRAME])]); }
  get dest() { return [...this]; }

  get position() {
    return new Position(this.x, this.y);
  }
  set position(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }
}

export { Sprite };
export default Sprite;
