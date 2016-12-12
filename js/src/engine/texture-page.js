'use strict';

import { Rectangle } from './struct';
import Sprite from './sprite';
import path from 'path';

const [TEXTURE, FRAMES, SPRITES, LOADED] = [Symbol(), Symbol(), Symbol(), Symbol()];

function loadFile(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
      try {
        const data = JSON.parse(req.responseText);
        resolve(data);
      } catch(error) {
        reject(`Invalid JSON received from ${url}`);
      }
    });
    req.send();
  });
}

class TexturePage extends Image {
  constructor(file) {
    super();
    this[LOADED] = (async () => {
      // make a texture page from the json
      const json = await loadFile(file);
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
