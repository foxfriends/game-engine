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

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
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
/******/ 	return __webpack_require__(__webpack_require__.s = 36);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Position; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return Dimension; });
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return Rectangle; });
'use strict';

let Position = class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  *[Symbol.iterator]() {
    yield* [this.x, this.y];
  }
};
let Dimension = class Dimension {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }

  *[Symbol.iterator]() {
    yield* [this.w, this.h];
  }
};
let Rectangle = class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
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
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return Drawable; });
'use strict';

function Drawable(Base) {
  return class extends Base {
    draw() {}
  };
}

Object.defineProperty(Drawable, Symbol.hasInstance, {
  value: instance => {
    return typeof instance.draw === 'function';
  }
});


/* harmony default export */ exports["a"] = Drawable;

/***/ },
/* 2 */
/***/ function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(8)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 4 */
/***/ function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__drawable__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return Room; });
'use strict';



const [OBJECTS, ENGINE] = [Symbol(), Symbol()];

let Room = class Room {

  constructor(engine) {
    this[OBJECTS] = [];
    this[ENGINE] = engine;
  }

  start() {}
  proc(event) {
    for (let obj of this[OBJECTS]) {
      obj.proc(event);
    }
  }
  end() {}

  spawn(Obj, ...args) {
    const o = new Obj(this, this[ENGINE]);
    o.init(...args);
    this[OBJECTS].push(o);
    return o;
  }

  destroy(obj) {
    const i = this[OBJECTS].indexOf(o);
    if (i >= 0) {
      this[OBJECTS].splice(i, 1);
    }
  }

  draw(draw) {
    for (let obj of this[OBJECTS]) {
      obj instanceof __WEBPACK_IMPORTED_MODULE_0__drawable__["a" /* default */] && obj.draw(draw);
    }
  }
};



/* harmony default export */ exports["a"] = Room;

/***/ },
/* 7 */
/***/ function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(27)
  , createDesc = __webpack_require__(28);
module.exports = __webpack_require__(3) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ },
/* 10 */
/***/ function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return override; });
'use strict';

// @override methods must have a superclass method they are overriding

function override(target, prop, descriptor) {
  const pr = Object.getPrototypeOf(target);
  if (!pr[prop]) {
    throw `${ target.constructor.name }.${ prop } marked override but does not override anything`;
  }
}



/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return GameObject; });
'use strict';

const [ENGINE, ROOM] = [Symbol(), Symbol()];

let GameObject = class GameObject {
  constructor(room = null, engine = null) {
    this[ROOM] = room;this[ENGINE] = engine;
  }
  init() {}

  roomstart() {}
  stepstart() {}

  mousemove(where) {}
  keydown(which) {}
  mousedown(which) {}
  keyup(which) {}
  mouseup(which) {}

  step() {}
  stepend() {}

  roomend() {}

  proc(event) {
    this[event.type] && this[event.type](event.data);
  }

  get game() {
    return new Proxy(this[ENGINE], {
      get(target, prop) {
        if (prop === 'room') {
          return target.room;
        } else {
          return target.game[prop];
        }
      }
    });
  }
};



/* unused harmony default export */ var _unused_webpack_default_export = GameObject;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__draw__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__struct__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__game_event__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__drawable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__room__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__input__ = __webpack_require__(37);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Engine; });
'use strict';








const [ROOM, OBJECTS, RAF, CANVAS, CONTEXT, INPUT] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

let Engine = class Engine {

  constructor(canvas, { w, h }) {
    this[ROOM] = null;
    this[OBJECTS] = [];
    this[RAF] = null;

    this[CANVAS] = document.querySelector(canvas);
    this[CANVAS].width = w;
    this[CANVAS].height = h;
    this[CONTEXT] = this[CANVAS].getContext('2d');
    this[INPUT] = new __WEBPACK_IMPORTED_MODULE_5__input__["a" /* default */](this[CANVAS]);
  }
  get size() {
    return new __WEBPACK_IMPORTED_MODULE_1__struct__["b" /* Dimension */](this[CANVAS].width, this[CANVAS].height);
  }

  proc(event) {
    for (let obj of this[OBJECTS]) {
      obj.proc(event);
    }
    this[ROOM] && this[ROOM].proc(event);
  }

  start() {}
  step() {
    this.proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('stepstart'));
    for (let event of this[INPUT]) {
      // TODO: parse the events here
      this.proc(event);
    }
    this.proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('step'));
    this.proc(new __WEBPACK_IMPORTED_MODULE_2__game_event__["a" /* default */]('stepend'));
  }
  draw() {
    this[CONTEXT].clearRect(0, 0, ...this.size);
    const drawer = new __WEBPACK_IMPORTED_MODULE_0__draw__["a" /* default */](this[CONTEXT]);
    for (let obj of this[OBJECTS]) {
      obj instanceof Drawable && obj.draw(drawer);
    }
    this[ROOM] && this[ROOM].draw(drawer);
    drawer.render();
  }
  end() {}

  run() {
    const takeStep = () => {
      this.step();
      this.draw();
      this[RAF] = window.requestAnimationFrame(takeStep);
    };
    this.start();
    this[RAF] = window.requestAnimationFrame(takeStep);
  }

  // utilities
  get room() {
    return {
      goto: R => {
        this[ROOM] && this[ROOM].end();
        this[ROOM] = new R(this);
        if (!(this[ROOM] instanceof __WEBPACK_IMPORTED_MODULE_4__room__["a" /* default */])) {
          throw `${ this[ROOM].constructor.name } is not a Room`;
        }
        this[ROOM].start();
      }
    };
  }

  get game() {
    return {
      end: () => {
        window.cancelAnimationFrame(this[RAF]);
        this[RAF] = null;
        this[ROOM] = null;
        this[OBJECTS] = [];
        this.end();
      },
      restart: () => {
        this.game.end();
        this.run();
      }
    };
  }
};



/* unused harmony default export */ var _unused_webpack_default_export = Engine;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__struct__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return Sprite; });
'use strict';



const [PAGE, FRAMES, FRAME] = [Symbol(), Symbol(), Symbol()];

let Sprite = class Sprite extends __WEBPACK_IMPORTED_MODULE_0__struct__["c" /* Rectangle */] {
  constructor(page, frames) {
    super(...page.frame(frames[0]));
    this[PAGE] = page;
    this[FRAMES] = frames;
    this[FRAME] = 0;
  }

  set frame(frame) {
    this[FRAME] = frame;
  }
  get frame() {
    return this[FRAME];
  }

  get texture() {
    return this[PAGE];
  }
  get src() {
    return this[PAGE].frame(this[FRAMES][this[FRAME]]);
  }
  get dest() {
    return this;
  }
};



/* unused harmony default export */ var _unused_webpack_default_export = Sprite;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__struct__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return TexturePage; });
'use strict';



const TEXTURE = Symbol();

let TexturePage = class TexturePage extends Image {
  constructor({ img, frames }) {
    // make a texture page from the json
    super();
    this.src = img;
    this[FRAMES] = frames;
  }

  frame(i) {
    return new __WEBPACK_IMPORTED_MODULE_0__struct__["c" /* Rectangle */](...this[FRAMES][i]);
  }
};
;


/* unused harmony default export */ var _unused_webpack_default_export = TexturePage;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return SECOND; });
const SECOND = 60;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(35);
module.exports = __webpack_require__(2).String.padStart;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

const [STACK, COLOR, ALPHA, FONT, CONTEXT] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

let Draw = class Draw {

  constructor(context) {
    this[STACK] = {};
    this[COLOR] = '#000000';
    this[ALPHA] = 1;
    this[FONT] = '14px Arial';
    this[CONTEXT] = context;
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

  // drawing
  rect(rect, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [alpha, color] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.fillRect(...rect);
    });
    return this;
  }
  point(point, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [alpha, color] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.fillRect(...point, 1, 1);
    });
    return this;
  }
  sprite(sprite, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const alpha = this[ALPHA];
    this[STACK][depth].push(con => {
      con.globalAlpha = alpha;
      con.drawImage(sprite.texture, ...sprite.src, ...sprite.dest);
    });
    return this;
  }
  text(str, where, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [font, alpha, color] = [this[FONT], this[ALPHA], this[COLOR]];
    this[STACK][depth].push(con => {
      con.font = font;
      con.globalAlpha = alpha;
      con.fillStyle = color;
      con.fillText(str, ...where);
    });
    return this;
  }

  render() {
    for (let depth of Object.keys(this[STACK]).map(x => +x).sort((a, b) => a - b)) {
      for (let item of this[STACK][depth]) {
        item(this[CONTEXT]);
      }
    }
    this[STACK] = {};
  }
};


/* harmony default export */ exports["a"] = Draw;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

let GameEvent = class GameEvent {
  constructor(type, data = null) {
    this.type = type;
    this.data = data;
  }
};


/* harmony default export */ exports["a"] = GameEvent;

/***/ },
/* 20 */
/***/ function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(20);
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5)
  , document = __webpack_require__(4).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(4)
  , core      = __webpack_require__(2)
  , hide      = __webpack_require__(9)
  , redefine  = __webpack_require__(29)
  , ctx       = __webpack_require__(22)
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
/* 25 */
/***/ function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(3) && !__webpack_require__(8)(function(){
  return Object.defineProperty(__webpack_require__(23)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(21)
  , IE8_DOM_DEFINE = __webpack_require__(26)
  , toPrimitive    = __webpack_require__(33)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(3) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 28 */
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(4)
  , hide      = __webpack_require__(9)
  , has       = __webpack_require__(25)
  , SRC       = __webpack_require__(34)('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

__webpack_require__(2).inspectSource = function(it){
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(32)
  , repeat   = __webpack_require__(31)
  , defined  = __webpack_require__(7);

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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var toInteger = __webpack_require__(10)
  , defined   = __webpack_require__(7);

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(10)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(5);
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
/* 34 */
/***/ function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(24)
  , $pad    = __webpack_require__(30);

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_fn_string_pad_start__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_fn_string_pad_start___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_fn_string_pad_start__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine_struct__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__engine_timing__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__engine_decorator__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__engine__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__engine_drawable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__engine_texture_page__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__engine_sprite__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__engine_game_object__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__engine_room__ = __webpack_require__(6);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Position", function() { return __WEBPACK_IMPORTED_MODULE_1__engine_struct__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Dimension", function() { return __WEBPACK_IMPORTED_MODULE_1__engine_struct__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Rectangle", function() { return __WEBPACK_IMPORTED_MODULE_1__engine_struct__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "SECOND", function() { return __WEBPACK_IMPORTED_MODULE_2__engine_timing__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "override", function() { return __WEBPACK_IMPORTED_MODULE_3__engine_decorator__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Engine", function() { return __WEBPACK_IMPORTED_MODULE_4__engine__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Drawable", function() { return __WEBPACK_IMPORTED_MODULE_5__engine_drawable__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "TexturePage", function() { return __WEBPACK_IMPORTED_MODULE_6__engine_texture_page__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Sprite", function() { return __WEBPACK_IMPORTED_MODULE_7__engine_sprite__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "GameObject", function() { return __WEBPACK_IMPORTED_MODULE_8__engine_game_object__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "Room", function() { return __WEBPACK_IMPORTED_MODULE_9__engine_room__["b"]; });
'use strict';













/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_event__ = __webpack_require__(19);
'use strict';



let Input = class Input {

  constructor(canvas) {
    this.queue = {
      keydown: [],
      keyup: [],
      mousedown: [],
      mouseup: [],
      mousemove: [0, 0]
    };

    this.canvas = canvas;
    window.addEventListener('keydown', this.keydown.bind(this), true);
    window.addEventListener('keyup', this.keyup.bind(this), true);
    window.addEventListener('mousedown', this.mousedown.bind(this), true);
    window.addEventListener('mouseup', this.mouseup.bind(this), true);
    window.addEventListener('mousemove', this.mousemove.bind(this), true);
  }

  keydown(event) {
    this.queue.keydown.push(new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('keydown', event.key));
  }
  keyup(event) {
    this.queue.keyup.push(new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('keyup', event.key));
  }
  mousedown(event) {
    this.queue.mousedown.push(new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('mousedown', event.button));
  }
  mouseup(event) {
    this.queue.mouseup.push(new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('mouseup', event.button));
  }
  mousemove(event) {
    const { left: x, top: y } = this.canvas.getBoundingClientRect();
    this.queue.mousemove = [event.clientX - x, event.clientY - y];
  }

  *[Symbol.iterator]() {
    yield* [...this.queue.keydown.splice(0), ...this.queue.mousedown.splice(0), ...this.queue.keyup.splice(0), ...this.queue.mouseup.splice(0), new __WEBPACK_IMPORTED_MODULE_0__game_event__["a" /* default */]('mousemove', this.queue.mousemove)];
  }
};


/* harmony default export */ exports["a"] = Input;

/***/ }
/******/ ]);