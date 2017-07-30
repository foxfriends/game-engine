'use strict';
import { Drawable, GameObject, override } from '../../engine';

class Menu extends Drawable(GameObject) {
  opts = {};
  cur = 0;

  @override
  keydown(which) {
    switch(which) {
      case 'Enter':
        this.opts[Object.keys(this.opts)[this.cur]].call(this);
        break;
      case 'ArrowDown':
        this.cur = (this.cur + 1) % Object.keys(this.opts).length;
        break;
      case 'ArrowUp':
        this.cur = (this.cur - 1 + Object.keys(this.opts).length) % Object.keys(this.opts).length;
        break;
    }
  }

  @override
  drawGUI(draw) {
    Object.keys(this.opts).forEach((opt, i) => {
      draw
        .alpha(1)
        .color(i === this.cur ? 0xFF0000 : 0)
        .text(opt, [64, 128 + 32 * i]);
    });
  }
}

export default Menu;
