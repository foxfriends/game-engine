'use strict';
import { Drawable, GameObject, override } from '../../engine';
import Home from '../rooms/home';
import Menu from './menu';

class MainMenu extends Menu {
  @override
  init() {
    this.opts = {
      ['New game']: () => {
        super.game.room.goto(Home);
      },
      ['Continue']: () => {
        super.game.restart();
      }
    };
  }
}

export default MainMenu;
