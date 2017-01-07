'use strict';

import Sound from './sound';

const [SOURCES, AUDIOCONTEXT] = [Symbol(), Symbol()];

class SoundManager {
  [AUDIOCONTEXT] = new (AudioContext || webkitAudioContext) ();
  [SOURCES] = null;

  constructor(sources) {
    this[SOURCES] = sources;
  }

  sound(name) {
    // load the sound or something I guess?
    let sound = this[SOURCES][name];
    if(!sound) {
      throw `No sound called ${name} exists`;
    }
    if(typeof sound === 'string') {
      sound = this[SOURCES][name] = new Sound(this[AUDIOCONTEXT], sound);
    }
    return sound;
  }
}

export default SoundManager;
