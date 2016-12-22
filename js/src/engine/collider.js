'use strict';

import { Rectangle, Position } from './struct';

function Collider(bbox) {
  return function(Base = class{}) {
    return class extends Base {
      get position() {
        if(this.sprite) {
          return new Position(this.sprite.x, this.sprite.y);
        } else {
          throw `${this.constructor.name}'s position value cannot be inferred. Please implement '@override get position(): Position'`;
        }
      }
      // get the collision box for this object
      get bbox() {
        // TODO: position arithmetic??
        const pos = new Position(this.position.x + bbox.x, this.position.y + bbox.y);
        return new Rectangle(...pos, bbox.w, bbox.h);
      }
      // actually check a collision
      // HACK: internalize (?)
      collides(where) {
        return Math.abs((where.x + where.w) - (this.bbox.x + this.bbox.w)) < (where.w + this.bbox.w) / 2 &&
          Math.abs((where.y + where.h) - (this.bbox.y + this.bbox.h)) < (where.h + this.bbox.h) / 2;
      }
    };
  }
}

Object.defineProperty(Collider, Symbol.hasInstance, {
  value(instance) {
    return typeof instance.collides === 'function' &&
      instance.position instanceof Position &&
      instance.bbox instanceof Rectangle;
  }
});

export { Collider };
export default Collider;
