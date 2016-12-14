'use strict';

class GameEvent {
  constructor(type, ...data) {
    this.type = type;
    this.data = data;
  }
}

export default GameEvent;
