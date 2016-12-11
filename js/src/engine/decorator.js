'use strict';

// @override methods must have a superclass method they are overriding
function override(target, prop, descriptor) {
  const pr = Object.getPrototypeOf(target);
  if(!pr[prop]) { throw `${target.constructor.name}.${prop} marked override but does not override anything`; }
}

export { override };
