'use strict';

const [SOUND] = [Symbol()];

// a Sound holds an instantiated sound which can be played, stopped, and modified
// at will
class Sound {
  [SOUND] = null;

  initialize() {

  }
}

export { SoundMap };
export default SoundMap;
