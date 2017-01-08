'use strict';

import { Dimension, Rectangle } from './struct';
const [COLLISIONS, IMAGES, LOADED, PAGES] = [Symbol(), Symbol(), Symbol(), Symbol()];

// a TileMap provides an efficient way to store and render a static tile map
// and also calculate wall collisions quickly
class TileMap {
  [IMAGES] = [];
  [COLLISIONS] = [];
  [PAGES] = [];

  constructor(tm, {meta, images, collisions}) {
    this[PAGES] = meta.pages;
    this.tw = meta.tw;
    this.th = meta.th;
    const tile = (n) => {
      for(let page of meta.pages) {
        if(page.min <= n && n < page.max) {
          n -= page.min;
          const tp = tm.pages[page.name];
          if(!tp) { return null; }
          const src = new Rectangle(this.tw * (n % (tp.width / this.tw)), this.th * Math.floor(n / (tp.width / this.tw)), this.tw, this.th);
          return [tp, src];
        }
      }
    }
    for(let depth of Object.keys(images)) {
      const dest = new Rectangle(0, 0, this.tw, this.th);
      const layer = document.createElement('CANVAS');
      layer.width = images[depth][0].length * this.tw;
      layer.height = images[depth].length * this.th;
      const ctx = layer.getContext('2d');
      this[IMAGES].push([+depth, layer]);
      for(let row of images[depth]) {
        for(let n of row) {
          const t = tile(+n);
          if(t) {
            const [tp, src] = t;
            ctx.drawImage(tp, ...src, ...dest);
          }
          dest.x += this.tw;
        }
        dest.x = 0;
        dest.y += this.th;
      }
    }
    this[COLLISIONS] = collisions.map(l => l.split('').map(i => !!+i));
  }

  get pages() {
    return this[PAGES].map(({name}) => name);
  }

  get size() {
    return new Dimension(this.tw * this[COLLISIONS][0].length, this.th * this[COLLISIONS].length);
  }

  // copy the tile map to the main canvas
  draw(draw) {
    for(let [depth, image] of this[IMAGES]) {
      draw.image(image, [0, 0, image.width, image.height], [0, 0, image.width, image.height], depth);
    }
  }

  // check if a given Rectangle collides with the collision map
  collides(box) {
    box = [...box];
    box[2] = Math.ceil((box[0] + box[2]) / this.tw);
    box[3] = Math.ceil((box[1] + box[3]) / this.th);
    box[0] = Math.floor(box[0] / this.tw);
    box[1] = Math.floor(box[1] / this.th);
    for(let i = box[0]; i < box[2]; ++i) {
      for(let j = box[1]; j < box[3]; ++j) {
        if(this[COLLISIONS][j] && this[COLLISIONS][j][i]) { return true; }
      }
    }
    return false;
  }
}

export default TileMap;
