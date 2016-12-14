'use strict';

const [STACK, COLOR, ALPHA, FONT, CONTEXT, WHO] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class Draw {
  [STACK] = {};
  [COLOR] = '#000000';
  [ALPHA] = 1;
  [FONT] = '14px Arial';
  [WHO] = null;

  constructor(context) { this[CONTEXT] = context; }

  // REVIEW: HACK: internalize
  object(who) {
    this[WHO] = who;
    return this;
  }

  // settings
  alpha(alpha) {
    this[ALPHA] = alpha;
    return this;
  }
  color(color) {
    this[COLOR] = typeof color === 'number' ? '#' + color.toString(16).padStart(6, '0') : color;
    return this;
  }

  // draw a rectangle
  rect(rect, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [alpha, color] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.fillRect(...rect);
    });
    return this;
  }
  // draw a pixel
  point(point, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [alpha, color] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.fillRect(...point, 1, 1);
    });
    return this;
  }
  // draw a sprite
  sprite(sprite, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const alpha = this[ALPHA];
    this[STACK][depth].push(con => {
      con.globalAlpha = alpha;
      con.drawImage(sprite.texture, ...sprite.src, ...sprite.dest);
    });
    return this;
  }
  // draw a tilemap
  image(image, src, dest, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const alpha = this[ALPHA];
    this[STACK][depth].push(con => {
      con.globalAlpha = alpha;
      con.drawImage(image, ...src, ...dest);
    });
    return this;
  }
  // draw some text
  text(str, where, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [font, alpha, color] = [this[FONT], this[ALPHA], this[COLOR]]
    this[STACK][depth].push(con => {
      con.font = font;
      con.globalAlpha = alpha;
      con.fillStyle = color;
      con.fillText(str, ...where);
    });
    return this;
  }
  // draw the current GameObject sensibly from defaults
  self(depth = 0) {
    if(this[WHO] && this[WHO].sprite) {
      this.sprite(this[WHO].sprite, depth);
    }
  }

  // actually draw each item in the stack at the right depth
  render() {
    for(let depth of Object.keys(this[STACK]).map(x=>+x).sort((a,b)=>a-b)) {
      for(let item of this[STACK][depth]) {
        item(this[CONTEXT]);
      }
    }
    this[STACK] = {};
  }
}

export default Draw;
