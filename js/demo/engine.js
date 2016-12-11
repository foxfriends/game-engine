'use strict';

import { Engine, Dimension } from '../engine';
import Splash from './rooms/splash';

class Demo extends Engine {
  constructor() {
    super('#game', new Dimension(1024, 768));
  }

  start() {
    this.room.goto(Splash);
  }
}

export default Demo;
