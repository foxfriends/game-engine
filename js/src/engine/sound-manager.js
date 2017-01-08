'use strict';

import Sound from './sound';

const [SOURCES, AUDIOCONTEXT, PURGE, LOAD, CURRENT_MUSIC, REFERENCES] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class SoundManager {
  [AUDIOCONTEXT] = new (AudioContext || webkitAudioContext) ();
  [SOURCES] = { sound: null, music: null };
  [CURRENT_MUSIC] = null;
  [REFERENCES] = { sound: new WeakMap(), music: new WeakMap() };

  constructor(sound, music) {
    this[SOURCES] = { sound, music };
  }

  sound(name) {
    const t = this[SOURCES].sound[name];
    if(t instanceof Sound) {
      return t;
    }
    throw `Sound ${name} was not loaded in this room`;
  }

  music(name) {
    if(this[CURRENT_MUSIC] && this[CURRENT_MUSIC].name === name) { return; }
    if(this[CURRENT_MUSIC]) { this[CURRENT_MUSIC].stop(); }
    if(!(this[SOURCES].music[name] instanceof Sound)) { throw `Music ${name} was not loaded in this room`; }
    this[CURRENT_MUSIC] = this[SOURCES].music[name].play();
    this[CURRENT_MUSIC].then(() => {
      this[CURRENT_MUSIC] = null;
      this.music(name);
    }, () => {});
  }

  stopMusic() {
    this[CURRENT_MUSIC] && this[CURRENT_MUSIC].stop();
    this[CURRENT_MUSIC] = null;
  }

  [LOAD](type, name) {
    let sound = this[SOURCES][type][name];
    if(!sound) {
      throw `No ${type} called ${name} exists`;
    }
    if(typeof sound === 'string') {
      this[SOURCES][type][name] = new Sound(this[AUDIOCONTEXT], sound, name);
    }
    this[REFERENCES][type].set(
      this[SOURCES][type][name],
      (this[REFERENCES][type].get(this[SOURCES][type][name]) || 0) + 1
    );
    return this[SOURCES][type][name].loaded;
  }

  [PURGE](type, name) {
    if(this[SOURCES][type][name] instanceof Sound) {
      this[REFERENCES][type].set(
        this[SOURCES][type][name],
        this[REFERENCES][type].get(this[SOURCES][type][name]) - 1
      );
      if(!this[REFERENCES][type].get(this[SOURCES][type][name])) {
        this[SOURCES][type][name] = this[SOURCES][type][name].url;
      }
    }
  }

  loadSound(names) {
    names = new Set(names);
    const pr = [];
    for(let name of names) {
      pr.push(this[LOAD]('sound', name));
    }
    return Promise.all(pr);
  }

  purgeSound(names = []) {
    for(let name of names) {
      this[PURGE]('sound', name);
    }
  }

  loadMusic(names) {
    names = new Set(names);
    const pr = [];
    for(let name of names) {
      pr.push(this[LOAD]('music', name));
    }
    return Promise.all(pr);
  }

  purgeMusic(names = []) {
    for(let name of names) {
      this[PURGE]('music', name);
      if(this[CURRENT_MUSIC] && this[CURRENT_MUSIC].name === name && !(this[SOURCES].music[name] instanceof Sound)) {
        this.stopMusic();
      }
    }
  }
}

export default SoundManager;
