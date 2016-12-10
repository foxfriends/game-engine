'use strict';
import Draw from './draw';

const [ROOM, OBJECTS, RAF] = [Symbol(), Symbol(), Symbol()];

class Engine {
  [ROOM] = null;
  [OBJECTS] = [];
  [RAF] = null;

  constructor() {}

  start() {}
  step() {
    let event = null;
    while(event = null) { // TODO: parse the events here
      for(let obj of this[OBJECTS]) {
        obj.proc(event);
      }
      this[ROOM] && this[ROOM].proc(event);
    }
  }
  draw() {
    const drawer = new Draw();
    for(let obj of this[OBJECTS]) {
      obj.draw && obj.draw(drawer);
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
      goto: (room) => {
        this[ROOM] && this[ROOM].end();
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
