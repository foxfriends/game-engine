'use strict';

import Draw from './draw';
import { Position, Dimension, Rectangle } from './struct';
import GameEvent from './game-event';
import Drawable from './drawable';
import Collider from './collider';
import Room from './room';
import Input from './input';
import TextureManager from './texture-manager';
import SoundManager from './sound-manager';
import { PAGES, SOUNDS, MUSIC } from './const';

// NOTE : maybe I should bring in that Symbolic thing...
const [ROOMS, OBJECTS, RAF, CANVAS, CONTEXT, INPUT, TEXTURE_MANAGER, SOUND_MANAGER, VIEWS] =
      [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class Engine {
  [ROOMS] = [];
  [OBJECTS] = [[]];
  [RAF] = null;
  [VIEWS] = [new Rectangle(0, 0, 300, 150)];

  constructor(canvas, {w, h}) {
    this[CANVAS] = document.querySelector(canvas);
    this[CANVAS].width = w;
    this[CANVAS].height = h;
    this[VIEWS][0].w = w;
    this[VIEWS][0].h = h;
    this[CONTEXT] = this[CANVAS].getContext('2d');
    this[INPUT] = new Input(this[CANVAS]);
    this[TEXTURE_MANAGER] = new TextureManager(this.constructor[PAGES]);
    this[SOUND_MANAGER] = new SoundManager(this.constructor[SOUNDS], this.constructor[MUSIC]);
  }
  get size() { return new Dimension(this[CANVAS].width, this[CANVAS].height); }

  // triggers the event for all objects currently active
  // HACK: internalize
  proc(event) {
    for(let obj of this[OBJECTS][0]) {
      obj.proc(event);
    }
    this[ROOMS][0] && this[ROOMS][0].proc(event);
  }

  // specifies how to start a game
  start() {}
  // processes all events for one frame
  // HACK: internalize
  step() {
    this.proc(new GameEvent('stepstart'));
    for(let event of this[INPUT]) {
      this.proc(event);
    }
    this.proc(new GameEvent('step'));
    this.proc(new GameEvent('stepend'));
  }
  // refreshes the game screen
  // HACK: internalize
  draw() {
    this[CONTEXT].clearRect(0, 0, ...this.size);
    const drawer = new Draw(this[CONTEXT]);
    // draw under layers first
    // IDEA: add some optimization options here for purely static layers
    //       we shouldn't need to re-draw every item individually if they
    //       haven't changed at all
    for(let i = this[ROOMS].length - 1; i > 0; --i) {
      drawer.view(this[VIEWS][i])
      for(let obj of this[OBJECTS][i]) {
        obj instanceof Drawable && obj.draw(drawer.object(obj));
      }
      this[ROOMS][i] && this[ROOMS][i].draw(drawer);
      drawer.render();
    }
    drawer.view(this[VIEWS][0]);
    for(let obj of this[OBJECTS][0]) {
      obj instanceof Drawable && obj.draw(drawer.object(obj));
    }
    this[ROOMS][0] && this[ROOMS][0].draw(drawer);
    drawer.render();
  }
  // run at the end of a game
  end() {}

  // runs the game
  // HACK: internalize
  run() {
    let me = 0;
    const takeStep = () => {
      me = this[RAF];
      this.step();
      this.draw();
      if(this[RAF] === me) {
        // guard against the game being re-run by just stopping it.
        // NOTE: behaviour is undefined if there are still rooms/objects in the
        // game when it is re-run
        this[RAF] = window.requestAnimationFrame(takeStep);
      }
    };
    this.start();
    this.proc(new GameEvent('gamestart'));
    this[RAF] = window.requestAnimationFrame(takeStep);
  }

  // spawns a persistent object
  // HACK: internalize
  spawn(Obj, ...args) {
    const o = new Obj(this);
    o.init(...args);
    this[OBJECTS][0].push(o);
    return o;
  }
  // destroys a persistent object
  // HACK: internalize
  destroy(obj) {
    if(typeof obj === 'function') {
      this[OBJECTS][0].filter(o => !(o instanceof obj));
    } else {
      const i = this[OBJECTS][0].indexOf(obj);
      if(i >= 0) {
        this[OBJECTS][0].splice(i, 1);
      }
    }
  }
  // finds a persistent object
  find(Obj) {
    return this[OBJECTS][0].filter(o => o instanceof Obj);
  }

  get texture() {
    return this[TEXTURE_MANAGER];
  }

  get sound() {
    return this[SOUND_MANAGER];
  }

  get layers() {
    return this[ROOMS].length;
  }

  // utilities - TODO: does this need to be modularized?
  get util() {
    return {
      // get/set the view port, optionally constrained within the room
      // boundaries if possible, and with the entire room centred if not
      view: (view, constrain = true) => {
        if(view === undefined) {
          return this[VIEWS][0];
        }
        if(view instanceof Position) {
          view = new Rectangle(view.x - this[VIEWS][0].w / 2, view.y - this[VIEWS][0].h / 2, this[VIEWS][0].w, this[VIEWS][0].h);
        }
        if(constrain) {
          const { w, h } = this[ROOMS][0].size;
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
        return this[VIEWS][0] = new Rectangle(...view);
      },
      room: {
        // go to the given room
        goto: (Rm) => {
          let old = null;
          if(this[ROOMS][0]) {
            old = this[ROOMS][0].constructor;
            this.proc(new GameEvent('roomend', old, Rm));
            this[ROOMS][0].end();
          }
          this[ROOMS].unshift(new Rm(this));
          this[OBJECTS].splice(1, 1, []);
          this[VIEWS].unshift(new Rectangle(0, 0, ...this.size))
          if(!(this[ROOMS][0] instanceof Room)) {
            throw `${this[ROOMS][0].constructor.name} is not a Room`;
          }
          (async () => {
            this[ROOMS][0].load();
            this.proc(new GameEvent('roomload', old, Rm));
            await this[ROOMS][0].loaded;
            // remove the old room, which was temporarily shifted
            if(this[ROOMS][1]) {
              this[ROOMS].splice(1, 1)[0].destructor();
              this[OBJECTS].splice(1, 1);
              this[VIEWS].splice(1, 1);
            }
            this[ROOMS][0].start();
            this.proc(new GameEvent('roomstart', old, Rm));
          })();
        },
        // freeze the current room and put this one over top
        overlay: (Rm) => {
          const old = this[ROOMS][0].constructor;
          this[ROOMS].unshift(new Rm(this));
          this[OBJECTS].unshift([]);
          this[VIEWS].unshift(new Rectangle(0, 0, ...this.size));
          if(!(this[ROOMS][0] instanceof Room)) {
            throw `${this[ROOMS][0].constructor.name} is not a Room`;
          }
          (async () => {
            this[ROOMS][0].load();
            this.proc(new GameEvent('roomload', null, Rm));
            await this[ROOMS][0].loaded;
            this[ROOMS][0].start();
            this.proc(new GameEvent('roomstart', null, Rm));
          })();
        },
        // closes the current room overlay
        close: () => {
          this.proc(new GameEvent('roomend', this[ROOMS][0].constructor, null));
          this[ROOMS][0].end();
          this[ROOMS][0].destructor();
          this[ROOMS].shift();
          this[OBJECTS].shift();
          this[VIEWS].shift();
          if(this[ROOMS].length === 0) {
            throw `You closed the last room... please don't do that`;
          }
        }
      },
      mousestate: (button) => {
        return this[INPUT].mousestate(button);
      },
      keystate: (key) => {
        return this[INPUT].keystate(key);
      },
      // end the game
      // NOTE: for JS version of this engine, this function isn't all that
      // useful since you can't really 'close' a canvas
      end: () => {
        this.proc(new GameEvent('gameend'));
        this.end();
        window.cancelAnimationFrame(this[RAF]);
        this[RAF] = null;
        this[ROOMS] = [];
        this[OBJECTS] = [[]];
      },
      // end the game and run it again
      restart: () => {
        this.util.end();
        this.run();
      },
      // spaw an object
      spawn: (...args) => {
        this[ROOMS][0].spawn(...args);
      },
      // destroy an object
      destroy: (obj) => {
        this[ROOMS][0].destroy(obj);
      },
      // find an object
      find: (Obj) => {
        return this[ROOMS][0].find(Obj);
      },
      // checks if two colliders are colliding
      collides: (where, what) => {
        if(what instanceof Collider) {
          return what.collides(where);
        }
        if(this[ROOMS][0].collides(where, what)) {
          return true;
        }
        if(what !== 'room') {
          what = what === 'any'
            ? this[OBJECTS][0].filter(o => o instanceof Collider)
            : this[OBJECTS][0].filter(o => o instanceof what);
          for(let it of what) {
            if(it.collides(where)) {
              return true;
            }
          }
        }
        return false;
      },
      sound: (name) => {
        return this[SOUND_MANAGER].sound(name);
      },
      music: (name) => {
        return this[SOUND_MANAGER].music(name);
      }
    };
  }
}

export { Engine };
export default Engine;
