'use strict';

import { Room } from '../../engine';
import Player from '../objects/player';
import { texturepage } from '../../engine';

@texturepage('house')
class Home extends Room {
  start() {
    super.spawn(Player);
  }
};

export default Home;
