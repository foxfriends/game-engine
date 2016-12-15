'use strict';

import path from 'path';
import { Engine, Dimension, override, texturepages, tilemaps } from '../engine';
import Splash from './rooms/splash';


@texturepages({
  'castle': path.resolve('resources', 'texture-pages', 'castle.json'),
  'sarah': path.resolve('resources', 'texture-pages', 'sarah.json'),
  'inside': path.resolve('resources', 'texture-pages', 'inside.json'),
})
@tilemaps({
  'home': path.resolve('resources', 'tile-maps', 'home.json')
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
