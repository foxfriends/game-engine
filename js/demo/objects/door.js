'use strict';

import { Collider, GameObject, Rectangle, Position, override } from '../../engine';
import Player from './player';

const [PLAYER] = [Symbol()];

class Door extends Collider(new Rectangle(0, 0, 32, 32))(GameObject) {
  pos = new Position(0, 0);
  outpos = new Position(0, 0);
  dest = null;
  sound = null;
  [PLAYER] = null;

  @override
  init(dest, position, outpos) {
    [this[PLAYER]] = super.game.find(Player);
    this.sound = super.game.sound('door');
    this.dest = dest;
    this.pos = position;
    this.outpos = outpos;
  }

  @override
  get position() {
    return this.pos;
  }

  checkCollision() {
    const box = new Rectangle(...this.bbox);
    box.x += this.position.x;
    box.y += this.position.y;
    return super.game.collides(box, this[PLAYER]);
  }

  @override
  step() {
    if(this.checkCollision()) {
      this.sound.play();
      super.game.room.goto(this.dest);
      this[PLAYER].doorPos = this.outpos;
      super.game.destroy(this);
    }
  }
}

export default Door;
