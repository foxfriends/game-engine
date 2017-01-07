'use strict';

const [CONTEXT, RESOLVE, REJECT, NODES] = [Symbol(), Symbol(), Symbol(), Symbol()];

class PlayingSound extends Promise {
  constructor(context, nodes) {
    let res, rej;
    super((resolve, reject) => {
      res = resolve;
      rej = reject;
      if(nodes.source) {
        nodes.source.addEventListener('ended', () => {
          resolve();
          this[RESOLVE] = this[REJECT] = () => {};
        });
      }
    });
    this[RESOLVE] = res;
    this[REJECT] = rej;
    this[CONTEXT] = context;
    this[NODES] = nodes;
  }

  stop() {
    this[REJECT]();
    this[NODES].source && this[NODES].stop();
  }
}

export default PlayingSound;
