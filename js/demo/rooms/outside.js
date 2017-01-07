'use strict';

import { Room, override, texturepage, tilemap, Position, music } from '../../engine';
import Door from '../objects/door';
import Loader from '../objects/loader';
import * as Home from './home';

@texturepage('sarah')
@tilemap('outside')
@music('overworld')
class Outside extends Room {
  @override
  load() {
    super.spawn(Loader);
  }

  @override
  start() {
    this.game.music('overworld');
    super.spawn(Door, new Position(10 * 32, 8 * 32 - 16), Home.v, new Position(18 * 32 - 16, 18 * 32 - 80));
  }
};

export { Outside as v };
export default Home;
