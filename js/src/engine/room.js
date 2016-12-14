'use strict';

import Drawable from './drawable';
import TileMap from './tile-map';
import loadJSON from './load-json';
import { PERSISTENT, PAGES, TILEMAP } from './const';

const [OBJECTS, ENGINE, LOADED] = [Symbol(), Symbol(), Symbol()];

class Room {
  [OBJECTS] = [];
  [LOADED] = new Promise(() => {});
  [TILEMAP] = null;

  constructor(engine) {
    this[ENGINE] = engine;
    this[LOADED] = (async () => {
      let tm = null;
      const pages = this.constructor[PAGES] || [];
      if(this.constructor[TILEMAP]) {
        const url = this[ENGINE].constructor[TILEMAP][this.constructor[TILEMAP]];
        if(!url) { throw `TileMap ${this.constructor[TILEMAP]} does not exist`; }
        tm = await loadJSON(url);
        pages.push(...tm.meta.pages.map(({name}) => name));
      }
      await this[ENGINE].texture.load(new Set(pages));
      this[ENGINE].texture.purge();
      if(tm) {
        this[TILEMAP] = new TileMap(this[ENGINE].texture, tm);
      }
    })();
  }

  // resolves when all required resources for the room have loaded
  // HACK: internalize
  get loaded() {
    return this[LOADED];
  }

  // run when the room starts loading
  load() {}
  // run at the start of the room (after loading)
  start() {}
  // trigger an event for each object in the room
  // HACK: internalize
  proc(event) {
    for(let obj of this[OBJECTS]) {
      obj.proc(event);
    }
  }
  // run at the end of the room
  end() {}

  // create an object in this room
  spawn(Obj, ...args) {
    if(Obj[PERSISTENT]) { return this[ENGINE].spawn(Obj, ...args); }
    const o = new Obj(this[ENGINE]);
    o.init(...args);
    this[OBJECTS].push(o);
    return o;
  }

  // destroy an object in this room
  destroy(obj) {
    if(typeof obj === 'function') {
      this[OBJECTS].filter(o => !(o instanceof obj));
      this[ENGINE].destroy(obj);
    } else {
      const i = this[OBJECTS].indexOf(obj);
      if(i >= 0) {
        this[OBJECTS].splice(i, 1);
      } else {
        this[ENGINE].destroy(obj);
      }
    }
  }

  // draw this room
  // HACK: internalize
  draw(draw) {
    for(let obj of this[OBJECTS]) {
      obj instanceof Drawable && obj.draw(draw);
    }
    this[TILEMAP] && this[TILEMAP].draw(draw);
  }
}

export { Room };
export default Room;
