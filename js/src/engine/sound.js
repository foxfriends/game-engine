'use strict';

import PlayingSound from './playing-sound';

const [SOUND, SRC, VOLUME, CONTEXT, LOADED, NAME] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

function loadSound(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.addEventListener('load', () => {
      resolve(req.response);
    });
    req.send();
  });
}

// a Sound holds an instantiated sound which can be played, stopped, and modified
// at will
class Sound {
  [NAME] = '';
  [SOUND] = null;
  [VOLUME] = 1;
  [LOADED] = Promise.resolve();

  constructor(context, url, name) {
    this[NAME] = name;
    this[CONTEXT] = context;
    this[LOADED] = (async () => {
      const data = await loadSound(url);
      this[SOUND] = await new Promise(resolve => context.decodeAudioData(data, resolve));
    }) ();
  }

  get name() { return this[NAME]; }

  get loaded() {
    return this[LOADED];
  }

  // plays the sound. returns a PlayingSound promise
  play() {
    const source = this[CONTEXT].createBufferSource();
    source.buffer = this[SOUND];
    const gain = this[CONTEXT].createGain();
    gain.gain.value = this[VOLUME];
    gain.connect(this[CONTEXT].destination);
    source.connect(gain);
    source.start(0);
    return new PlayingSound(this[CONTEXT], { source, gain }, this[NAME]);
  }

  // the volume that a new instance of this sound will play at
  get volume() { return this[VOLUME]; }
  set volume(amt) { this[VOLUME] = amt; }
}

export default Sound;
