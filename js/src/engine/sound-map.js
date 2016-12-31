'use strict';

import Sound from './sound';

const [AUDIO] = [Symbol()];

class SoundMap {
  [AUDIO] = null;
  [SOUNDS] = {};

  constructor(url) {
    this[LOADED] = (async () => {
      const json = await loadJSON(url);
      this[AUDIO] = new Audio(json.file);
      this[SOUNDS] = json.sounds;
      await new Promise(resolve => this[AUDIO].addEventListener('load', resolve));
    })();
  }

  get loaded() {
    return this[LOADED];
  }

  make(sound) {
    if(this[SOUNDS].hasOwnProperty(sound)) {
      return new Sound(this[AUDIO], this[SOUNDS][sound].start, this[SOUNDS][sound].end);
    }
  }
}

export default SoundMap;
