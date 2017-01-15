'use strict';

import Drawable from './drawable';
import Collider from './collider';
import TileMap from './tile-map';
import loadJSON from './load-json';
import { Dimension } from './struct';
import { PERSISTENT, PAGES, TILEMAP, SOUNDS, MUSIC } from './const';

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
      const sounds = this.constructor[SOUNDS] || [];
      const music = this.constructor[MUSIC] || [];
      if(this.constructor[TILEMAP]) {
        const url = this[ENGINE].constructor[TILEMAP][this.constructor[TILEMAP]];
        if(!url) { throw `TileMap ${this.constructor[TILEMAP]} does not exist`; }
        tm = await loadJSON(url);
        pages.push(...tm.meta.pages.map(({name}) => name));
      }
      const txload = this[ENGINE].texture.load(pages);
      const sndload = this[ENGINE].sound.loadSound(sounds);
      const musload = this[ENGINE].sound.loadMusic(music);
      await Promise.all([txload, sndload, musload]);
      if(tm) {
        this[TILEMAP] = new TileMap(this[ENGINE].texture, tm);
      }
    })();
  }

  destructor() {
    let tm = null;
    const pages = this.constructor[PAGES] || [];
    const sounds = this.constructor[SOUNDS] || [];
    const music = this.constructor[MUSIC] || [];
    if(this[TILEMAP]) {
      pages.push(...this[TILEMAP].pages);
    }
    this[ENGINE].texture.purge(pages);
    this[ENGINE].sound.purgeSound(sounds);
    this[ENGINE].sound.purgeMusic(music);
  }

  // utilities
  // TODO: reduce duplication of GameObject#game
  // TODO: remember what ^ meant
  get game() {
    return new Proxy(this[ENGINE], {
      get(target, prop) {
        return target.util[prop];
      }
    });
  }

  get size() {
    if(this[TILEMAP]) {
      return this[TILEMAP].size;
    } else {
      return new Dimension(Infinity, Infinity)
    }
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

  // finds all objects of a type in this room
  find(Obj) {
    return [].concat(this[OBJECTS].filter(o => o instanceof Obj), this[ENGINE].find(Obj));
  }

  // draw this room
  draw(draw) {
    for(let obj of this[OBJECTS]) {
      obj instanceof Drawable && obj.draw(draw);
    }
    this[TILEMAP] && this[TILEMAP].draw(draw);
  }

  // check if there is a collision in this room
  collides(where, what = 'any') {
    if(what === 'room' || what === 'any') {
      if(this[TILEMAP] && this[TILEMAP].collides(where)) {
        return true;
      }
    }
    if(what !== 'room') {
      what = what === 'any'
        ? this[OBJECTS].filter(o => o instanceof Collider)
        : this[OBJECTS].filter(o => o instanceof what);
      for(let it of what) {
        if(it.collides(where)) {
          return true;
        }
      }
    }
    return false;
  }
}

export { Room };
export default Room;
