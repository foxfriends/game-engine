'use strict';

import { SPRITE, PAGES, TILEMAP, PERSISTENT } from './const';

// @override methods must have a superclass method they are overriding
function override(target, prop, descriptor) {
  const pr = Object.getPrototypeOf(target);
  if(!pr[prop]) { throw `${target.constructor.name}.${prop} marked override but does not override anything`; }
}

// @persistent GameObjects are contained by the game and exist outside of rooms
function persistent(target) {
  Object.defineProperty(target, PERSISTENT, { value: true });
}

// @texturepages defines the texture page mapping used by the game { [name] : 'url' }
function texturepages(map) {
  return function(target) { Object.defineProperty(target, PAGES, { value: map }); };
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

// @tilemap defines the layout of the static background and collision tiles in a room
function tilemaps(map) {
  return function(target) { Object.defineProperty(target, TILEMAP, { value: map }) ; };
}


export { override, persistent, texturepage, texturepages, sprite, tilemap, tilemaps };
