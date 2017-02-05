'use strict';

import { Position } from './struct';

const [STACK, COLOR, ALPHA, FONT, HALIGN, VALIGN, WHO, CONTAINER, VIEWPORT, CONTEXT, ROTATION] =
      [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class Draw {
  [STACK] = {};
  [COLOR] = '#000000';
  [ALPHA] = 1;
  [FONT] = '14px Arial';
  [WHO] = null;
  [VIEWPORT] = null;
  [CONTAINER] = null;
  [CONTEXT] = [];
  [HALIGN] = 'top';
  [VALIGN] = 'left';
  [ROTATION] = { angle: 0, origin: [0, 0] };

  constructor(container) {
    this[CONTAINER] = container;
    this.generateCanvas(0);
  }

  generateCanvas(layer) {
    const canvas = document.createElement('CANVAS');
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = layer;
    canvas.style.transformOrigin = '0 0';
    this[CONTAINER].appendChild(canvas);
    this[CONTEXT][layer] = canvas.getContext('2d');
  }

  // the current object being drawn
  // HACK: internalize
  object(who) {
    this[WHO] = who;
    return this;
  }

  // the current viewport rectangle
  // HACK: internalize
  view(view) {
    this[VIEWPORT] = [...view];
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
  font(font) {
    this[FONT] = font;
    return this;
  }
  halign(align) {
    this[HALIGN] = align;
    return this;
  }
  valign(align) {
    this[VALIGN] = align;
    return this;
  }
  rotation(angle, origin = [0, 0]) {
    this[ROTATION] = { angle, origin: [...origin] };
    return this;
  }

  // draw a rectangle
  rect(rect, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [color, alpha] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.fillRect(...rect);
    });
    return this;
  }
  // draw a circle
  circle(circle, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [color, alpha] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.beginPath();
      con.arc(...circle, 0, Math.PI * 2);
      con.fill();
    });
    return this;
  }
  // draw a pixel
  point(point, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [color, alpha] = [this[COLOR], this[ALPHA]];
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
    const [{ angle, origin }, alpha] = [this[ROTATION], this[ALPHA]];
    const src = [...sprite.src];
    const dest = [...sprite.dest];
    this[STACK][depth].push(con => {
      con.globalAlpha = alpha;
      if(angle !== 0) {
        con.save();
        con.translate(dest[0] + origin[0], dest[1] + origin[1]);
        con.rotate(angle);
        dest[0] = -origin[0];
        dest[1] = -origin[1];
      }
      con.drawImage(sprite.texture, ...src, ...dest);
      if(angle !== 0) {
        con.restore();
      }
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

  textSize(str) {
    this[CONTEXT][0].font = this[FONT];
    const { width, height } = this[CONTEXT][0].measureText(str);
    return new Rectangle(width, height);
  }
  // draw some text
  text(str, where, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [font, alpha, color, ha, va] = [this[FONT], this[ALPHA], this[COLOR], this[HALIGN], this[VALIGN]];
    this[STACK][depth].push(con => {
      con.font = font;
      con.globalAlpha = alpha;
      con.fillStyle = color;
      con.textAlign = ha;
      con.textBaseline = va;
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
  render(i) {
    const { width, height } = this[CONTAINER].getBoundingClientRect();
    if(!this[CONTEXT][i]) {
      this.generateCanvas(i);
    }
    const context = this[CONTEXT][i];
    if(this[VIEWPORT][2] !== context.canvas.width) {
      context.canvas.width = this[VIEWPORT][2];
      this[CONTEXT][i].canvas.style.transform = `scale(${width / this[VIEWPORT][2]}, ${height / this[VIEWPORT][3]})`;
    }
    if(this[VIEWPORT][3] !== context.canvas.height) {
      context.canvas.height = this[VIEWPORT][3];
      this[CONTEXT][i].canvas.style.transform = `scale(${width / this[VIEWPORT][2]}, ${height / this[VIEWPORT][3]})`;
    }
    context.save();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.translate(-this[VIEWPORT][0], -this[VIEWPORT][1]);
    for(let depth of Object.keys(this[STACK]).map(x=>+x).sort((a,b)=>a-b)) {
      for(let item of this[STACK][depth]) {
        item(context);
      }
    }
    context.restore();
    this[STACK] = {};
  }

  // removes extra canvases from the DOM
  removeCanvases(i) {
    for(; i < this[CONTEXT].length; ++i) {
      if(this[CONTEXT][i]) {
        this[CONTEXT][i].canvas.parentNode.removeChild(this[CONTEXT][i].canvas);
        delete this[CONTEXT][i];
      }
    }
  }
}

export default Draw;
