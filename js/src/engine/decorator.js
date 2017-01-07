'use strict';

import path from 'path';
import loadJSON from './load-json';
import { LOADED, SPRITE, PAGES, FONTS, SOUNDS, MUSIC, TILEMAP, PERSISTENT } from './const';

// @override methods must have a superclass method they are overriding
function override(target, prop, descriptor) {
  const pr = Object.getPrototypeOf(target);
  if(!(prop in pr)) { throw `${target.constructor.name}.${prop} marked override but does not override anything`; }
}

// @persistent GameObjects are contained by the game and exist outside of rooms
function persistent(target) {
  Object.defineProperty(target, PERSISTENT, { value: true });
}

// @texturepage lists texture pages required by a room
function texturepage(...names) {
  return function(target) { Object.defineProperty(target, PAGES, { value: names }); };
}

// @sprite names the initial sprite for this Object
function sprite(name) {
  return function(target) { Object.defineProperty(target, SPRITE, { value: name }); };
}

// @tilemap defines the layout of the static background and collision tiles in a room
function tilemap(name) {
  return function(target) { Object.defineProperty(target, TILEMAP, { value: name }) ; };
}

// @music names the music resources that are needed for this room
function music(...names) {
  return function(target) { Object.defineProperty(target, MUSIC, { value: names }) ; };
}

// @sound names the sound resources that should be preloaded for this room
function sound(...names) {
  return function(target) { Object.defineProperty(target, SOUNDS, { value: names }) ; };
}

// @config takes a configuration object
function config(dir, cfg) {
  for(let key of Object.keys(cfg)) {
    for(let item of Object.keys(cfg[key])) {
      if(typeof cfg[key][item] === 'string') {
        cfg[key][item] = path.resolve(dir, cfg[key][item]);
      } else {
        cfg[key][item][0] = path.relative(dir, cfg[key][item][0]);
      }
    }
  }
  return function(target) {
    Object.defineProperty(target, PAGES, { value: cfg['texture-pages'] });
    Object.defineProperty(target, TILEMAP, { value: cfg['tile-maps'] });
    Object.defineProperty(target, FONTS, { value: cfg['fonts'] });
    Object.defineProperty(target, SOUNDS, { value: cfg['sounds'] });
    Object.defineProperty(target, MUSIC, { value: cfg['music'] });
  }
}

export { override, persistent, texturepage, sprite, tilemap, config, music, sound };
