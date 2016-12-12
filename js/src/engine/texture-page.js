'use strict';

import { Rectangle } from './struct';
import Sprite from './sprite';

const TEXTURE = Symbol();

class TexturePage extends Image {
  constructor({img, frames, sprites}) {
    // make a texture page from the json
    super();
    this.src = img;
    this[FRAMES] = frames;
    this[SPRITES] = sprites;
  }

  frame(i) { return new Rectangle(... this[FRAMES][i]); }

  make(sprite) {
    if(this[SPRITES].hasOwnProperty(sprite)) {
      return new Sprite(this, this[SPRITES][sprite]);
    } else {
      return null;
    }
  }
};

export { TexturePage };
export default TexturePage;
