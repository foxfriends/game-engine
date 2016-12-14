'use strict';

import TexturePage from './texture-page';

class TextureManager {
  old = [];
  pages = {};

  constructor(sources = []) {
    this.sources = sources;
  }

  // load a set of texture pages
  load(textures) {
    this.old = Object.keys(this.pages).filter(key => !textures.includes(key));
    const loaded = [];
    for(let texture of textures) {
      if(!this.pages[texture]) {
        this.pages[texture] = new TexturePage(this.sources[texture]);
        loaded.push(this.pages[texture].loaded);
      }
    }
    return Promise.all(loaded);
  }

  // remove all texture pages in the list given
  purge(textures = this.old) {
    for(let texture of textures) {
      delete this.pages[texture];
    }
    return this;
  }

  // instantiate the sprite from the pages
  sprite(sprite) {
    let spr;
    for(let page of Object.keys(this.pages)) {
      if(spr = this.pages[page].make(sprite)) {
        break;
      }
    }
    if(!spr) { throw `Sprite ${sprite} does not exist in the current set of texture pages`; }
    return spr;
  }
}

export default TextureManager;
