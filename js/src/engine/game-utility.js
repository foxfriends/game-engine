'use strict';

import { Position, Rectangle } from './struct';

import Collider from './collider';
import GameEvent from './game-event';
import Room from './room';

import { ROOMS, OBJECTS, RAF, INPUT, SOUND_MANAGER, VIEWS, PROC } from './const';

const [ ENGINE ] = [ Symbol() ];

class GameUtility {
  [ENGINE] = null;

  constructor(engine) {
    this[ENGINE] = engine
  }
  // get/set the view port, optionally constrained within the room
  // boundaries if possible, and with the entire room centred if not
  view(view, constrain = true) {
    if(view === undefined) {
      return this[ENGINE][VIEWS][0];
    }
    if(view instanceof Position) {
      view = new Rectangle(view.x - this[ENGINE][VIEWS][0].w / 2, view.y - this[ENGINE][VIEWS][0].h / 2, this[ENGINE][VIEWS][0].w, this[ENGINE][VIEWS][0].h);
    }
    if(constrain) {
      const { w, h } = this[ENGINE][ROOMS][0].size;
      const [ r, b ] = [
        view.x + view.w,
        view.y + view.h
      ];
      if(view.w > w) {
        view.x = (w - view.w) / 2;
      } else if(view.x < 0) {
        view.x = 0;
      } else if(r > w) {
        view.x = w - view.w;
      }
      if(view.h > h) {
        view.y = (h - view.h) / 2;
      } else if(view.y < 0) {
        view.y = 0;
      } else if(b > h) {
        view.y = h - view.h;
      }
    }
    this[ENGINE][VIEWS][0] = new Rectangle(...view);
  }

  get room() {
    return {
      // go to the given room
      goto: (Rm) => {
        let old = null;
        if(this[ENGINE][ROOMS][0]) {
          old = this[ENGINE][ROOMS][0].constructor;
          this[ENGINE][PROC](new GameEvent('roomend', old, Rm));
          this[ENGINE][ROOMS][0].end();
        }
        this[ENGINE][ROOMS].unshift(new Rm(this[ENGINE]));
        this[ENGINE][OBJECTS].splice(1, 1, []);
        this[ENGINE][VIEWS].unshift(new Rectangle(0, 0, ...this[ENGINE].size));
        if(!(this[ENGINE][ROOMS][0] instanceof Room)) {
          throw `${this[ENGINE][ROOMS][0].constructor.name} is not a Room`;
        }
        (async () => {
          this[ENGINE][ROOMS][0].load();
          this[ENGINE][PROC](new GameEvent('roomload', old, Rm));
          await this[ENGINE][ROOMS][0].loaded;
          // remove the old room, which was temporarily shifted
          if(this[ENGINE][ROOMS][1]) {
            this[ENGINE][ROOMS].splice(1, 1)[0].destructor();
            this[ENGINE][OBJECTS].splice(1, 1);
            this[ENGINE][VIEWS].splice(1, 1);
          }
          this[ENGINE][ROOMS][0].start();
          this[ENGINE][PROC](new GameEvent('roomstart', old, Rm));
        })();
      },
      // freeze the current room and put this[ENGINE] one over top
      overlay: (Rm) => {
        const old = this[ENGINE][ROOMS][0].constructor;
        this[ENGINE][ROOMS].unshift(new Rm(this[ENGINE]));
        this[ENGINE][OBJECTS].unshift([]);
        this[ENGINE][VIEWS].unshift(new Rectangle(0, 0, ...this[ENGINE].size));
        if(!(this[ENGINE][ROOMS][0] instanceof Room)) {
          throw `${this[ENGINE][ROOMS][0].constructor.name} is not a Room`;
        }
        (async () => {
          this[ENGINE][ROOMS][0].load();
          this[ENGINE][PROC](new GameEvent('roomload', null, Rm));
          await this[ENGINE][ROOMS][0].loaded;
          this[ENGINE][ROOMS][0].start();
          this[ENGINE][PROC](new GameEvent('roomstart', null, Rm));
        })();
      },
      // closes the current room overlay
      close: () => {
        this[ENGINE][PROC](new GameEvent('roomend', this[ENGINE][ROOMS][0].constructor, null));
        this[ENGINE][ROOMS][0].end();
        this[ENGINE][ROOMS][0].destructor();
        this[ENGINE][ROOMS].shift();
        this[ENGINE][OBJECTS].shift();
        this[ENGINE][VIEWS].shift();
        if(this[ENGINE][ROOMS].length === 0) {
          throw `You closed the last room... please don't do that`;
        }
      }
    }
  }

  mousestate(button) {
    return this[ENGINE][INPUT].mousestate(button);
  }

  keystate(key) {
    return this[ENGINE][INPUT].keystate(key);
  }

  // end the game
  // NOTE: for JS version of this[ENGINE] engine, this[ENGINE] function isn't all that
  // useful since you can't really 'close' a canvas
  end() {
    this[ENGINE][PROC](new GameEvent('gameend'));
    this[ENGINE].end();
    window.cancelAnimationFrame(this[ENGINE][RAF]);
    this[ENGINE][RAF] = null;
    this[ENGINE][ROOMS] = [];
    this[ENGINE][OBJECTS] = [[]];
  }

  // end the game and run it again
  restart() {
    this[ENGINE].util.end();
    this[ENGINE].run();
  }

  sound(name) {
    return this[ENGINE][SOUND_MANAGER].sound(name);
  }

  music(name) {
    this[ENGINE][SOUND_MANAGER].music(name);
  }

  // spawn an object
  spawn(...args) {
    return this[ENGINE][ROOMS][0].spawn(...args);
  }

  // find an object
  find(Obj) {
    return this[ENGINE][ROOMS][0].find(Obj);
  }

  // destroy an object
  destroy(obj) {
    this[ENGINE][ROOMS][0].destroy(obj);
  }

  // checks if two colliders are colliding
  collides(where, what) {
    if(what instanceof Collider) {
      return what.collides(where);
    }
    if(this[ENGINE][ROOMS][0].collides(where, what)) {
      return true;
    }
    if(what !== 'room') {
      what = what === 'any'
        ? this[ENGINE][OBJECTS][0].filter(o => o instanceof Collider)
        : this[ENGINE][OBJECTS][0].filter(o => o instanceof what);
      for(let it of what) {
        if(it.collides(where)) {
          return true;
        }
      }
    }
    return false;
  }
}

export default GameUtility;
