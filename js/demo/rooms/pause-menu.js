'use strict';

import { Room, override } from '../../engine';
import Menu from '../objects/pause-menu';

class PauseMenu extends Room {
  @override
  start() {
    super.spawn(Menu);
  }
}

export default PauseMenu;
