'use strict';

import GameEvent from './game-event';

class Input {
  queue = {
    keydown: [],
    keyup: [],
    mousedown: [],
    mouseup: [],
    mousemove: [0, 0]
  };

  constructor(canvas) {
    this.canvas = canvas;
    window.addEventListener('keydown', this.keydown.bind(this), true);
    window.addEventListener('keyup', this.keyup.bind(this), true);
    window.addEventListener('mousedown', this.mousedown.bind(this), true);
    window.addEventListener('mouseup', this.mouseup.bind(this), true);
    window.addEventListener('mousemove', this.mousemove.bind(this), true);
  }

  keydown(event) {
    this.queue.keydown.push(new GameEvent('keydown', event.key));
  }
  keyup(event) {
    this.queue.keyup.push(new GameEvent('keyup', event.key));
  }
  mousedown(event) {
    this.queue.mousedown.push(new GameEvent('mousedown', event.button));
  }
  mouseup(event) {
    this.queue.mouseup.push(new GameEvent('mouseup', event.button));
  }
  mousemove(event) {
    const {left: x, top: y} = this.canvas.getBoundingClientRect();
    this.queue.mousemove = [event.clientX - x, event.clientY - y];
  }

  *[Symbol.iterator] () {
    yield* [
      ...this.queue.keydown.splice(0),
      ...this.queue.mousedown.splice(0),
      ...this.queue.keyup.splice(0),
      ...this.queue.mouseup.splice(0),
      new GameEvent('mousemove', this.queue.mousemove)
    ];
  }
}

export default Input;
