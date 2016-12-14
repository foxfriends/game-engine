'use strict';

import { Rectangle } from './struct';
import loadJSON from './load-json';
import Sprite from './sprite';
import path from 'path';

const [FRAMES, SPRITES, LOADED] = [Symbol(), Symbol(), Symbol(), Symbol()];

class TexturePage extends Image {
  [FRAMES] = null;
  [SPRITES] = null;
  [LOADED] = new Promise(() => {});

  constructor(url) {
    super();
    this[LOADED] = (async () => {
      // make a texture page from the json
      const json = await loadJSON(url);
      this.src = json.image;
      this.width = json.width;
      this.height = json.height;
      this[FRAMES] = json.frames;
      this[SPRITES] = json.sprites;
      await new Promise(resolve => this.addEventListener('load', resolve));
    })();
  }

  get loaded() {
    return this[LOADED];
  }

  frame(i) { return new Rectangle(... this[FRAMES][i]); }

  make(sprite) {
    if(this[SPRITES].hasOwnProperty(sprite)) {
      return new Sprite(this, this[SPRITES][sprite], sprite);
    } else {
      return null;
    }
  }
};

export { TexturePage };
export default TexturePage;
