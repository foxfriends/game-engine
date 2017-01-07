'use strict';

import { Drawable, Collider, GameObject, override, persistent, sprite, Rectangle, Position } from '../../engine';
import PauseMenu from '../rooms/pause-menu';
import MainMenu from '../rooms/main-menu';

const SPD = 4;

@persistent
@sprite('sarah_idle_south')
class Player extends Drawable(Collider(new Rectangle(16, 32, 32, 32))(GameObject)) {
  speed = SPD;
  dir = 'south';
  hsp = 0;
  vsp = 0;
  doorPos = null;

  @override
  roomload() {
    this.speed = 0;
  }

  @override
  roomstart() {
    this.speed = SPD;
    if(this.doorPos) {
      this.sprite.x = this.doorPos.x;
      this.sprite.y = this.doorPos.y;
      this.doorPos = null;
    }
  }

  @override
  roomend(_, room) {
    if(room === MainMenu) {
      super.game.destroy(this);
    }
  }

  @override
  init() {
    this.sprite.x = 500;
    this.sprite.y = 400;
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
    while(super.game.collides(this.bbox, 'room') && this.hsp) {
      this.sprite.x -= Math.sign(this.hsp);
    }
    this.sprite.y += this.vsp;
    while(super.game.collides(this.bbox, 'room') && this.vsp) {
      this.sprite.y -= Math.sign(this.vsp);
    }
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
    super.game.view(new Position(this.sprite.x + 32, this.sprite.y + 32));
  }
}

export default Player;
