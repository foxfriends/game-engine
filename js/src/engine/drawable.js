'use strict';

import { SPRITE as INITIAL_SPRITE } from './const';
const [SPRITE, ENGINE] = [Symbol(), Symbol()];

function Drawable(Base = class{}) {
  return class extends Base {
    [SPRITE] = null;
    // TODO: implement some sort of internal symbol sharing to reduce duplicated symbol names
    [ENGINE] = null;
    constructor(engine) {
      super(engine);
      this[ENGINE] = engine;
      if(this.constructor[INITIAL_SPRITE]) {
        this.sprite = this.constructor[INITIAL_SPRITE];
      }
    }
    // draw this thing using a Draw (./draw.js)
    draw(draw) { draw.self(); }
    // draw relative to the screen instead of the room
    drawGUI(draw) {}

    get sprite() { return this[SPRITE]; }
    set sprite(sprite) {
      if(this[SPRITE] && this[SPRITE].name === sprite) { return; }
      const {x, y} = this[SPRITE] || {x: 0, y: 0};
      this[SPRITE] = sprite ? this[ENGINE].texture.sprite(sprite) : null;
      this[SPRITE].x = x;
      this[SPRITE].y = y;
    }
  };
}

Object.defineProperty(Drawable, Symbol.hasInstance, {
  value(instance) {
    // TODO: should this not be duck typed?
    return typeof instance.draw === 'function' && typeof instance.drawGUI === 'function';
  }
});

export { Drawable };
export default Drawable;
