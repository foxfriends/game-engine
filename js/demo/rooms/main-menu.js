'use strict';
import { Room, override } from '../../engine';
import Menu from '../objects/main-menu'

class MainMenu extends Room {
  @override
  start() {
    super.spawn(Menu);
  }
}

export default MainMenu;
