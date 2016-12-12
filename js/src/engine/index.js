'use strict';

import Draw from './draw';
import { Dimension } from './struct';
import GameEvent from './game-event';
import Drawable from './drawable';
import Room from './room';
import Input from './input';
import TextureManager from './texture-manager';

// NOTE : maybe I should bring in that Symbolic thing...
const [ROOM, OBJECTS, RAF, CANVAS, CONTEXT, INPUT, PAGES, SPRITES, TEXTURE_MANAGER] =
      [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class Engine {
  [ROOM] = null;
  [OBJECTS] = [];
  [PAGES] = {};
  [SPRITES] = {};
  [RAF] = null;
  [TEXTURE_MANAGER] = new TextureManager();

  constructor(canvas, {w, h}) {
    this[CANVAS] = document.querySelector(canvas);
    this[CANVAS].width = w;
    this[CANVAS].height = h;
    this[CONTEXT] = this[CANVAS].getContext('2d');
    this[INPUT] = new Input(this[CANVAS]);
  }
  get size() { return new Dimension(this[CANVAS].width, this[CANVAS].height); }

  // triggers the event for all objects currently active
  // HACK : internalize
  proc(event) {
    for(let obj of this[OBJECTS]) {
      obj.proc(event);
    }
    this[ROOM] && this[ROOM].proc(event);
  }

  // specifies how to start a game
  start() {}
  // processes all events for one frame
  // HACK : internalize
  step() {
    this.proc(new GameEvent('stepstart'));
    for(let event of this[INPUT]) {
      this.proc(event);
    }
    this.proc(new GameEvent('step'));
    this.proc(new GameEvent('stepend'));
  }
  // refreshes the game screen
  // HACK : internalize
  draw() {
    this[CONTEXT].clearRect(0, 0, ...this.size);
    const drawer = new Draw(this[CONTEXT]);
    for(let obj of this[OBJECTS]) {
      obj instanceof Drawable && obj.draw(drawer.object(obj));
    }
    this[ROOM] && this[ROOM].draw(drawer);
    drawer.render();
  }
  // specifies how to end a game
  end() {}

  // runs the game
  // HACK : internalize
  run() {
    const takeStep = () => {
      this.step();
      this.draw();
      this[RAF] = window.requestAnimationFrame(takeStep);
    };
    this.start();
    this.proc(new GameEvent('gamestart'));
    this[RAF] = window.requestAnimationFrame(takeStep);
  }

  // spawns a persistent object
  // HACK : internalize
  spawn(Obj, ...args) {
    const o = new Obj(this);
    o.init(...args);
    this[OBJECTS].push(o);
    return o;
  }
  // destroys a persistent object
  // HACK : internalize
  destroy(obj) {
    const i = this[OBJECTS].indexOf(o);
    if(i >= 0) {
      this[OBJECTS].splice(i, 1);
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
          if(this[ROOM]) {
            this.proc(new GameEvent('roomend'));
            this[ROOM].end();
          }
          this[ROOM] = new Rm(this);
          if(!(this[ROOM] instanceof Room)) {
            throw `${this[ROOM].constructor.name} is not a Room`;
          }
          this[ROOM].start();
          this.proc(new GameEvent('roomstart'));
        }
      },
      // end the game
      end: () => {
        this.proc(new GameEvent('gameend'));
        window.cancelAnimationFrame(this[RAF]);
        this[RAF] = null;
        this[ROOM] = null;
        this[OBJECTS] = [];
        this.end();
      },
      // end the game and run it again
      restart: () => {
        this.game.end();
        this.run();
      }
    };
  }
}

export { Engine };
export default Engine;
