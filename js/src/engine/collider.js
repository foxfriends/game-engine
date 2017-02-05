'use strict';

import { Rectangle, Circle, Position } from './struct';

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
        return this.bbox.constructor.intersects(this.bbox.constructor.shift(this.bbox, this.position), where);
      }
    };
  }
}

Object.defineProperty(Collider, Symbol.hasInstance, {
  value(instance) {
    return typeof instance.collides === 'function' &&
      instance.position instanceof Position &&
      (instance.bbox instanceof Rectangle || instance.bbox instanceof Circle);
  }
});

export { Collider };
export default Collider;
