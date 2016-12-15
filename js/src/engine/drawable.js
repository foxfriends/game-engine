'use strict';

function Drawable(Base = class{}) {
  return class extends Base {
    // draw this thing using a Draw (./draw.js)
    draw(draw) { draw.self(); }
  };
}

Object.defineProperty(Drawable, Symbol.hasInstance, {
  value(instance) {
    return typeof instance.draw === 'function';
  }
});

export { Drawable };
export default Drawable;
