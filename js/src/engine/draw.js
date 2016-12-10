'use strict';

class Text {
  constructor(str, where) {
    this.str = str;
    this.where = where;
  }
}

class Draw {
  stack = {};
  color = 0xFFFFFF;
  alpha = 1;

  constructor() {}

  // settings
  alpha(alpha) {
    this.alpha = alpha;
  }
  color(color) {
    this.color = color;
  }

  // drawing
  rect(rect, depth = 0) {
    this.stack[depth] = this.stack[depth] || [];
    this.stack[depth].push([rect, {color: this.color, alpha: this.alpha}]);
    return this;
  }
  point(point, depth = 0) {
    this.stack[depth] = this.stack[depth] || [];
    this.stack[depth].push([point, {color: this.color, alpha: this.alpha}]);
    return this;
  }
  sprite(sprite, depth = 0) {
    this.stack[depth] = this.stack[depth] || [];
    this.stack[depth].push([sprite, {color: this.color, alpha: this.alpha}]);
    return this;
  }
  text(str, where, depth = 0) {
    this.stack[depth] = this.stack[depth] || [];
    this.stack[depth].push([Text(str, where), {color: this.color, alpha: this.alpha}]);
    return this;
  }

  render() {
    for(let depth of Object.keys(this.stack)) {
      for(let item of this.stack[depth]) {
        // draw things?
        // will this need a canvas?
      }
    }
    this.stack = {};
  }
}

export default Draw;
