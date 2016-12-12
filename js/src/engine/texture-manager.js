'use strict';

import TexturePage from './texture-page';

class TextureManager {
  old = [];
  pages = {};

  // load a set of texture pages
  load(textures) {
    this.old = Object.keys(this.pages).filter(key => textures.includes(key));
    for(let texture of textures) {
      if(!this.pages[texture]) {
        this.pages[texture] = new TexturePage(texture);
      }
    }
    return this;
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
