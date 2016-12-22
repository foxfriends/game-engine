'use strict';

import { Room, texturepage, tilemap, Position } from '../../engine';
import Player from '../objects/player';
import Door from '../objects/door';
import * as Outside from './outside';

@texturepage('sarah')
@tilemap('home')
class Home extends Room {
  start() {
    if(!super.find(Player).length) {
      super.spawn(Player);
    }
    super.spawn(Door, new Position(18 * 32, 18 * 32 - 16), Outside.v, new Position(10 * 32 - 16, 8 * 32 - 16));
  }
};

export { Home as v };
export default Home;
