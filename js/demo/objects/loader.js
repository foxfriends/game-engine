'use strict';

import { GameObject, Drawable, override, Position, Rectangle } from '../../engine';
import Player from './player';

class Loader extends Drawable(GameObject) {
  @override
  drawGUI(draw) {
    const view = super.game.view();
    draw
      .color(0x000000)
      .rect(new Rectangle(0, 0, ...super.game.size))
      .halign('right')
      .valign('bottom')
      .color(0xffffff)
      .text("Loading...", new Position(view.w - 16, view.h - 16))
      .halign('left')
      .valign('top');
  }

  @override
  roomstart(_, next) {
    super.game.destroy(this);
  }
}

export default Loader;
