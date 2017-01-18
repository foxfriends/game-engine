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
        return bbox;
      }
      // actually for check a collision
      collides(where) {
        return Math.abs((where.x + where.w / 2) - (this.bbox.x + this.position.x + this.bbox.w / 2)) < (where.w + this.bbox.w) / 2 &&
          Math.abs((where.y + where.h / 2) - (this.bbox.y + this.position.y + this.bbox.h / 2)) < (where.h + this.bbox.h) / 2;
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
