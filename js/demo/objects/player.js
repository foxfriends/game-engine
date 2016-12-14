'use strict';

import { Drawable, GameObject, override, persistent, sprite } from '../../engine';
import PauseMenu from '../rooms/pause-menu';
import MainMenu from '../rooms/main-menu';

@persistent
@sprite('sarah_idle_south')
class Player extends Drawable(GameObject) {
  speed = 4;
  dir = 'south';

  @override
  roomend(_, room) {
    if(room === MainMenu) {
      super.game.destroy(this);
    }
  }

  @override
  init() {
    this.sprite.x = 0;
    this.sprite.y = 0;
  }

  @override
  keydown(which) {
    if(which === 'p') {
      super.game.room.overlay(PauseMenu);
    }
  }

  @override
  step() {
    this.hsp = this.speed * (super.game.keystate('ArrowRight') - super.game.keystate('ArrowLeft'));
    this.vsp = this.speed * (super.game.keystate('ArrowDown') - super.game.keystate('ArrowUp'));
  }

  @override
  stepend() {
    this.sprite.x += this.hsp;
    this.sprite.y += this.vsp;
    if(this.hsp !== 0 || this.vsp !== 0) {
      if(this.hsp !== 0) {
        this.dir = this.hsp > 0 ? 'east' : 'west';
      } else if(this.vsp != 0) {
        this.dir = this.vsp > 0 ? 'south' : 'north';
      }
      this.sprite = `sarah_walk_${this.dir}`;
      this.sprite.frame += 0.2;
    } else {
      this.sprite = `sarah_idle_${this.dir}`;
    }
  }
}

export default Player;
