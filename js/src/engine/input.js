'use strict';

import GameEvent from './game-event';

const [QUEUE, STATE] = [Symbol(), Symbol()];

class Input {
  [QUEUE] = {
    keydown: [],
    keyup: [],
    mousedown: [],
    mouseup: [],
    mousemove: [0, 0]
  };

  [STATE] = {
    mouse: {},
    key: {}
  }

  constructor(canvas) {
    this.canvas = canvas;
    window.addEventListener('keydown', this.keydown.bind(this), true);
    window.addEventListener('keyup', this.keyup.bind(this), true);
    window.addEventListener('mousedown', this.mousedown.bind(this), true);
    window.addEventListener('mouseup', this.mouseup.bind(this), true);
    window.addEventListener('mousemove', this.mousemove.bind(this), true);
  }

  keystate(key) {
    return !!this[STATE].key[key];
  }

  mousestate(button) {
    return !!this[STATE].mouse[button];
  }

  keydown(event) {
    this[QUEUE].keydown.push(new GameEvent('keydown', event.key));
    this[STATE].key[event.key] = true;
  }
  keyup(event) {
    this[QUEUE].keyup.push(new GameEvent('keyup', event.key));
    this[STATE].key[event.key] = false;
  }
  mousedown(event) {
    this[QUEUE].mousedown.push(new GameEvent('mousedown', event.button));
    this[STATE].mouse[event.button] = true;
  }
  mouseup(event) {
    this[QUEUE].mouseup.push(new GameEvent('mouseup', event.button));
    this[STATE].mouse[event.button] = false;
  }
  mousemove(event) {
    const {left: x, top: y} = this.canvas.getBoundingClientRect();
    this[QUEUE].mousemove = [event.clientX - x, event.clientY - y];
  }

  *[Symbol.iterator] () {
    yield* [
      ... this[QUEUE].keydown.splice(0),
      ... this[QUEUE].mousedown.splice(0),
      ... this[QUEUE].keyup.splice(0),
      ... this[QUEUE].mouseup.splice(0),
      new GameEvent('mousemove', this[QUEUE].mousemove)
    ];
  }
}

export default Input;
