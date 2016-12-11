'use strict';
import { Room } from '../../engine';
import Menu from '../objects/main-menu'

class MainMenu extends Room {
  start() {
    super.spawn(Menu);
  }
}

export default MainMenu;
