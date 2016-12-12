'use strict';

import { Rectangle } from './struct';

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

  // accessors for the drawing methods
  // HACK : internalize
  get texture() { return this[PAGE]; }
  get src() { return this[PAGE].frame(this[FRAMES][Math.floor(this[FRAME])]); }
  get dest() { return [...this]; }
}

export { Sprite };
export default Sprite;
