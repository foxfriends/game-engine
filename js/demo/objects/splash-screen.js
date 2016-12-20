'use strict';

import { Drawable, GameObject, override, SECOND, Rectangle } from '../../engine';
import MainMenu from '../rooms/main-menu.js';

class SplashScreen extends Drawable(GameObject) {
  fade = 0;
  duration = 4 * SECOND;
  peak = 1 * SECOND;

  @override
  stepend() {
    this.fade++;
    if(this.fade >= this.duration) {
      super.game.room.goto(MainMenu);
    }
  }

  @override
  keydown() {
    this.fade = this.duration;
  }

  @override
  draw(draw) {
    draw
      .alpha(this.alpha)
      .rect(new Rectangle(25, 25, 50, 50));
  }

  get alpha() {
    const amt = Math.min(1, ((this.duration / 2) - Math.abs(this.duration / 2 - this.fade)) / this.peak);
    return Math.sin(amt * Math.PI / 2) ** 2;
  }
}

export default SplashScreen;
