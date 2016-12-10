'use strict';

import { Engine } from '../src';
import Splash from './rooms/splash';

class Demo extends Engine {
  constructor() {
    super('#game');
  }

  start() {
    this.room.goto(Splash);
  }
}

export default Demo;
