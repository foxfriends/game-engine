'use strict';

function Drawable(Base) {
  return class extends Base {
    draw() {}
  };
}

Object.defineProperty(Drawable, Symbol.hasInstance, {
  value: (instance) => {
    return typeof instance.draw === 'function';
  }
});

export { Drawable };
export default Drawable;
