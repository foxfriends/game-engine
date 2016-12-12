'use strict';

import { Rectangle } from './struct';

const [PAGE, FRAMES, FRAME] = [Symbol(), Symbol(), Symbol()];

class Sprite extends Rectangle {
  constructor(page, frames) {
    super(...page.frame(frames[0]));
    this[PAGE] = page;
    this[FRAMES] = frames;
    this[FRAME] = 0;
  }

  // the current frame that this sprite is showing
  set frame(frame) { this[FRAME] = frame; }
  get frame() { return this[FRAME]; }

  // accessors for the drawing methods
  // HACK : internalize
  get texture() { return this[PAGE]; }
  get src() { return this[PAGE].frame(this[FRAMES][this[FRAME]]); }
  get dest() { return [...this]; }
}

export { Sprite };
export default Sprite;
