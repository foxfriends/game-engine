'use strict';

import { Rectangle } from './struct';
const [COLLISIONS, IMAGES, LOADED] = [Symbol(), Symbol(), Symbol()];

// a TileMap provides an efficient way to store and render a static tile map
// and also calculate wall collisions quickly
class TileMap {
  [IMAGES] = [];
  [COLLISIONS] = [];

  constructor(tm, {meta, images, collisions}) {
    this.tw = meta.tw;
    this.th = meta.th;
    const tile = (n) => {
      for(let page of meta.pages) {
        if(page.min <= n && n < page.max) {
          n -= page.min;
          const tp = tm.pages[page.name];
          const src = new Rectangle(this.tw * (n % (tp.width / this.tw)), this.th * Math.floor(n / (tp.width / this.tw)), this.tw, this.th);
          return [tp, src];
        }
      }
    }
    const dest = new Rectangle(0, 0, this.tw, this.th);
    for(let depth of Object.keys(images)) {
      const layer = document.createElement('CANVAS');
      layer.width = images[depth][0].length * this.tw;
      layer.height = images[depth].length * this.th;
      const ctx = layer.getContext('2d');
      this[IMAGES].push([+depth, layer]);
      for(let row of images[depth]) {
        for(let n of row) {
          const [tp, src] = tile(+n);
          ctx.drawImage(tp, ...src, ...dest);
          dest.x += this.tw;
        }
        dest.x = 0;
        dest.y += this.th;
      }
    }
    this[COLLISIONS] = collisions.map(l => l.split('').map(i => !!+i));
  }

  // copy the tile map to the main canvas
  draw(draw) {
    for(let [depth, image] of this[IMAGES]) {
      draw.image(image, [0, 0, image.width, image.height], [0, 0, image.width, image.height], depth);
    }
  }

  // check if a given Rectangle collides with the collision map
  collision({x, y, w, h}) {

  }
}

export default TileMap;
