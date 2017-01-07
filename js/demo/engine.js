'use strict';

import path from 'path';
import { Engine, Dimension, override, texturepages, tilemaps, config } from '../engine';
import Splash from './rooms/splash';
import cfg from '../../resources/config.json'; // Is this the right way to get there right now?

@config('resources', cfg)
class Demo extends Engine {
  constructor() {
    super('#game', new Dimension(1024, 768));
  }

  @override
  start() {
    this.util.room.goto(Splash);
  }
}

export default Demo;
