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
const [ROOMS, OBJECTS, RAF, CONTAINER, INPUT, TEXTURE_MANAGER, SOUND_MANAGER, VIEWS, SIZE, DRAWER] =
      [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

// TODO: rewrite everything to use private methods using out-of-class bound
//       functions and internal methods using shared symbols

class Engine {
  [ROOMS] = [];
  [OBJECTS] = [[]];
  [RAF] = null;
  [VIEWS] = [new Rectangle(0, 0, 300, 150)];
  [DRAWER] = null;

  constructor(container, {w, h}) {
    this[SIZE] = new Dimension(w, h);
    this[CONTAINER] = document.querySelector(container);
    this[CONTAINER].setAttribute('tabindex', 0);
    this[CONTAINER].style.position = 'relative';
    this[CONTAINER].style.width = w + 'px';
    this[CONTAINER].style.height = h + 'px';
    this[CONTAINER].style.outline = 'none';
    this[VIEWS][0].w = w;
    this[VIEWS][0].h = h;
    this[INPUT] = new Input(this[CONTAINER]);
    this[TEXTURE_MANAGER] = new TextureManager(this.constructor[PAGES]);
    this[SOUND_MANAGER] = new SoundManager(this.constructor[SOUNDS], this.constructor[MUSIC]);
  }
  get size() { return this[SIZE]; }

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
    const drawer = this[DRAWER] || (this[DRAWER] = new Draw(this[CONTAINER]));
    // draw under layers first
    // IDEA: add some optimization options here for purely static layers
    //       we shouldn't need to re-draw every item individually if they
    //       haven't changed at all
    drawer.removeCanvases(this[ROOMS].length * 2);
    for(let i = this[ROOMS].length - 1; i >= 0; --i) {
      drawer.view(this[VIEWS][i]);
      for(let obj of this[OBJECTS][i]) {
        obj instanceof Drawable && obj.draw(drawer.object(obj));
      }
      this[ROOMS][i] && this[ROOMS][i].draw(drawer);
      drawer.render(i);
      // draw GUI
      drawer.view(new Rectangle(0, 0, ...this.size));
      for(let obj of this[OBJECTS][i]) {
        obj instanceof Drawable && obj.drawGUI(drawer.object(obj));
      }
      this[ROOMS][i] && this[ROOMS][i].drawGUI(drawer);
      drawer.render(this[ROOMS].length + i);
    }
  }
  // run at the end of a game
  end() {}

  // runs the game
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

  // utilities - TODO: this should be put in another module
  get util() {
    return new GameUtility(this);
  }
}

const [ ENGINE ] = [ Symbol() ];

// TODO: move this into another module once the internal function sharing is set up
class GameUtility {
  [ENGINE] = null;

  constructor(engine) {
    this[ENGINE] = engine
  }

  get size() { return new Dimension(...this[ENGINE].size); }

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
          this[ENGINE].proc(new GameEvent('roomend', old, Rm));
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
          this[ENGINE].proc(new GameEvent('roomload', old, Rm));
          await this[ENGINE][ROOMS][0].loaded;
          // remove the old room, which was temporarily shifted
          if(this[ENGINE][ROOMS][1]) {
            this[ENGINE][ROOMS].splice(1, 1)[0].destructor();
            this[ENGINE][OBJECTS].splice(1, 1);
            this[ENGINE][VIEWS].splice(1, 1);
          }
          this[ENGINE][ROOMS][0].start();
          this[ENGINE].proc(new GameEvent('roomstart', old, Rm));
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
          this[ENGINE].proc(new GameEvent('roomload', null, Rm));
          await this[ENGINE][ROOMS][0].loaded;
          this[ENGINE][ROOMS][0].start();
          this[ENGINE].proc(new GameEvent('roomstart', null, Rm));
        })();
      },
      // closes the current room overlay
      close: () => {
        this[ENGINE].proc(new GameEvent('roomend', this[ENGINE][ROOMS][0].constructor, null));
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
    this[ENGINE].proc(new GameEvent('gameend'));
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
      return what.collides(where) ? what : null;
    }
    const room = this[ENGINE][ROOMS][0].collides(where, what);
    if(room) {
      return room;
    }
    if(what !== 'room') {
      what = what === 'any'
        ? this[ENGINE][OBJECTS][0].filter(o => o instanceof Collider)
        : this[ENGINE][OBJECTS][0].filter(o => o instanceof what);
      for(let it of what) {
        if(it.collides(where)) {
          return it;
        }
      }
    }
    return null;
  }
}


export { Engine };
export default Engine;
