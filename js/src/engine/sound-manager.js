'use strict';

import Sound from './sound';
import SoundMap from './sound-map';
const [CONTEXT, SOUNDMAPS, SOURCES] = [Symbol(), Symbol(), Symbol()];

class SoundManager {
  // NOTE: make this nice when Safari stops sucking
  [CONTEXT] = new (window.AudioContext() || window.webkitAudioContext)();
  [SOUNDMAPS] = [];
  [SOURCES] = {};
  old = [];

  initialize() {

  }

  load(maps) {
    const loaded = [];
    for(let map of maps) {
      if(this[SOUNDMAPS][map]) { continue; }
      // NOTE: Does this need a soundmap class? I think yes...
      this[SOUNDMAPS][map] = new SoundMap(this[SOURCES][map]);
      loaded.push(this[SOUNDMAPS][map].loaded);
    }
    return Promise.all(loaded);
  }

  purge(maps = this[OLD]) {
    for(let map of maps) {
      delete this[SOUNDMAPS][map];
    }
  }

  get(name) {
    if(!this[SOURCES][name]) {
      throw `No sound called ${name} exists`;
    }
    const sound = new Audio(this[SOURCES][name]);
    const src = this[CONTEXT].createMediaElementSource(sound);
    // TODO: add options or something
    src.connect(this[CONTEXT].destination);
    src.start(0); // TODO: start soundmaps at offsets
  }
}

export default SoundManager;
