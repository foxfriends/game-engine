module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 47);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Position; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return Dimension; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return Rectangle; });


let Position = class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  *[Symbol.iterator]() {
    yield* [this.x, this.y];
  }

  static add(l, r) {
    return new Position(l.x + r.x, l.y + r.y);
  }
};
let Dimension = class Dimension {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }

  static infinite() {
    return new Dimension(Infinity, Infinity);
  }

  *[Symbol.iterator]() {
    yield* [this.w, this.h];
  }
};
let Rectangle = class Rectangle {
  constructor(x, y, w, h) {
    if (w === undefined) {
      [w, h] = y;
      [x, y] = x;
    }
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  static shift(rect, amt) {
    return new Rectangle(rect.x + amt.x, rect.y + amt.y, rect.w, rect.h);
  }
  *[Symbol.iterator]() {
    yield* [this.x, this.y, this.w, this.h];
  }
};
;



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* unused harmony export LOADED */
/* harmony export (binding) */ __webpack_require__.d(exports, "f", function() { return SPRITE; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return SOUNDS; });
/* harmony export (binding) */ __webpack_require__.d(exports, "g", function() { return FONTS; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return PAGES; });
/* harmony export (binding) */ __webpack_require__.d(exports, "e", function() { return PERSISTENT; });
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return TILEMAP; });
/* harmony export (binding) */ __webpack_require__.d(exports, "d", function() { return MUSIC; });


const [SPRITE, PAGES, MUSIC, SOUNDS, FONTS, PERSISTENT, TILEMAP, LOADED] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__struct__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Collider; });




function Collider(bbox) {
  return function (Base = class {}) {
    return class extends Base {
      get position() {
        if (this.sprite) {
          return new __WEBPACK_IMPORTED_MODULE_0__struct__["a" /* Position */](this.sprite.x, this.sprite.y);
        } else {
          throw `${ this.constructor.name }'s position value cannot be inferred. Please implement '@override get position(): Position'`;
        }
      }
      // get the collision box for this object
      get bbox() {
        return bbox;
      }
      // actually for check a collision
      collides(where) {
        return Math.abs(where.x + where.w / 2 - (this.bbox.x + this.position.x + this.bbox.w / 2)) < (where.w + this.bbox.w) / 2 && Math.abs(where.y + where.h / 2 - (this.bbox.y + this.position.y + this.bbox.h / 2)) < (where.h + this.bbox.h) / 2;
      }
    };
  };
}

Object.defineProperty(Collider, Symbol.hasInstance, {
  value(instance) {
    return typeof instance.collides === 'function' && instance.position instanceof __WEBPACK_IMPORTED_MODULE_0__struct__["a" /* Position */] && instance.bbox instanceof __WEBPACK_IMPORTED_MODULE_0__struct__["c" /* Rectangle */];
  }
});


/* harmony default export */ exports["b"] = Collider;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__const__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Drawable; });



const [SPRITE, ENGINE] = [Symbol(), Symbol()];

function Drawable(Base = class {}) {
  return class extends Base {
    constructor(engine) {
      super(engine);
      this[SPRITE] = null;
      this[ENGINE] = null;
      this[ENGINE] = engine;
      if (this.constructor[__WEBPACK_IMPORTED_MODULE_0__const__["f" /* SPRITE */]]) {
        this.sprite = this.constructor[__WEBPACK_IMPORTED_MODULE_0__const__["f" /* SPRITE */]];
      }
    }
    // draw this thing using a Draw (./draw.js)

    // TODO: implement some sort of internal symbol sharing to reduce duplicated symbol names
    draw(draw) {
      draw.self();
    }

    get sprite() {
      return this[SPRITE];
    }
    set sprite(sprite) {
      if (this[SPRITE] && this[SPRITE].name === sprite) {
        return;
      }
      const { x, y } = this[SPRITE] || { x: 0, y: 0 };
      this[SPRITE] = sprite ? this[ENGINE].texture.sprite(sprite) : null;
      this[SPRITE].x = x;
      this[SPRITE].y = y;
    }
  };
}

Object.defineProperty(Drawable, Symbol.hasInstance, {
  value(instance) {
    // TODO: should this not be duck typed?
    return typeof instance.draw === 'function';
  }
});


/* harmony default export */ exports["b"] = Drawable;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


function loadJSON(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
      try {
        const data = JSON.parse(req.responseText);
        resolve(data);
      } catch (error) {
        reject(`Invalid JSON received from ${ url }`);
      }
    });
    req.send();
  });
}

/* harmony default export */ exports["a"] = loadJSON;

/***/ },
/* 5 */
/***/ function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(14)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 7 */
/***/ function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__drawable__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__collider__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tile_map__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__load_json__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__struct__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__const__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Room; });


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }








const [OBJECTS, ENGINE, LOADED] = [Symbol(), Symbol(), Symbol()];

let Room = class Room {

  constructor(engine) {
    var _this = this;

    this[OBJECTS] = [];
    this[LOADED] = new Promise(() => {});
    this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]] = null;

    this[ENGINE] = engine;
    this[LOADED] = _asyncToGenerator(function* () {
      let tm = null;
      const pages = _this.constructor[__WEBPACK_IMPORTED_MODULE_5__const__["b" /* PAGES */]] || [];
      const sounds = _this.constructor[__WEBPACK_IMPORTED_MODULE_5__const__["c" /* SOUNDS */]] || [];
      const music = _this.constructor[__WEBPACK_IMPORTED_MODULE_5__const__["d" /* MUSIC */]] || [];
      if (_this.constructor[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]]) {
        const url = _this[ENGINE].constructor[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]][_this.constructor[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]]];
        if (!url) {
          throw `TileMap ${ _this.constructor[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]] } does not exist`;
        }
        tm = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__load_json__["a" /* default */])(url);
        pages.push(...tm.meta.pages.map(function ({ name }) {
          return name;
        }));
      }
      const txload = _this[ENGINE].texture.load(pages);
      const sndload = _this[ENGINE].sound.loadSound(sounds);
      const musload = _this[ENGINE].sound.loadMusic(music);
      yield Promise.all([txload, sndload, musload]);
      if (tm) {
        _this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]] = new __WEBPACK_IMPORTED_MODULE_2__tile_map__["a" /* default */](_this[ENGINE].texture, tm);
      }
    })();
  }

  destructor() {
    let tm = null;
    const pages = this.constructor[__WEBPACK_IMPORTED_MODULE_5__const__["b" /* PAGES */]] || [];
    const sounds = this.constructor[__WEBPACK_IMPORTED_MODULE_5__const__["c" /* SOUNDS */]] || [];
    const music = this.constructor[__WEBPACK_IMPORTED_MODULE_5__const__["d" /* MUSIC */]] || [];
    if (this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]]) {
      pages.push(...this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]].pages);
    }
    this[ENGINE].texture.purge(pages);
    this[ENGINE].sound.purgeSound(sounds);
    this[ENGINE].sound.purgeMusic(music);
  }

  // utilities
  // TODO: reduce duplication of GameObject#game
  // TODO: remember what ^ meant
  get game() {
    return new Proxy(this[ENGINE], {
      get(target, prop) {
        return target.util[prop];
      }
    });
  }

  get size() {
    if (this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]]) {
      return this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]].size;
    } else {
      return new __WEBPACK_IMPORTED_MODULE_4__struct__["b" /* Dimension */](Infinity, Infinity);
    }
  }

  // resolves when all required resources for the room have loaded
  // HACK: internalize
  get loaded() {
    return this[LOADED];
  }

  // run when the room starts loading
  load() {}
  // run at the start of the room (after loading)
  start() {}
  // trigger an event for each object in the room
  proc(event) {
    for (let obj of this[OBJECTS]) {
      obj.proc(event);
    }
  }
  // run at the end of the room
  end() {}

  // create an object in this room
  spawn(Obj, ...args) {
    if (Obj[__WEBPACK_IMPORTED_MODULE_5__const__["e" /* PERSISTENT */]]) {
      return this[ENGINE].spawn(Obj, ...args);
    }
    const o = new Obj(this[ENGINE]);
    o.init(...args);
    this[OBJECTS].push(o);
    return o;
  }

  // destroy an object in this room
  destroy(obj) {
    if (typeof obj === 'function') {
      this[OBJECTS].filter(o => !(o instanceof obj));
      this[ENGINE].destroy(obj);
    } else {
      const i = this[OBJECTS].indexOf(obj);
      if (i >= 0) {
        this[OBJECTS].splice(i, 1);
      } else {
        this[ENGINE].destroy(obj);
      }
    }
  }

  // finds all objects of a type in this room
  find(Obj) {
    return [].concat(this[OBJECTS].filter(o => o instanceof Obj), this[ENGINE].find(Obj));
  }

  // draw this room
  draw(draw) {
    for (let obj of this[OBJECTS]) {
      obj instanceof __WEBPACK_IMPORTED_MODULE_0__drawable__["b" /* default */] && obj.draw(draw);
    }
    draw.alpha(1);
    this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]] && this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]].draw(draw);
  }

  // check if there is a collision in this room
  collides(where, what = 'any') {
    if (what === 'room' || what === 'any') {
      if (this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]] && this[__WEBPACK_IMPORTED_MODULE_5__const__["a" /* TILEMAP */]].collides(where)) {
        return true;
      }
    }
    if (what !== 'room') {
      what = what === 'any' ? this[OBJECTS].filter(o => o instanceof __WEBPACK_IMPORTED_MODULE_1__collider__["b" /* default */]) : this[OBJECTS].filter(o => o instanceof what);
      for (let it of what) {
        if (it.collides(where)) {
          return true;
        }
      }
    }
    return false;
  }
};



/* harmony default export */ exports["b"] = Room;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__struct__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Sprite; });




const [PAGE, FRAMES, FRAME] = [Symbol(), Symbol(), Symbol()];

let Sprite = class Sprite extends __WEBPACK_IMPORTED_MODULE_0__struct__["c" /* Rectangle */] {
  constructor(page, frames, name) {
    super(...page.frame(frames[0]));
    this.name = name;
    this[PAGE] = page;
    this[FRAMES] = frames;
    this[FRAME] = 0;
  }

  // the current frame that this sprite is showing
  set frame(frame) {
    this[FRAME] = frame;
    if (this[FRAME] >= this[FRAMES].length) {
      this[FRAME] -= this[FRAMES].length;
    } else if (this[FRAME] < 0) {
      this[FRAME] += this[FRAMES].length;
    }
  }
  get frame() {
    return this[FRAME];
  }

  // accessors for the drawing methods
  // HACK: internalize
  get texture() {
    return this[PAGE];
  }
  get src() {
    return this[PAGE].frame(this[FRAMES][Math.floor(this[FRAME])]);
  }
  get dest() {
    return [...this];
  }
};



/* harmony default export */ exports["b"] = Sprite;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__struct__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__load_json__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sprite__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_path__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return TexturePage; });


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }






const [FRAMES, SPRITES, LOADED] = [Symbol(), Symbol(), Symbol(), Symbol()];

let TexturePage = class TexturePage extends Image {

  constructor(url) {
    var _this;

    _this = super();
    this[FRAMES] = null;
    this[SPRITES] = null;
    this[LOADED] = new Promise(() => {});
    this[LOADED] = _asyncToGenerator(function* () {
      // make a texture page from the json
      const json = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__load_json__["a" /* default */])(url);
      _this.src = __WEBPACK_IMPORTED_MODULE_3_path___default.a.resolve(__WEBPACK_IMPORTED_MODULE_3_path___default.a.dirname(url), json.image);
      _this.width = json.width;
      _this.height = json.height;
      _this[FRAMES] = json.frames;
      _this[SPRITES] = json.sprites;
      yield new Promise(function (resolve) {
        return _this.addEventListener('load', resolve);
      });
    })();
  }

  get loaded() {
    return this[LOADED];
  }

  frame(i) {
    return new __WEBPACK_IMPORTED_MODULE_0__struct__["c" /* Rectangle */](...this[FRAMES][i]);
  }

  make(sprite) {
    if (this[SPRITES].hasOwnProperty(sprite)) {
      return new __WEBPACK_IMPORTED_MODULE_2__sprite__["b" /* default */](this, this[SPRITES][sprite], sprite);
    } else {
      return null;
    }
  }
};
;


/* harmony default export */ exports["b"] = TexturePage;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


let GameEvent = class GameEvent {
  constructor(type, ...data) {
    this.type = type;
    this.data = data;
  }
};


/* harmony default export */ exports["a"] = GameEvent;

/***/ },
/* 13 */
/***/ function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(37)
  , createDesc = __webpack_require__(38);
module.exports = __webpack_require__(6) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ },
/* 16 */
/***/ function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(46)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__load_json__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__const__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return override; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return sound; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return texturepage; });
/* harmony export (binding) */ __webpack_require__.d(exports, "d", function() { return sprite; });
/* harmony export (binding) */ __webpack_require__.d(exports, "e", function() { return tilemap; });
/* harmony export (binding) */ __webpack_require__.d(exports, "f", function() { return config; });
/* harmony export (binding) */ __webpack_require__.d(exports, "g", function() { return music; });
/* harmony export (binding) */ __webpack_require__.d(exports, "h", function() { return persistent; });






// @override methods must have a superclass method they are overriding
function override(target, prop, descriptor) {
  const pr = Object.getPrototypeOf(target);
  if (!(prop in pr)) {
    throw `${ target.constructor.name }.${ prop } marked override but does not override anything`;
  }
}

// @persistent GameObjects are contained by the game and exist outside of rooms
function persistent(target) {
  Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["e" /* PERSISTENT */], { value: true });
}

// @texturepage lists texture pages required by a room
function texturepage(...names) {
  return function (target) {
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["b" /* PAGES */], { value: names });
  };
}

// @sprite names the initial sprite for this Object
function sprite(name) {
  return function (target) {
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["f" /* SPRITE */], { value: name });
  };
}

// @tilemap defines the layout of the static background and collision tiles in a room
function tilemap(name) {
  return function (target) {
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["a" /* TILEMAP */], { value: name });
  };
}

// @music names the music resources that are needed for this room
function music(...names) {
  return function (target) {
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["d" /* MUSIC */], { value: names });
  };
}

// @sound names the sound resources that should be preloaded for this room
function sound(...names) {
  return function (target) {
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["c" /* SOUNDS */], { value: names });
  };
}

// @config takes a configuration object
function config(dir, cfg) {
  for (let key of Object.keys(cfg)) {
    for (let item of Object.keys(cfg[key])) {
      if (typeof cfg[key][item] === 'string') {
        cfg[key][item] = __WEBPACK_IMPORTED_MODULE_0_path___default.a.resolve(dir, cfg[key][item]);
      } else {
        cfg[key][item][0] = __WEBPACK_IMPORTED_MODULE_0_path___default.a.relative(dir, cfg[key][item][0]);
      }
    }
  }
  return function (target) {
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["b" /* PAGES */], { value: cfg['texture-pages'] });
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["a" /* TILEMAP */], { value: cfg['tile-maps'] });
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["g" /* FONTS */], { value: cfg['fonts'] });
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["c" /* SOUNDS */], { value: cfg['sounds'] });
    Object.defineProperty(target, __WEBPACK_IMPORTED_MODULE_2__const__["d" /* MUSIC */], { value: cfg['music'] });
  };
}



/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return GameObject; });


const [ENGINE] = [Symbol()];

let GameObject = class GameObject {
  constructor(engine) {
    this[ENGINE] = engine;
  }
  // initialize things on being created (use instead of constructor)
  init() {}

  // run before each room starts
  roomload(prev, next) {}
  // run at the beginning of each room
  roomstart(prev, next) {}
  // run at the beginning of the game
  gamestart() {}

  // run at the beginning of each frame
  stepstart() {}

  // react to various user inputs
  keydown(which) {}
  keyup(which) {}
  mousedown(which) {}
  mouseup(which) {}
  mousemove(where) {}

  // run once all inputs have been received
  step() {}
  // run after everything else
  stepend() {}

  // run at the end of each room
  roomend(prev, next) {}
  // run at the end of the game
  gameend() {}

  // trigger an event
  proc(event) {
    this[event.type] && this[event.type](...event.data);
  }

  // utilities
  // TODO: reduce duplication of Room#game
  get game() {
    return new Proxy(this[ENGINE], {
      get(target, prop) {
        return target.util[prop];
      }
    });
  }
};



/* unused harmony default export */ var _unused_webpack_default_export = GameObject;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__draw__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__struct__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__game_event__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__drawable__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__collider__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__room__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__input__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__texture_manager__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__sound_manager__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__const__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Engine; });


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }












// NOTE : maybe I should bring in that Symbolic thing...
const [ROOMS, OBJECTS, RAF, CANVAS, CONTEXT, INPUT, TEXTURE_MANAGER, SOUND_MANAGER, VIEWS] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

// TODO: rewrite everything to use private methods using out-of-class bound
//       functions and internal methods using shared symbols

let Engine = class Engine {

  constructor(canvas, { w, h }) {
    this[ROOMS] = [];
    this[OBJECTS] = [[]];
    this[RAF] = null;
    this[VIEWS] = [new __WEBPACK_IMPORTED_MODULE_1__struct__["c" /* Rectangle */](0, 0, 300, 150)];

    this[CANVAS] = document.querySelector(canvas);
    this[CANVAS].setAttribute('tabindex', 0);
    this[CANVAS].style.outline = 'none';
    this[CANVAS].width = w;
    this[CANVAS].height = h;
    this[VIEWS][0].w = w;
    this[VIEWS][0].h = h;
    this[CONTEXT] = this[CANVAS].getContext('2d');
    this[INPUT] = new __WEBPACK_IMPORTED_MODULE_6__input__["a" /* default */](this[CANVAS]);
    this[TEXTURE_MANAGER] = new __WEBPACK_IMPORTED_MODULE_7__texture_manager__["a" /* default */](this.constructor[__WEBPACK_IMPORTED_MODULE_9__const__["b" /* PAGES */]]);
    this[SOUND_MANAGER] = new __WEBPACK_IMPORTED_MODULE_8__sound_manager__["a" /* default */](this.constructor[__WEBPACK_IMPORTED_MODULE_9__const__["c" /* SOUNDS */]], this.constructor[__WEBPACK_IMPORTED_MODULE_9__const__["d" /* MUSIC */]]);
  }
  get size() {
    return new __WEBPACK_IMPORTED_MODULE_1__struct__["b" /* Dimension */](this[CANVAS].width, this[CANVAS].height);
  }

  // triggers the event for all objects currently active
  // HACK: internalize
  proc(event) {
    for (let obj of this[OBJECTS][0]) {
      obj.proc(event);
    }
    this[ROOMS][0] && this[ROOMS][0].proc(event);
  }

  // specifies how to start a game
  start() {}
  // processes all events for one frame
  // HACK: internalize
  step() {
    this.proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('stepstart'));
    for (let event of this[INPUT]) {
      this.proc(event);
    }
    this.proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('step'));
    this.proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('stepend'));
  }
  // refreshes the game screen
  // HACK: internalize
  draw() {
    this[CONTEXT].clearRect(0, 0, ...this.size);
    const drawer = new __WEBPACK_IMPORTED_MODULE_0__draw__["a" /* default */](this[CONTEXT]);
    // draw under layers first
    // IDEA: add some optimization options here for purely static layers
    //       we shouldn't need to re-draw every item individually if they
    //       haven't changed at all
    for (let i = this[ROOMS].length - 1; i > 0; --i) {
      drawer.view(this[VIEWS][i]);
      for (let obj of this[OBJECTS][i]) {
        obj instanceof __WEBPACK_IMPORTED_MODULE_3__drawable__["b" /* default */] && obj.draw(drawer.object(obj));
      }
      this[ROOMS][i] && this[ROOMS][i].draw(drawer);
      drawer.render();
    }
    drawer.view(this[VIEWS][0]);
    for (let obj of this[OBJECTS][0]) {
      obj instanceof __WEBPACK_IMPORTED_MODULE_3__drawable__["b" /* default */] && obj.draw(drawer.object(obj));
    }
    this[ROOMS][0] && this[ROOMS][0].draw(drawer);
    drawer.render();
  }
  // run at the end of a game
  end() {}

  // runs the game
  run() {
    let me = 0;
    const takeStep = () => {
      me = this[RAF];
      this.step();
      this.draw();
      if (this[RAF] === me) {
        // guard against the game being re-run by just stopping it.
        // NOTE: behaviour is undefined if there are still rooms/objects in the
        // game when it is re-run
        this[RAF] = window.requestAnimationFrame(takeStep);
      }
    };
    this.start();
    this.proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('gamestart'));
    this[RAF] = window.requestAnimationFrame(takeStep);
  }

  // spawns a persistent object
  // HACK: internalize
  spawn(Obj, ...args) {
    const o = new Obj(this);
    o.init(...args);
    this[OBJECTS][0].push(o);
    return o;
  }
  // destroys a persistent object
  // HACK: internalize
  destroy(obj) {
    if (typeof obj === 'function') {
      this[OBJECTS][0].filter(o => !(o instanceof obj));
    } else {
      const i = this[OBJECTS][0].indexOf(obj);
      if (i >= 0) {
        this[OBJECTS][0].splice(i, 1);
      }
    }
  }
  // finds a persistent object
  find(Obj) {
    return this[OBJECTS][0].filter(o => o instanceof Obj);
  }

  get texture() {
    return this[TEXTURE_MANAGER];
  }

  get sound() {
    return this[SOUND_MANAGER];
  }

  get layers() {
    return this[ROOMS].length;
  }

  // utilities - TODO: this should be put in another module
  get util() {
    return new GameUtility(this);
  }
};


const [ENGINE] = [Symbol()];

// TODO: move this into another module once the internal function sharing is set up
let GameUtility = class GameUtility {

  constructor(engine) {
    this[ENGINE] = null;

    this[ENGINE] = engine;
  }
  // get/set the view port, optionally constrained within the room
  // boundaries if possible, and with the entire room centred if not
  view(view, constrain = true) {
    if (view === undefined) {
      return this[ENGINE][VIEWS][0];
    }
    if (view instanceof __WEBPACK_IMPORTED_MODULE_1__struct__["a" /* Position */]) {
      view = new __WEBPACK_IMPORTED_MODULE_1__struct__["c" /* Rectangle */](view.x - this[ENGINE][VIEWS][0].w / 2, view.y - this[ENGINE][VIEWS][0].h / 2, this[ENGINE][VIEWS][0].w, this[ENGINE][VIEWS][0].h);
    }
    if (constrain) {
      const { w, h } = this[ENGINE][ROOMS][0].size;
      const [r, b] = [view.x + view.w, view.y + view.h];
      if (view.w > w) {
        view.x = (w - view.w) / 2;
      } else if (view.x < 0) {
        view.x = 0;
      } else if (r > w) {
        view.x = w - view.w;
      }
      if (view.h > h) {
        view.y = (h - view.h) / 2;
      } else if (view.y < 0) {
        view.y = 0;
      } else if (b > h) {
        view.y = h - view.h;
      }
    }
    this[ENGINE][VIEWS][0] = new __WEBPACK_IMPORTED_MODULE_1__struct__["c" /* Rectangle */](...view);
  }

  get room() {
    var _this = this;

    return {
      // go to the given room
      goto: Rm => {
        let old = null;
        if (this[ENGINE][ROOMS][0]) {
          old = this[ENGINE][ROOMS][0].constructor;
          this[ENGINE].proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('roomend', old, Rm));
          this[ENGINE][ROOMS][0].end();
        }
        this[ENGINE][ROOMS].unshift(new Rm(this[ENGINE]));
        this[ENGINE][OBJECTS].splice(1, 1, []);
        this[ENGINE][VIEWS].unshift(new __WEBPACK_IMPORTED_MODULE_1__struct__["c" /* Rectangle */](0, 0, ...this[ENGINE].size));
        if (!(this[ENGINE][ROOMS][0] instanceof __WEBPACK_IMPORTED_MODULE_5__room__["b" /* default */])) {
          throw `${ this[ENGINE][ROOMS][0].constructor.name } is not a Room`;
        }
        _asyncToGenerator(function* () {
          _this[ENGINE][ROOMS][0].load();
          _this[ENGINE].proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('roomload', old, Rm));
          yield _this[ENGINE][ROOMS][0].loaded;
          // remove the old room, which was temporarily shifted
          if (_this[ENGINE][ROOMS][1]) {
            _this[ENGINE][ROOMS].splice(1, 1)[0].destructor();
            _this[ENGINE][OBJECTS].splice(1, 1);
            _this[ENGINE][VIEWS].splice(1, 1);
          }
          _this[ENGINE][ROOMS][0].start();
          _this[ENGINE].proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('roomstart', old, Rm));
        })();
      },
      // freeze the current room and put this[ENGINE] one over top
      overlay: Rm => {
        const old = this[ENGINE][ROOMS][0].constructor;
        this[ENGINE][ROOMS].unshift(new Rm(this[ENGINE]));
        this[ENGINE][OBJECTS].unshift([]);
        this[ENGINE][VIEWS].unshift(new __WEBPACK_IMPORTED_MODULE_1__struct__["c" /* Rectangle */](0, 0, ...this[ENGINE].size));
        if (!(this[ENGINE][ROOMS][0] instanceof __WEBPACK_IMPORTED_MODULE_5__room__["b" /* default */])) {
          throw `${ this[ENGINE][ROOMS][0].constructor.name } is not a Room`;
        }
        _asyncToGenerator(function* () {
          _this[ENGINE][ROOMS][0].load();
          _this[ENGINE].proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('roomload', null, Rm));
          yield _this[ENGINE][ROOMS][0].loaded;
          _this[ENGINE][ROOMS][0].start();
          _this[ENGINE].proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('roomstart', null, Rm));
        })();
      },
      // closes the current room overlay
      close: () => {
        this[ENGINE].proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('roomend', this[ENGINE][ROOMS][0].constructor, null));
        this[ENGINE][ROOMS][0].end();
        this[ENGINE][ROOMS][0].destructor();
        this[ENGINE][ROOMS].shift();
        this[ENGINE][OBJECTS].shift();
        this[ENGINE][VIEWS].shift();
        if (this[ENGINE][ROOMS].length === 0) {
          throw `You closed the last room... please don't do that`;
        }
      }
    };
  }

  mousestate(button) {
    return this[ENGINE][INPUT].mousestate(button);
  }

  keystate(key) {
    return this[ENGINE][INPUT].keystate(key);
  }

  // end the game
  // NOTE: for JS version of this[ENGINE] engine, this[ENGINE] function isn't all that
  // useful since you can't really 'close' a canvas
  end() {
    this[ENGINE].proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('gameend'));
    this[ENGINE].end();
    window.cancelAnimationFrame(this[ENGINE][RAF]);
    this[ENGINE][RAF] = null;
    this[ENGINE][ROOMS] = [];
    this[ENGINE][OBJECTS] = [[]];
  }

  // end the game and run it again
  restart() {
    this[ENGINE].util.end();
    this[ENGINE].run();
  }

  sound(name) {
    return this[ENGINE][SOUND_MANAGER].sound(name);
  }

  music(name) {
    this[ENGINE][SOUND_MANAGER].music(name);
  }

  // spawn an object
  spawn(...args) {
    return this[ENGINE][ROOMS][0].spawn(...args);
  }

  // find an object
  find(Obj) {
    return this[ENGINE][ROOMS][0].find(Obj);
  }

  // destroy an object
  destroy(obj) {
    this[ENGINE][ROOMS][0].destroy(obj);
  }

  // checks if two colliders are colliding
  collides(where, what) {
    if (what instanceof __WEBPACK_IMPORTED_MODULE_4__collider__["b" /* default */]) {
      return what.collides(where);
    }
    if (this[ENGINE][ROOMS][0].collides(where, what)) {
      return true;
    }
    if (what !== 'room') {
      what = what === 'any' ? this[ENGINE][OBJECTS][0].filter(o => o instanceof __WEBPACK_IMPORTED_MODULE_4__collider__["b" /* default */]) : this[ENGINE][OBJECTS][0].filter(o => o instanceof what);
      for (let it of what) {
        if (it.collides(where)) {
          return true;
        }
      }
    }
    return false;
  }
};



/* unused harmony default export */ var _unused_webpack_default_export = Engine;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return SECOND; });


const SECOND = 60;



/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(45);
module.exports = __webpack_require__(5).String.padStart;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const [STACK, COLOR, ALPHA, FONT, HALIGN, VALIGN, WHO, CONTEXT, VIEWPORT] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

let Draw = class Draw {

  constructor(context) {
    this[STACK] = {};
    this[COLOR] = '#000000';
    this[ALPHA] = 1;
    this[FONT] = '14px Arial';
    this[WHO] = null;
    this[VIEWPORT] = null;
    this[HALIGN] = 'top';
    this[VALIGN] = 'left';

    this[CONTEXT] = context;
  }

  // the current object being drawn
  // HACK: internalize
  object(who) {
    this[WHO] = who;
    return this;
  }

  // the current viewport rectangle
  // HACK: internalize
  view(view) {
    this[VIEWPORT] = [...view];
    return this;
  }

  // settings
  alpha(alpha) {
    this[ALPHA] = alpha;
    return this;
  }
  color(color) {
    this[COLOR] = typeof color === 'number' ? '#' + color.toString(16).padStart(6, '0') : color;
    return this;
  }
  font(font) {
    this[FONT] = font;
    return this;
  }
  halign(align) {
    this[HALIGN] = align;
    return this;
  }
  valign(align) {
    this[VALIGN] = align;
    return this;
  }

  // draw a rectangle
  rect(rect, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [color, alpha] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.fillRect(...rect);
    });
    return this;
  }
  // draw a pixel
  point(point, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [color, alpha] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.fillRect(...point, 1, 1);
    });
    return this;
  }
  // draw a sprite
  sprite(sprite, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const alpha = this[ALPHA];
    this[STACK][depth].push(con => {
      con.globalAlpha = alpha;
      con.drawImage(sprite.texture, ...sprite.src, ...sprite.dest);
    });
    return this;
  }
  // draw a tilemap
  image(image, src, dest, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const alpha = this[ALPHA];
    this[STACK][depth].push(con => {
      con.globalAlpha = alpha;
      con.drawImage(image, ...src, ...dest);
    });
    return this;
  }
  // draw some text
  text(str, where, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [font, alpha, color, ha, va] = [this[FONT], this[ALPHA], this[COLOR], this[HALIGN], this[VALIGN]];
    this[STACK][depth].push(con => {
      con.font = font;
      con.globalAlpha = alpha;
      con.fillStyle = color;
      con.textAlign = ha;
      con.textBaseline = va;
      con.fillText(str, ...where);
    });
    return this;
  }
  // draw the current GameObject sensibly from defaults
  self(depth = 0) {
    if (this[WHO] && this[WHO].sprite) {
      this.sprite(this[WHO].sprite, depth);
    }
  }

  // actually draw each item in the stack at the right depth
  render() {
    this[CONTEXT].save();
    if (this[VIEWPORT]) {
      const { width, height } = this[CONTEXT].canvas;
      this[CONTEXT].scale(width / this[VIEWPORT][2], height / this[VIEWPORT][3]);
      this[CONTEXT].translate(-this[VIEWPORT][0], -this[VIEWPORT][1]);
    }
    for (let depth of Object.keys(this[STACK]).map(x => +x).sort((a, b) => a - b)) {
      for (let item of this[STACK][depth]) {
        item(this[CONTEXT]);
      }
    }
    this[CONTEXT].restore();
    this[STACK] = {};
  }
};


/* harmony default export */ exports["a"] = Draw;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_event__ = __webpack_require__(12);


var _class, _temp;



const [QUEUE, STATE] = [Symbol(), Symbol()];

let Input = (_temp = _class = class Input {

  constructor(canvas) {
    this[QUEUE] = {
      keydown: [],
      keyup: [],
      mousedown: [],
      mouseup: [],
      mousemove: [0, 0]
    };
    this[STATE] = {
      mouse: {},
      key: {}
    };

    this.canvas = canvas;
    window.addEventListener('keydown', this.keydown.bind(this), true);
    window.addEventListener('keyup', this.keyup.bind(this), true);
    window.addEventListener('mousedown', this.mousedown.bind(this), true);
    window.addEventListener('mouseup', this.mouseup.bind(this), true);
    window.addEventListener('mousemove', this.mousemove.bind(this), true);
  }

  keystate(key) {
    return !!this[STATE].key[key];
  }

  mousestate(button) {
    return !!this[STATE].mouse[button];
  }

  keydown(event) {
    if (this.canvas === document.activeElement) {
      event.preventDefault();
      this[QUEUE].keydown.push(new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('keydown', event.key));
      this[STATE].key[event.key] = true;
    }
  }
  keyup(event) {
    if (this.canvas === document.activeElement) {
      event.preventDefault();
      this[QUEUE].keyup.push(new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('keyup', event.key));
      this[STATE].key[event.key] = false;
    }
  }
  mousedown(event) {
    if (this.canvas === document.activeElement) {
      this[QUEUE].mousedown.push(new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('mousedown', event.button));
      this[STATE].mouse[event.button] = true;
    }
  }
  mouseup(event) {
    if (this === document.activeElement) {
      event.preventDefault();
      this[QUEUE].mouseup.push(new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('mouseup', event.button));
      this[STATE].mouse[event.button] = false;
    }
  }
  mousemove(event) {
    const { left: x, top: y } = this.canvas.getBoundingClientRect();
    this[QUEUE].mousemove = [event.clientX - x, event.clientY - y];
  }

  *[Symbol.iterator]() {
    yield* [...this[QUEUE].keydown.splice(0), ...this[QUEUE].mousedown.splice(0), ...this[QUEUE].keyup.splice(0), ...this[QUEUE].mouseup.splice(0), new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('mousemove', this[QUEUE].mousemove)];
  }
}, _class.preventDefault = false, _temp);


/* harmony default export */ exports["a"] = Input;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


const [CONTEXT, RESOLVE, REJECT, NODES, NAME] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

let PlayingSound = class PlayingSound extends Promise {
  constructor(context, nodes, name) {
    if (typeof context === 'function') {
      super(context);
      return;
    }
    let res, rej;
    super((resolve, reject) => {
      res = resolve;
      rej = reject;
      if (nodes.source) {
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

  get name() {
    return this[NAME];
  }

  stop() {
    this[REJECT]();
    this[NODES].source && this[NODES].source.stop();
  }

  // the volume that a new instance of this sound will play at
  get volume() {
    if (this[NODES].gain) {
      return this[NODES].gain.gain.value;
    } else {
      return NaN;
    }
  }
  set volume(amt) {
    if (this[NODES].gain) {
      this[NODES].gain.gain.value = amt;
    }
  }
};


/* harmony default export */ exports["a"] = PlayingSound;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sound__ = __webpack_require__(27);




const [SOURCES, AUDIOCONTEXT, PURGE, LOAD, CURRENT_MUSIC, REFERENCES] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

let SoundManager = class SoundManager {

  constructor(sound, music) {
    this[AUDIOCONTEXT] = new (AudioContext || webkitAudioContext)();
    this[SOURCES] = { sound: null, music: null };
    this[CURRENT_MUSIC] = null;
    this[REFERENCES] = { sound: new WeakMap(), music: new WeakMap() };

    this[SOURCES] = { sound, music };
  }

  sound(name) {
    const t = this[SOURCES].sound[name];
    if (t instanceof __WEBPACK_IMPORTED_MODULE_0__sound__["a" /* default */]) {
      return t;
    }
    throw `Sound ${ name } was not loaded in this room`;
  }

  // TODO: Music volume adjustment

  music(name) {
    if (this[CURRENT_MUSIC] && this[CURRENT_MUSIC].name === name) {
      return;
    }
    if (this[CURRENT_MUSIC]) {
      this[CURRENT_MUSIC].stop();
    }
    if (!(this[SOURCES].music[name] instanceof __WEBPACK_IMPORTED_MODULE_0__sound__["a" /* default */])) {
      throw `Music ${ name } was not loaded in this room`;
    }
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
    if (!sound) {
      throw `No ${ type } called ${ name } exists`;
    }
    if (typeof sound === 'string') {
      this[SOURCES][type][name] = new __WEBPACK_IMPORTED_MODULE_0__sound__["a" /* default */](this[AUDIOCONTEXT], sound, name);
    }
    this[REFERENCES][type].set(this[SOURCES][type][name], (this[REFERENCES][type].get(this[SOURCES][type][name]) || 0) + 1);
    return this[SOURCES][type][name].loaded;
  }

  [PURGE](type, name) {
    if (this[SOURCES][type][name] instanceof __WEBPACK_IMPORTED_MODULE_0__sound__["a" /* default */]) {
      this[REFERENCES][type].set(this[SOURCES][type][name], this[REFERENCES][type].get(this[SOURCES][type][name]) - 1);
      if (!this[REFERENCES][type].get(this[SOURCES][type][name])) {
        this[SOURCES][type][name] = this[SOURCES][type][name].url;
      }
    }
  }

  loadSound(names) {
    names = new Set(names);
    const pr = [];
    for (let name of names) {
      pr.push(this[LOAD]('sound', name));
    }
    return Promise.all(pr);
  }

  purgeSound(names) {
    for (let name of names) {
      this[PURGE]('sound', name);
    }
  }

  loadMusic(names) {
    names = new Set(names);
    const pr = [];
    for (let name of names) {
      pr.push(this[LOAD]('music', name));
    }
    return Promise.all(pr);
  }

  purgeMusic(names) {
    for (let name of names) {
      this[PURGE]('music', name);
      if (this[CURRENT_MUSIC] && this[CURRENT_MUSIC].name === name && !(this[SOURCES].music[name] instanceof __WEBPACK_IMPORTED_MODULE_0__sound__["a" /* default */])) {
        this.stopMusic();
      }
    }
  }
};


/* harmony default export */ exports["a"] = SoundManager;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__playing_sound__ = __webpack_require__(25);


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }



const [SOUND, SRC, CONTEXT, LOADED, NAME, URL] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

function loadSound(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.addEventListener('load', () => {
      resolve(req.response);
    });
    req.send();
  });
}

// a Sound holds an instantiated sound which can be played, stopped, and modified
// at will
let Sound = class Sound {

  constructor(context, url, name) {
    var _this = this;

    this[NAME] = '';
    this[URL] = '';
    this[SOUND] = null;
    this[LOADED] = Promise.resolve();

    this[NAME] = name;
    this[URL] = url;
    this[CONTEXT] = context;
    this[LOADED] = _asyncToGenerator(function* () {
      const data = yield loadSound(url);
      _this[SOUND] = yield new Promise(function (resolve) {
        return context.decodeAudioData(data, resolve);
      });
    })();
  }

  // TODO: internalize?
  get url() {
    return this[URL];
  }
  get name() {
    return this[NAME];
  }

  get loaded() {
    return this[LOADED];
  }

  // plays the sound. returns a PlayingSound promise
  play() {
    const source = this[CONTEXT].createBufferSource();
    source.buffer = this[SOUND];
    const gain = this[CONTEXT].createGain();
    gain.gain.value = 1;
    gain.connect(this[CONTEXT].destination);
    source.connect(gain);
    source.start(0);
    return new __WEBPACK_IMPORTED_MODULE_0__playing_sound__["a" /* default */](this[CONTEXT], { source, gain }, this[NAME]);
  }
};


/* harmony default export */ exports["a"] = Sound;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__texture_page__ = __webpack_require__(11);




const [REFERENCES, PAGES, SOURCES] = [Symbol(), Symbol(), Symbol()];

let TextureManager = class TextureManager {

  constructor(sources = []) {
    this[REFERENCES] = new WeakMap();
    this[PAGES] = {};
    this[SOURCES] = null;

    this[SOURCES] = sources;
  }

  // load a set of texture pages
  load(textures) {
    textures = new Set(textures);
    const loaded = [];
    for (let texture of textures) {
      if (!this[PAGES][texture]) {
        this[PAGES][texture] = new __WEBPACK_IMPORTED_MODULE_0__texture_page__["b" /* default */](this[SOURCES][texture]);
        loaded.push(this[PAGES][texture].loaded);
      }
      this[REFERENCES].set(this[PAGES][texture], (this[REFERENCES].get(this[PAGES][texture]) || 0) + 1);
    }
    return Promise.all(loaded);
  }

  // remove all texture pages in the list given
  purge(textures) {
    for (let texture of textures) {
      if (this[PAGES][texture]) {
        this[REFERENCES].set(this[PAGES][texture], this[REFERENCES].get(this[PAGES][texture]) - 1);
        if (!this[REFERENCES].get(this[PAGES][texture])) {
          delete this[PAGES][texture];
        }
      }
    }
  }

  get pages() {
    return this[PAGES];
  }

  // instantiate the sprite from the pages
  sprite(sprite) {
    let spr;
    for (let page of Object.keys(this[PAGES])) {
      if (spr = this[PAGES][page].make(sprite)) {
        break;
      }
    }
    if (!spr) {
      throw `Sprite ${ sprite } does not exist in the current set of texture pages`;
    }
    return spr;
  }
};


/* harmony default export */ exports["a"] = TextureManager;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__struct__ = __webpack_require__(0);



const [COLLISIONS, IMAGES, LOADED, PAGES] = [Symbol(), Symbol(), Symbol(), Symbol()];

// a TileMap provides an efficient way to store and render a static tile map
// and also calculate wall collisions quickly
let TileMap = class TileMap {

  constructor(tm, { meta, images, collisions }) {
    this[IMAGES] = [];
    this[COLLISIONS] = [];
    this[PAGES] = [];

    this[PAGES] = meta.pages;
    this.tw = meta.tw;
    this.th = meta.th;
    const tile = n => {
      for (let page of meta.pages) {
        if (page.min <= n && n < page.max) {
          n -= page.min;
          const tp = tm.pages[page.name];
          if (!tp) {
            return null;
          }
          const src = new __WEBPACK_IMPORTED_MODULE_0__struct__["c" /* Rectangle */](this.tw * (n % (tp.width / this.tw)), this.th * Math.floor(n / (tp.width / this.tw)), this.tw, this.th);
          return [tp, src];
        }
      }
    };
    for (let depth of Object.keys(images)) {
      const dest = new __WEBPACK_IMPORTED_MODULE_0__struct__["c" /* Rectangle */](0, 0, this.tw, this.th);
      const layer = document.createElement('CANVAS');
      layer.width = images[depth][0].length * this.tw;
      layer.height = images[depth].length * this.th;
      const ctx = layer.getContext('2d');
      this[IMAGES].push([+depth, layer]);
      for (let row of images[depth]) {
        for (let n of row) {
          const t = tile(+n);
          if (t) {
            const [tp, src] = t;
            ctx.drawImage(tp, ...src, ...dest);
          }
          dest.x += this.tw;
        }
        dest.x = 0;
        dest.y += this.th;
      }
    }
    this[COLLISIONS] = collisions.map(l => l.split('').map(i => !!+i));
  }

  get pages() {
    return this[PAGES].map(({ name }) => name);
  }

  get size() {
    return new __WEBPACK_IMPORTED_MODULE_0__struct__["b" /* Dimension */](this.tw * this[COLLISIONS][0].length, this.th * this[COLLISIONS].length);
  }

  // copy the tile map to the main canvas
  draw(draw) {
    for (let [depth, image] of this[IMAGES]) {
      draw.image(image, [0, 0, image.width, image.height], [0, 0, image.width, image.height], depth);
    }
  }

  // check if a given Rectangle collides with the collision map
  collides(box) {
    box = [...box];
    box[2] = Math.ceil((box[0] + box[2]) / this.tw);
    box[3] = Math.ceil((box[1] + box[3]) / this.th);
    box[0] = Math.floor(box[0] / this.tw);
    box[1] = Math.floor(box[1] / this.th);
    for (let i = box[0]; i < box[2]; ++i) {
      for (let j = box[1]; j < box[3]; ++j) {
        if (this[COLLISIONS][j] && this[COLLISIONS][j][i]) {
          return true;
        }
      }
    }
    return false;
  }
};


/* harmony default export */ exports["a"] = TileMap;

/***/ },
/* 30 */
/***/ function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(8);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(30);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(8)
  , document = __webpack_require__(7).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(7)
  , core      = __webpack_require__(5)
  , hide      = __webpack_require__(15)
  , redefine  = __webpack_require__(39)
  , ctx       = __webpack_require__(32)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ },
/* 35 */
/***/ function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(6) && !__webpack_require__(14)(function(){
  return Object.defineProperty(__webpack_require__(33)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(31)
  , IE8_DOM_DEFINE = __webpack_require__(36)
  , toPrimitive    = __webpack_require__(43)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ },
/* 38 */
/***/ function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(7)
  , hide      = __webpack_require__(15)
  , has       = __webpack_require__(35)
  , SRC       = __webpack_require__(44)('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

__webpack_require__(5).inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(42)
  , repeat   = __webpack_require__(41)
  , defined  = __webpack_require__(13);

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(16)
  , defined   = __webpack_require__(13);

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(16)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(8);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ },
/* 44 */
/***/ function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(34)
  , $pad    = __webpack_require__(40);

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

/***/ },
/* 46 */
/***/ function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_fn_string_pad_start__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_fn_string_pad_start___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_fn_string_pad_start__);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Position", function() { return __WEBPACK_IMPORTED_MODULE_1__engine_struct__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Dimension", function() { return __WEBPACK_IMPORTED_MODULE_1__engine_struct__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Rectangle", function() { return __WEBPACK_IMPORTED_MODULE_1__engine_struct__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine_struct__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__engine_timing__ = __webpack_require__(21);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "SECOND", function() { return __WEBPACK_IMPORTED_MODULE_2__engine_timing__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__engine_decorator__ = __webpack_require__(18);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "override", function() { return __WEBPACK_IMPORTED_MODULE_3__engine_decorator__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "sound", function() { return __WEBPACK_IMPORTED_MODULE_3__engine_decorator__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "texturepage", function() { return __WEBPACK_IMPORTED_MODULE_3__engine_decorator__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "sprite", function() { return __WEBPACK_IMPORTED_MODULE_3__engine_decorator__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "tilemap", function() { return __WEBPACK_IMPORTED_MODULE_3__engine_decorator__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "config", function() { return __WEBPACK_IMPORTED_MODULE_3__engine_decorator__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "music", function() { return __WEBPACK_IMPORTED_MODULE_3__engine_decorator__["g"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "persistent", function() { return __WEBPACK_IMPORTED_MODULE_3__engine_decorator__["h"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__engine__ = __webpack_require__(20);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Engine", function() { return __WEBPACK_IMPORTED_MODULE_4__engine__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__engine_drawable__ = __webpack_require__(3);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Drawable", function() { return __WEBPACK_IMPORTED_MODULE_5__engine_drawable__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__engine_collider__ = __webpack_require__(2);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Collider", function() { return __WEBPACK_IMPORTED_MODULE_6__engine_collider__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__engine_texture_page__ = __webpack_require__(11);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "TexturePage", function() { return __WEBPACK_IMPORTED_MODULE_7__engine_texture_page__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__engine_sprite__ = __webpack_require__(10);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Sprite", function() { return __WEBPACK_IMPORTED_MODULE_8__engine_sprite__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__engine_game_object__ = __webpack_require__(19);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "GameObject", function() { return __WEBPACK_IMPORTED_MODULE_9__engine_game_object__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__engine_room__ = __webpack_require__(9);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Room", function() { return __WEBPACK_IMPORTED_MODULE_10__engine_room__["a"]; });















/***/ }
/******/ ]);