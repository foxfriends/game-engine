'use strict';

import { GameObject, SECOND } from '../../src';
import MainMenu from '../rooms/main-menu.js';
import Demo from '../engine.js';

class SplashScreen extends GameObject {
  fade = 0;
  duration = 4 * SECOND;
  peak = 1 * SECOND;

  stepend() {
    fade++;
    if(fade === duration) {
      Demo.room.goto(MainMenu);
    }
  }

  draw(draw) {
    const amt = Math.min(1, ((duration / 2) - Math.abs(duration / 2 - fade)) / peak);
    draw
      .alpha(Math.sin(amt *  Math.PI) ** 2)
      .sprite(sprite);
  }
}

export default SplashScreen;
