'use strict';

import { Collider, GameObject, Rectangle, Position, override } from '../../engine';
import Player from './player';

const [PLAYER] = [Symbol()];

class Door extends Collider(new Rectangle(0, 0, 32, 32))(GameObject) {
  pos = new Position(0, 0);
  outpos = new Position(0, 0);
  dest = null;
  [PLAYER] = null;

  @override
  init(position, dest, outpos) {
    [this[PLAYER]] = super.game.find(Player);
    this.pos = position;
    this.outpos = outpos;
    this.dest = dest;
  }

  @override
  get position() {
    return this.pos;
  }

  @override
  step() {
    if(super.game.collides(this.bbox, this[PLAYER])) {
      this[PLAYER].sprite.x = this.outpos.x;
      this[PLAYER].sprite.y = this.outpos.y;
      super.game.room.goto(this.dest);
    }
  }
}

export default Door;
