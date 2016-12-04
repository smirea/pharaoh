/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************!*\
  !*** ./test.bundle.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// require('babel-polyfill');
	
	// Recursively require all polyfills
	var req = __webpack_require__(/*! ./test/ */ 13);
	req.keys().forEach(req);

/***/ },
/* 1 */,
/* 2 */
/*!******************************!*\
  !*** ./src/classes/World.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Entity = __webpack_require__(/*! classes/Entity */ 3);
	
	var _Entity2 = _interopRequireDefault(_Entity);
	
	var _Unit = __webpack_require__(/*! classes/Unit */ 4);
	
	var _Unit2 = _interopRequireDefault(_Unit);
	
	var _Tile = __webpack_require__(/*! classes/tiles/Tile */ 8);
	
	var _Tile2 = _interopRequireDefault(_Tile);
	
	var _DirtTile = __webpack_require__(/*! classes/tiles/DirtTile */ 9);
	
	var _DirtTile2 = _interopRequireDefault(_DirtTile);
	
	var _constants = __webpack_require__(/*! utils/constants */ 6);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var World = function () {
	    function World(width, height) {
	        var _this = this;
	
	        _classCallCheck(this, World);
	
	        this.width = width;
	        this.height = height;
	        this.units = [];
	        this.layers = [this.build_layer('tile', function () {
	            return new _DirtTile2.default();
	        }), this.build_layer('entity', null)];
	        this.layer_map = {};
	        this.layers.forEach(function (_ref) {
	            var key = _ref.key,
	                map = _ref.map;
	            return _this.layer_map[key] = map;
	        });
	    }
	
	    _createClass(World, [{
	        key: 'build_layer',
	        value: function build_layer(key, value) {
	            var result = { key: key, map: [] };
	            for (var index = 0; index < this.height; ++index) {
	                var row = [];
	                for (var col_index = 0; col_index < this.width; ++col_index) {
	                    row.push(typeof value === 'function' ? value(index, col_index) : value);
	                }
	                result.map.push(row);
	            }
	            return result;
	        }
	    }, {
	        key: 'is_out_of_bounds',
	        value: function is_out_of_bounds(_ref2) {
	            var _ref3 = _slicedToArray(_ref2, 2),
	                x = _ref3[0],
	                y = _ref3[1];
	
	            return x < 0 || x >= this.width || y < 0 || y >= this.height;
	        }
	    }, {
	        key: 'add_unit',
	        value: function add_unit(instance) {
	            this.remove_unit(instance);
	            this.units.push(instance);
	            instance.on_add_to_world();
	            return true;
	        }
	    }, {
	        key: 'remove_unit',
	        value: function remove_unit(instance) {
	            var index = this.units.indexOf(instance);
	            if (index === -1) return;
	            this.units.splice(index, 1);
	            instance.on_remove_from_world();
	        }
	    }, {
	        key: 'add_entity',
	        value: function add_entity(pos, klass) {
	            var _pos = _slicedToArray(pos, 2),
	                x = _pos[0],
	                y = _pos[1];
	
	            var error = klass.can_add_to_world(this, pos);
	            if (error) {
	                console.error(error);
	                return null;
	            }
	            var instance = new klass(this, pos);
	            for (var row = 0; row < klass.HEIGHT; ++row) {
	                for (var col = 0; col < klass.WIDTH; ++col) {
	                    this.layer_map.entity[y + row][x + col] = instance;
	                }
	            }
	            instance.on_add_to_world(this, pos);
	            return instance;
	        }
	    }, {
	        key: 'fill',
	        value: function fill(_ref4, _ref5, klass) {
	            var _ref7 = _slicedToArray(_ref4, 2),
	                aX = _ref7[0],
	                aY = _ref7[1];
	
	            var _ref6 = _slicedToArray(_ref5, 2),
	                bX = _ref6[0],
	                bY = _ref6[1];
	
	            if (klass.WIDTH != 1 || klass.HEIGHT != 1) {
	                throw new Error('Can only fill with instances of size 1x1: "`${klass.name}`"');
	            }
	            if (this.is_out_of_bounds([aX, aY])) throw new Error('Invalid starting position');
	            if (this.is_out_of_bounds([bX, bY])) throw new Error('Invalid ending position');
	            var row_inc = aY < bY ? 1 : -1;
	            var col_inc = aX < bX ? 1 : -1;
	            for (var row = aY; row_inc > 0 ? row <= bY : row >= bY; row += row_inc) {
	                for (var col = aX; col_inc > 0 ? col <= bX : col >= bX; col += col_inc) {
	                    this.add_entity([col, row], klass);
	                }
	            }
	            return this;
	        }
	    }, {
	        key: 'step',
	        value: function step() {
	            this.units.forEach(function (unit) {
	                unit.step();
	            });
	            console.clear();
	            this.print();
	        }
	    }, {
	        key: 'print',
	        value: function print() {
	            var _this2 = this,
	                _console;
	
	            var matrix = [];
	            var styles = [];
	
	            var get_units = function get_units(x, y) {
	                return _this2.units.filter(function (_ref8) {
	                    var pos = _ref8.pos;
	                    return pos[0] === x && pos[1] === y;
	                });
	            };
	
	            for (var row = -1; row < this.height; ++row) {
	                var tmp = [];
	                for (var col = -1; col < this.width; ++col) {
	                    var bg = 'red';
	                    var char = ' ';
	
	                    if (row === -1 || col === -1) {
	                        bg = 'black';
	                        if (row !== col) {
	                            if (row === -1) {
	                                char = col % 10;
	                            } else {
	                                char = row % 10;
	                            }
	                        }
	                    } else {
	                        var units = get_units(col, row);
	                        if (units.length) {
	                            char = units.length;
	                            bg = units[units.length - 1].constructor.COLOR;
	                        } else {
	                            for (var index = this.layers.length - 1; index >= 0; --index) {
	                                var obj = this.layers[index].map[row][col];
	                                if (obj) {
	                                    bg = obj.constructor.COLOR;
	                                    break;
	                                }
	                            }
	                        }
	                    }
	                    tmp.push('%c' + char);
	                    styles.push('\n                    color: #eee;\n                    background: ' + bg + ';\n                    border-left: 1px solid #aaa;\n                    text-decoration: underline;\n                ');
	                }
	                matrix.push(tmp.join(' '));
	            }
	            matrix = matrix.join('\n');
	            (_console = console).log.apply(_console, [matrix].concat(styles));
	            return this;
	        }
	    }]);
	
	    return World;
	}();
	
	exports.default = World;

/***/ },
/* 3 */
/*!*******************************!*\
  !*** ./src/classes/Entity.js ***!
  \*******************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Entity = function () {
	    function Entity(world, pos) {
	        _classCallCheck(this, Entity);
	
	        this.pos = pos;
	        this.world = world;
	
	        this.stats = {
	            desirability: 0,
	            fire: 0,
	            damage: 0,
	            crime: 0
	        };
	    }
	
	    _createClass(Entity, [{
	        key: 'on_add_to_world',
	        value: function on_add_to_world(world, _ref) {
	            var _ref2 = _slicedToArray(_ref, 2),
	                x = _ref2[0],
	                y = _ref2[1];
	        }
	    }, {
	        key: 'add_stat',
	        value: function add_stat(stat, value) {
	            this.stats[stat] += value;
	        }
	    }, {
	        key: 'each_adjacent',
	        value: function each_adjacent() {
	            var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	            var callback = arguments[1];
	            var _constructor = this.constructor,
	                WIDTH = _constructor.WIDTH,
	                HEIGHT = _constructor.HEIGHT;
	
	            var _pos = _slicedToArray(this.pos, 2),
	                x = _pos[0],
	                y = _pos[1];
	
	            var start_row = Math.max(0, y - size);
	            var end_row = Math.min(this.world.height, y + HEIGHT + size);
	            var start_col = Math.max(0, x - size);
	            var end_col = Math.min(this.world.width, x + WIDTH + size);
	            outer: for (var row = start_row; row < end_row; ++row) {
	                for (var col = start_col; col < end_col; ++col) {
	                    if (col < x || col >= x + WIDTH || row < y || row >= y + HEIGHT) {
	                        if (callback(col, row) === false) break outer;
	                    }
	                }
	            }
	        }
	    }], [{
	        key: 'can_add_to_world',
	        value: function can_add_to_world(world, _ref3) {
	            var _ref4 = _slicedToArray(_ref3, 2),
	                x = _ref4[0],
	                y = _ref4[1];
	
	            for (var row = 0; row < this.HEIGHT; ++row) {
	                for (var col = 0; col < this.WIDTH; ++col) {
	                    if (world.layer_map.entity[y + row][x + col]) return 'Needs to be placed on an empty tile';
	                }
	            }
	            return null;
	        }
	    }]);
	
	    return Entity;
	}();
	
	Entity.COLOR = 'black';
	Entity.WIDTH = 1;
	Entity.HEIGHT = 1;
	exports.default = Entity;

/***/ },
/* 4 */
/*!*****************************!*\
  !*** ./src/classes/Unit.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Entity2 = __webpack_require__(/*! classes/Entity */ 3);
	
	var _Entity3 = _interopRequireDefault(_Entity2);
	
	var _Road = __webpack_require__(/*! classes/infrastructure/Road */ 5);
	
	var _Road2 = _interopRequireDefault(_Road);
	
	var _constants = __webpack_require__(/*! utils/constants */ 6);
	
	var _path = __webpack_require__(/*! utils/path */ 7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Unit = function (_Entity) {
	    _inherits(Unit, _Entity);
	
	    function Unit() {
	        _classCallCheck(this, Unit);
	
	        return _possibleConstructorReturn(this, (Unit.__proto__ || Object.getPrototypeOf(Unit)).apply(this, arguments));
	    }
	
	    _createClass(Unit, [{
	        key: 'is_road',
	        value: function is_road(pos) {
	            if (this.world.is_out_of_bounds(pos)) return false;
	            return this.world.layer_map.entity[pos[1]][pos[0]] instanceof _Road2.default;
	        }
	    }, {
	        key: 'get_road_directions',
	        value: function get_road_directions() {
	            var result = [];
	            if (this.is_road((0, _path.move)(this.pos, _constants.DIR.UP))) result.push(_constants.DIR.UP);
	            if (this.is_road((0, _path.move)(this.pos, _constants.DIR.RIGHT))) result.push(_constants.DIR.RIGHT);
	            if (this.is_road((0, _path.move)(this.pos, _constants.DIR.DOWN))) result.push(_constants.DIR.DOWN);
	            if (this.is_road((0, _path.move)(this.pos, _constants.DIR.LEFT))) result.push(_constants.DIR.LEFT);
	            return result;
	        }
	    }, {
	        key: 'get_affected_entities',
	        value: function get_affected_entities() {
	            var _this2 = this;
	
	            var result = [];
	            this.each_adjacent(this.constructor.EFFECT_RADIUS, function (x, y) {
	                var entity = _this2.world.layer_map.entity[y][x];
	                if (entity) result.push(entity);
	            });
	            return result;
	        }
	    }, {
	        key: 'move',
	        value: function move() {
	            this.pos = (0, _path.move)(this.pos, this.direction);
	        }
	    }, {
	        key: 'apply_effects',
	        value: function apply_effects() {
	            var _this3 = this;
	
	            var targets = this.get_affected_entities();
	            Object.keys(this.constructor.EFFECTS).forEach(function (stat) {
	                var value = _this3.constructor.EFFECTS[stat];
	                targets.forEach(function (entity) {
	                    var stat_value = 0;
	                    if (Array.isArray(value)) {
	                        var distance = (0, _path.get_distance)(_this3.pos, entity.pos);
	                        if (distance < value.length) {
	                            stat_value = value[distance];
	                        } else {
	                            stat_value = 0;
	                        }
	                    } else {
	                        stat_value = value;
	                    }
	                    entity.add_stat(stat, stat_value);
	                });
	            });
	        }
	    }, {
	        key: 'step',
	        value: function step() {
	            this.step_move();
	            this.step_act();
	        }
	    }, {
	        key: 'step_move',
	        value: function step_move() {
	            var _this4 = this;
	
	            var _pos = _slicedToArray(this.pos, 2),
	                x = _pos[0],
	                y = _pos[1];
	
	            var dirs = this.get_road_directions();
	
	            if (!this.is_road(this.pos)) throw new Error(this.constructor.name + ' is not on a road');
	
	            // If there are no roads to go to, don't do anything
	            if (!dirs.length) return;
	
	            if (this.direction) {
	                // It should never try to turn back if there is any other option
	                if (dirs.length > 1) dirs = dirs.filter(function (dir) {
	                    return dir != _this4.direction * -1;
	                });
	            }
	
	            this.direction = dirs[Math.floor(Math.random() * dirs.length)];
	            this.move();
	        }
	    }, {
	        key: 'step_act',
	        value: function step_act() {
	            this.apply_effects();
	        }
	    }, {
	        key: 'on_add_to_world',
	        value: function on_add_to_world() {}
	    }, {
	        key: 'on_remove_from_world',
	        value: function on_remove_from_world() {}
	    }]);
	
	    return Unit;
	}(_Entity3.default);
	
	Unit.COLOR = 'black';
	Unit.EFFECTS = {};
	Unit.EFFECT_RADIUS = 2;
	exports.default = Unit;

/***/ },
/* 5 */
/*!********************************************!*\
  !*** ./src/classes/infrastructure/Road.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Entity2 = __webpack_require__(/*! classes/Entity */ 3);
	
	var _Entity3 = _interopRequireDefault(_Entity2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Road = function (_Entity) {
	    _inherits(Road, _Entity);
	
	    function Road() {
	        _classCallCheck(this, Road);
	
	        return _possibleConstructorReturn(this, (Road.__proto__ || Object.getPrototypeOf(Road)).apply(this, arguments));
	    }
	
	    return Road;
	}(_Entity3.default);
	
	Road.COLOR = 'brown';
	exports.default = Road;

/***/ },
/* 6 */
/*!********************************!*\
  !*** ./src/utils/constants.js ***!
  \********************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var DIR = exports.DIR = {
	    UP: 1,
	    RIGHT: 2,
	    DOWN: -1,
	    LEFT: -2
	};

/***/ },
/* 7 */
/*!***************************!*\
  !*** ./src/utils/path.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.get_distance = exports.move = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _constants = __webpack_require__(/*! utils/constants */ 6);
	
	var move = exports.move = function move(_ref, direction) {
	    var _ref2 = _slicedToArray(_ref, 2),
	        x = _ref2[0],
	        y = _ref2[1];
	
	    var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	
	    switch (direction) {
	        case _constants.DIR.UP:
	            y -= size;break;
	        case _constants.DIR.RIGHT:
	            x += size;break;
	        case _constants.DIR.DOWN:
	            y += size;break;
	        case _constants.DIR.LEFT:
	            x -= size;break;
	        default:
	            throw new Error('Invalid direction "' + direction + '"');
	    }
	    return [x, y];
	};
	
	/**
	 * Returns the Manhattan distance between two points
	 * @param  {Coordinate} start
	 * @param  {Coordinate} end
	 * @return {Number}
	 */
	var get_distance = exports.get_distance = function get_distance(_ref3, _ref4) {
	    var _ref6 = _slicedToArray(_ref3, 2),
	        aX = _ref6[0],
	        aY = _ref6[1];
	
	    var _ref5 = _slicedToArray(_ref4, 2),
	        bX = _ref5[0],
	        bY = _ref5[1];
	
	    return Math.abs(aX - bX) + Math.abs(aY - bY);
	};

/***/ },
/* 8 */
/*!***********************************!*\
  !*** ./src/classes/tiles/Tile.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _World = __webpack_require__(/*! classes/World */ 2);
	
	var _World2 = _interopRequireDefault(_World);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Tile = function () {
	    function Tile() {
	        _classCallCheck(this, Tile);
	    }
	
	    _createClass(Tile, [{
	        key: 'can_add_to_world',
	        value: function can_add_to_world(world, _ref) {
	            var _ref2 = _slicedToArray(_ref, 2),
	                x = _ref2[0],
	                y = _ref2[1];
	
	            if (world.layer_map.entity[y][x]) return 'Tile already exists at [' + x + ', ' + y + ']';
	            return null;
	        }
	    }, {
	        key: 'on_add_to_world',
	        value: function on_add_to_world(world, pos) {}
	    }]);
	
	    return Tile;
	}();
	
	Tile.COLOR = 'black';
	Tile.WIDTH = 1;
	Tile.HEIGHT = 1;
	exports.default = Tile;

/***/ },
/* 9 */
/*!***************************************!*\
  !*** ./src/classes/tiles/DirtTile.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Tile2 = __webpack_require__(/*! classes/tiles/Tile */ 8);
	
	var _Tile3 = _interopRequireDefault(_Tile2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DirtTile = function (_Tile) {
	    _inherits(DirtTile, _Tile);
	
	    function DirtTile() {
	        _classCallCheck(this, DirtTile);
	
	        return _possibleConstructorReturn(this, (DirtTile.__proto__ || Object.getPrototypeOf(DirtTile)).apply(this, arguments));
	    }
	
	    return DirtTile;
	}(_Tile3.default);
	
	DirtTile.COLOR = 'white';
	exports.default = DirtTile;

/***/ },
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/*!***************************!*\
  !*** ./test .*-test\.js$ ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./classes/Entity-test.js": 14,
		"./classes/World-test.js": 15
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 13;


/***/ },
/* 14 */
/*!*************************************!*\
  !*** ./test/classes/Entity-test.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Entity2 = __webpack_require__(/*! classes/Entity */ 3);
	
	var _Entity3 = _interopRequireDefault(_Entity2);
	
	var _World = __webpack_require__(/*! classes/World */ 2);
	
	var _World2 = _interopRequireDefault(_World);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	describe('Entity', function () {
	    var _this = this;
	
	    beforeEach(function () {
	        _this.world = new _World2.default(5, 5);
	        _this.entity = _this.world.add_entity([2, 2], _Entity3.default);
	    });
	
	    describe('can_add_to_world', function () {
	
	        beforeEach(function () {
	            _this.each_adjacent = function () {
	                var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	                var entity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.entity;
	
	                var result = [];
	                entity.each_adjacent(size, function (x, y) {
	                    result.push(x + '-' + y);
	                });
	                return result.join(' ');
	            };
	        });
	
	        it('return all neighbors', function () {
	            expect(_this.each_adjacent()).to.equal('1-1 2-1 3-1 1-2 3-2 1-3 2-3 3-3');
	        });
	
	        it('handles missing sides', function () {
	            _this.entity.pos = [1, 0];
	            expect(_this.each_adjacent()).to.equal('0-0 2-0 0-1 1-1 2-1');
	        });
	
	        it('handles top left corner', function () {
	            _this.entity.pos = [0, 0];
	            expect(_this.each_adjacent()).to.equal('1-0 0-1 1-1');
	        });
	
	        it('handles bottom right corner', function () {
	            _this.entity.pos = [4, 4];
	            expect(_this.each_adjacent()).to.equal('3-3 4-3 3-4');
	        });
	
	        it('handles no neighbors (kinda useless though', function () {
	            var world = new _World2.default(1, 1);
	            var entity = new _Entity3.default(world, [0, 0]);
	            expect(_this.each_adjacent(null, entity)).to.equal('');
	        });
	
	        it('handles size 2', function () {
	            expect(_this.each_adjacent(2)).to.equal('0-0 1-0 2-0 3-0 4-0 0-1 1-1 2-1 3-1 4-1 0-2 1-2 3-2 4-2 0-3 1-3 2-3 3-3 4-3 0-4 1-4 2-4 3-4 4-4');
	        });
	
	        it('handles size 0', function () {
	            expect(_this.each_adjacent(0)).to.equal('');
	        });
	    });
	
	    describe('apply_effects', function () {
	
	        beforeEach(function () {
	            var _class, _temp;
	
	            _this.effects = {};
	            _this.test_class = (_temp = _class = function (_Entity) {
	                _inherits(Test, _Entity);
	
	                function Test() {
	                    _classCallCheck(this, Test);
	
	                    return _possibleConstructorReturn(this, (Test.__proto__ || Object.getPrototypeOf(Test)).apply(this, arguments));
	                }
	
	                return Test;
	            }(_Entity3.default), _class.EFFECTS = _this.effects, _class.EFFECT_RADIUS = 2, _temp);
	            _this.entity = _this.world.add_entity([2, 2], Test);
	        });
	    });
	});

/***/ },
/* 15 */
/*!************************************!*\
  !*** ./test/classes/World-test.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Entity = __webpack_require__(/*! classes/Entity */ 3);
	
	var _Entity2 = _interopRequireDefault(_Entity);
	
	var _World = __webpack_require__(/*! classes/World */ 2);
	
	var _World2 = _interopRequireDefault(_World);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	describe('Entity', function () {
	    var _this = this;
	
	    beforeEach(function () {
	        _this.world = new _World2.default(5, 5);
	    });
	
	    describe('add_unit', function () {});
	});

/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map