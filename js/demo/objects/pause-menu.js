'use strict';
import { Drawable, GameObject, override } from '../../engine';
import Menu from './menu';
import MainMenu from '../rooms/main-menu';

class PauseMenu extends Menu {
  @override
  init() {
    this.opts = {
      ['Resume']: () => {
        super.game.room.close();
      },
      ['Main Menu']: () => {
        super.game.room.close();
        super.game.room.goto(MainMenu);
      }
    };
  }
}

export default PauseMenu;
