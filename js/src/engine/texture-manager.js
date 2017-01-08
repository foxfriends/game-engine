'use strict';

import TexturePage from './texture-page';

const [REFERENCES, PAGES, SOURCES] = [Symbol(), Symbol(), Symbol()];

class TextureManager {
  [REFERENCES] = new WeakMap();
  [PAGES] = {};
  [SOURCES] = null;

  constructor(sources = []) {
    this[SOURCES] = sources;
  }

  // load a set of texture pages
  load(textures) {
    textures = new Set(textures);
    const loaded = [];
    for(let texture of textures) {
      if(!this[PAGES][texture]) {
        this[PAGES][texture] = new TexturePage(this[SOURCES][texture]);
        loaded.push(this[PAGES][texture].loaded);
      }
      this[REFERENCES].set(
        this[PAGES][texture],
        (this[REFERENCES].get(this[PAGES][texture]) || 0) + 1
      );
    }
    return Promise.all(loaded);
  }

  // remove all texture pages in the list given
  purge(textures = []) {
    for(let texture of textures) {
      if(this[PAGES][texture]) {
        this[REFERENCES].set(
          this[PAGES][texture],
          this[REFERENCES].get(this[PAGES][texture]) - 1
        );
        if(!this[REFERENCES].get(this[PAGES][texture])) {
          delete this[PAGES][texture];
        }
      }
    }
  }

  get pages() { return this[PAGES]; }

  // instantiate the sprite from the pages
  sprite(sprite) {
    let spr;
    for(let page of Object.keys(this[PAGES])) {
      if(spr = this[PAGES][page].make(sprite)) {
        break;
      }
    }
    if(!spr) { throw `Sprite ${sprite} does not exist in the current set of texture pages`; }
    return spr;
  }
}

export default TextureManager;
