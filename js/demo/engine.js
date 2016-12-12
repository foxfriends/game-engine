'use strict';

import path from 'path';
import { Engine, Dimension, override, texturepages } from '../engine';
import Splash from './rooms/splash';


@texturepages({
  'castle': path.resolve('resources', 'texture-pages', 'castle.json'),
  'sarah': path.resolve('resources', 'texture-pages', 'sarah.json')
})
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
