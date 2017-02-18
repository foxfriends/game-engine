'use strict';

export const [
  // decorator properties
  SPRITE, PAGES, MUSIC, SOUNDS, FONTS, PERSISTENT, TILEMAP, LOADED,
  // main engine methods
  ROOMS, OBJECTS, RAF, CANVAS, CONTEXT, INPUT, TEXTURE_MANAGER, SOUND_MANAGER, VIEWS, PROC
] = function*() { for(;;) yield Symbol(); } ()
