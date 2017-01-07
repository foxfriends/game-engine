'use strict';

import PlayingSound from './playing-sound';

const [SOUND, SRC, VOLUME, CONTEXT] = [Symbol(), Symbol(), Symbol(), Symbol()];

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
// TODO: improve the sound system to use audio context
class Sound {
  [SOUND] = null;
  [VOLUME] = 1;

  constructor(context, url) {
    this[CONTEXT] = context;
    (async () => {
      const data = await loadSound(url);
      this[SOUND] = await new Promise(resolve => context.decodeAudioData(data, resolve));
    }) ();
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
    return new PlayingSound(this[CONTEXT], { source, gain });
  }

  // the volume that a new instance of this sound will play at
  get volume() { return this[VOLUME]; }
  set volume(amt) { this[VOLUME] = amt; }
}

export default Sound;
