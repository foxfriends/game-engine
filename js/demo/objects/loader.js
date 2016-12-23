'use strict';

import { GameObject, Drawable, override, Position } from '../../engine';
import Player from './player';

class Loader extends Drawable(GameObject) {
  @override
  draw(draw) {
    const view = super.game.view();
    draw
      .color(0x000000)
      .rect(view)
      .halign('right')
      .valign('bottom')
      .color(0xffffff)
      .text("Loading...", new Position(view.x + view.w - 16, view.y + view.h - 16))
      .halign('left')
      .valign('top');
  }

  @override
  roomstart(_, next) {
    super.game.destroy(this);
  }
}

export default Loader;
