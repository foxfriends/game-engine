'use strict';

import { Room, override, texturepage, tilemap, Position, music, sound } from '../../engine';
import Player from '../objects/player';
import Door from '../objects/door';
import Loader from '../objects/loader';
import * as Outside from './outside';

@texturepage('sarah')
@tilemap('home')
@music('overworld')
@sound('door')
class Home extends Room {
  @override
  load() {
    super.spawn(Loader);
  }

  @override
  start() {
    this.game.music('overworld');
    if(!super.find(Player).length) {
      super.spawn(Player);
    }
    super.spawn(Door, Outside.v, new Position(18 * 32, 18 * 32 - 16), new Position(10 * 32 - 16, 8 * 32 - 16));
  }
};

export { Home as v };
export default Home;
