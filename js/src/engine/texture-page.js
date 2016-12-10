'use strict';

import { Rectangle } from './struct';

const TEXTURE = Symbol();

class TexturePage extends Image {
  constructor({img, frames}) {
    // make a texture page from the json
    super();
    this.src = img;
    this[FRAMES] = frames;
  }

  frame(i) { return new Rectangle(...this[FRAMES][i]); }
};

export { TexturePage };
export default TexturePage;
