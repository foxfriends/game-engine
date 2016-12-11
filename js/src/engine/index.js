'use strict';

import Draw from './draw';
import { Dimension } from './struct';
import GameEvent from './game-event';
import Drawble from './drawable';
import Room from './room';
import Input from './input';

const [ROOM, OBJECTS, RAF, CANVAS, CONTEXT, INPUT] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class Engine {
  [ROOM] = null;
  [OBJECTS] = [];
  [RAF] = null;

  constructor(canvas, {w, h}) {
    this[CANVAS] = document.querySelector(canvas);
    this[CANVAS].width = w;
    this[CANVAS].height = h;
    this[CONTEXT] = this[CANVAS].getContext('2d');
    this[INPUT] = new Input(this[CANVAS]);
  }
  get size() { return new Dimension(this[CANVAS].width, this[CANVAS].height); }

  proc(event) {
    for(let obj of this[OBJECTS]) {
      obj.proc(event);
    }
    this[ROOM] && this[ROOM].proc(event);
  }

  start() {}
  step() {
    this.proc(new GameEvent('stepstart'));
    for(let event of this[INPUT]) { // TODO: parse the events here
      this.proc(event);
    }
    this.proc(new GameEvent('step'));
    this.proc(new GameEvent('stepend'));
  }
  draw() {
    this[CONTEXT].clearRect(0, 0, ...this.size);
    const drawer = new Draw(this[CONTEXT]);
    for(let obj of this[OBJECTS]) {
      obj instanceof Drawable && obj.draw(drawer);
    }
    this[ROOM] && this[ROOM].draw(drawer);
    drawer.render();
  }
  end() {}

  run() {
    const takeStep = () => {
      this.step();
      this.draw();
      this[RAF] = window.requestAnimationFrame(takeStep);
    };
    this.start();
    this[RAF] = window.requestAnimationFrame(takeStep);
  }

  // utilities
  get room() {
    return {
      goto: (R) => {
        this[ROOM] && this[ROOM].end();
        this[ROOM] = new R(this);
        if(!(this[ROOM] instanceof Room)) {
          throw `${this[ROOM].constructor.name} is not a Room`;
        }
        this[ROOM].start();
      }
    }
  }

  get game() {
    return {
      end: () => {
        window.cancelAnimationFrame(this[RAF]);
        this[RAF] = null;
        this[ROOM] = null;
        this[OBJECTS] = [];
        this.end();
      },
      restart: () => {
        this.game.end();
        this.run();
      }
    }
  }
}

export { Engine };
export default Engine;
