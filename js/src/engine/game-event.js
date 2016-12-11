'use strict';

class GameEvent {
  constructor(type, data = null) {
    this.type = type;
    this.data = data;
  }
}

export default GameEvent;
