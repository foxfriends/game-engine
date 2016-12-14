'use strict';

import Draw from './draw';
import { Dimension } from './struct';
import GameEvent from './game-event';
import Drawable from './drawable';
import Room from './room';
import Input from './input';
import TextureManager from './texture-manager';
import { PAGES } from './const';

// NOTE : maybe I should bring in that Symbolic thing...
const [ROOMS, OBJECTS, RAF, CANVAS, CONTEXT, INPUT, SPRITES, TEXTURE_MANAGER] =
      [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class Engine {
  [ROOMS] = [];
  [OBJECTS] = [[]];
  [SPRITES] = {};
  [RAF] = null;

  constructor(canvas, {w, h}) {
    this[CANVAS] = document.querySelector(canvas);
    this[CANVAS].width = w;
    this[CANVAS].height = h;
    this[CONTEXT] = this[CANVAS].getContext('2d');
    this[INPUT] = new Input(this[CANVAS]);
    this[TEXTURE_MANAGER] = new TextureManager(this.constructor[PAGES]);
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
      for(let obj of this[OBJECTS][i]) {
        obj instanceof Drawable && obj.draw(drawer.object(obj));
      }
      this[ROOMS][i] && this[ROOMS][i].draw(drawer);
      drawer.render();
    }
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
        // NB: guard against the game being re-run by just stopping it
        // behaviour is undefined if there are still rooms/objects in the game
        // and the game is re-run
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

  // load the given list of texture pages
  get texture() {
    return this[TEXTURE_MANAGER];
  }

  // utilities
  get util() {
    return {
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
          if(!(this[ROOMS][0] instanceof Room)) {
            throw `${this[ROOMS][0].constructor.name} is not a Room`;
          }
          (async () => {
            this[ROOMS][0].load();
            await this[ROOMS][0].loaded;
            // remove the old room, which was temporarily shifted
            this[ROOMS].splice(1, 1);
            this[OBJECTS].splice(1, 1);
            this[ROOMS][0].start();
            this.proc(new GameEvent('roomstart', old, Rm));
          })();
        },
        // freeze the current room and put this one over top
        overlay: (Rm) => {
          const old = this[ROOMS][0].constructor;
          this[ROOMS].unshift(new Rm(this));
          this[OBJECTS].unshift([]);
          if(!(this[ROOMS][0] instanceof Room)) {
            throw `${this[ROOMS][0].constructor.name} is not a Room`;
          }
          (async () => {
            this[ROOMS][0].load();
            await this[ROOMS][0].loaded;
            this[ROOMS][0].start();
            this.proc(new GameEvent('roomstart', old, Rm));
          })();
        },
        // closes the current room overlay
        close: () => {
          this[ROOMS].shift();
          this[OBJECTS].shift();
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
      //       useful since you can't really 'close' a canvas
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
      spawn: (...args) => {
        this[ROOMS][0].spawn(...args);
      },
      destroy: (obj) => {
        this[ROOMS][0].destroy(obj);
      }
    };
  }
}

export { Engine };
export default Engine;
