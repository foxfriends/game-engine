'use strict';

const [CONTEXT, RESOLVE, REJECT, NODES, NAME] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class PlayingSound extends Promise {
  constructor(context, nodes, name) {
    if(typeof context === 'function') {
      super(context);
      return;
    }
    let res, rej;
    super((resolve, reject) => {
      res = resolve;
      rej = reject;
      if(nodes.source) {
        nodes.source.addEventListener('ended', () => {
          this[RESOLVE]();
        });
      }
    });
    const cancel = () => {
      nodes.source.removeEventListener('ended', this[RESOLVE]);
      this[RESOLVE] = this[REJECT] = () => {};
    };
    this.then(cancel, cancel);
    this[RESOLVE] = res;
    this[REJECT] = rej;
    this[CONTEXT] = context;
    this[NODES] = nodes;
    this[NAME] = name;
  }

  get name() { return this[NAME]; }

  stop() {
    this[REJECT]();
    this[NODES].source && this[NODES].source.stop();
  }
}

export default PlayingSound;
