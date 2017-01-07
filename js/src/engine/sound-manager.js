'use strict';

import Sound from './sound';

const [SOURCES, AUDIOCONTEXT, UNLOAD, LOAD, CURRENT_MUSIC] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class SoundManager {
  [AUDIOCONTEXT] = new (AudioContext || webkitAudioContext) ();
  [SOURCES] = null;
  [CURRENT_MUSIC] = null;

  constructor(sound, music) {
    this[SOURCES] = { sound, music };
  }

  sound(name) {
    this.loadSound([name]);
    return this[SOURCES].sound[name];
  }

  music(name) {
    if(this[CURRENT_MUSIC] && this[CURRENT_MUSIC].name === name) { return; }
    this.loadMusic([name]);
    if(this[CURRENT_MUSIC]) { this[CURRENT_MUSIC].stop(); }
    this[CURRENT_MUSIC] = this[SOURCES].music[name].play();
    this[CURRENT_MUSIC].then(() => {
      this[CURRENT_MUSIC] = null;
      this.music(name);
    });
  }

  [LOAD](type, name) {
    let sound = this[SOURCES][type][name];
    if(!sound) {
      throw `No ${type} called ${name} exists`;
    }
    if(typeof sound === 'string') {
      this[SOURCES][type][name] = new Sound(this[AUDIOCONTEXT], sound, name);
    }
    return this[SOURCES][type][name].loaded;
  }

  [UNLOAD](type, name) {
    if(this[SOURCES][type][name]) {
      this[SOURCES][type][name] = this[SOURCES][type][name].url;
    }
  }

  loadSound(names) {
    return Promise.all([...names].map((name) => this[LOAD]('sound', name)));
  }

  unloadSound(names) {
    for(let name of names) { this[UNLOAD]('sound', name); }
  }

  loadMusic(names) {
    return Promise.all([...names].map((name) => this[LOAD]('music', name)));
  }

  unloadMusic(names) {
    for(let name of names) { this[UNLOAD]('music', name); }
  }
}

export default SoundManager;
