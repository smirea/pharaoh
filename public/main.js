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
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _Engine = __webpack_require__(/*! classes/Engine */ 1);
	
	var _Engine2 = _interopRequireDefault(_Engine);
	
	var _World = __webpack_require__(/*! classes/World */ 2);
	
	var _World2 = _interopRequireDefault(_World);
	
	var _constants = __webpack_require__(/*! utils/constants */ 6);
	
	var _path = __webpack_require__(/*! utils/path */ 7);
	
	var _Entity = __webpack_require__(/*! classes/Entity */ 3);
	
	var _Entity2 = _interopRequireDefault(_Entity);
	
	var _Road = __webpack_require__(/*! classes/infrastructure/Road */ 5);
	
	var _Road2 = _interopRequireDefault(_Road);
	
	var _HouseIndex = __webpack_require__(/*! classes/HouseIndex */ 10);
	
	var HouseIndex = _interopRequireWildcard(_HouseIndex);
	
	var _PoliceStation = __webpack_require__(/*! classes/PoliceStation */ 12);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var engine = new _Engine2.default({
	    fps: 30,
	    world: {
	        width: 12,
	        height: 14
	    }
	});
	
	var road = function road(w, pos, direction, size) {
	    --size;
	    var end = (0, _path.move)(pos, direction, size);
	    w.fill(pos, end, _Road2.default);
	    return end;
	};
	
	var roadChain = function roadChain(w, pos) {
	    for (var _len = arguments.length, sections = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	        sections[_key - 2] = arguments[_key];
	    }
	
	    sections.forEach(function (_ref, index) {
	        var _ref2 = _slicedToArray(_ref, 2),
	            dir = _ref2[0],
	            size = _ref2[1];
	
	        if (index > 0) pos = (0, _path.move)(pos, dir);
	        pos = road(w, pos, dir, size);
	    });
	};
	
	roadChain(engine.world, [2, 4], [_constants.DIR.RIGHT, 7], [_constants.DIR.DOWN, 6], [_constants.DIR.LEFT, 6], [_constants.DIR.UP, 5]);
	roadChain(engine.world, [5, 5], [_constants.DIR.DOWN, 5]);
	roadChain(engine.world, [3, 7], [_constants.DIR.RIGHT, 2]);
	roadChain(engine.world, [6, 7], [_constants.DIR.RIGHT, 2]);
	engine.world.add_entity([3, 3], HouseIndex.SmallHouse);
	engine.world.add_unit(new _PoliceStation.Policeman(engine.world, [3, 4]));
	engine.world.add_unit(new _PoliceStation.Policeman(engine.world, [5, 8]));
	engine.world.print();
	window.interval = setInterval(function () {
	    engine.step();
	}, 250);
	
	window.engine = engine;

/***/ },
/* 1 */
/*!*******************************!*\
  !*** ./src/classes/Engine.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _World = __webpack_require__(/*! classes/World */ 2);
	
	var _World2 = _interopRequireDefault(_World);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Engine = function () {
	    function Engine(options) {
	        _classCallCheck(this, Engine);
	
	        this.options = options;
	        this.world = new _World2.default(options.world.width, options.world.height);
	    }
	
	    _createClass(Engine, [{
	        key: 'start',
	        value: function start() {}
	    }, {
	        key: 'stop',
	        value: function stop() {}
	    }, {
	        key: 'step',
	        value: function step() {
	            this.world.step();
	        }
	    }]);
	
	    return Engine;
	}();
	
	exports.default = Engine;

/***/ },
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
/* 10 */
/*!***********************************!*\
  !*** ./src/classes/HouseIndex.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.LargeHouse = exports.MediumHouse = exports.SmallHouse = exports.VacantLot = exports.House = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _World = __webpack_require__(/*! classes/World */ 2);
	
	var _World2 = _interopRequireDefault(_World);
	
	var _Building2 = __webpack_require__(/*! classes/Building */ 11);
	
	var _Building3 = _interopRequireDefault(_Building2);
	
	var _Road = __webpack_require__(/*! classes/infrastructure/Road */ 5);
	
	var _Road2 = _interopRequireDefault(_Road);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var House = exports.House = function (_Building) {
	    _inherits(House, _Building);
	
	    function House() {
	        _classCallCheck(this, House);
	
	        return _possibleConstructorReturn(this, (House.__proto__ || Object.getPrototypeOf(House)).apply(this, arguments));
	    }
	
	    _createClass(House, [{
	        key: 'on_add_to_world',
	        value: function on_add_to_world() {
	            if (!this.get_adjacent_road()) console.warn(this.constructor.name + ' must be placed near a road');
	        }
	    }]);
	
	    return House;
	}(_Building3.default);
	
	House.COLOR = 'orange';
	
	var VacantLot = exports.VacantLot = function (_House) {
	    _inherits(VacantLot, _House);
	
	    function VacantLot() {
	        _classCallCheck(this, VacantLot);
	
	        return _possibleConstructorReturn(this, (VacantLot.__proto__ || Object.getPrototypeOf(VacantLot)).apply(this, arguments));
	    }
	
	    return VacantLot;
	}(House);
	
	var SmallHouse = exports.SmallHouse = function (_House2) {
	    _inherits(SmallHouse, _House2);
	
	    function SmallHouse() {
	        _classCallCheck(this, SmallHouse);
	
	        return _possibleConstructorReturn(this, (SmallHouse.__proto__ || Object.getPrototypeOf(SmallHouse)).apply(this, arguments));
	    }
	
	    return SmallHouse;
	}(House);
	
	var MediumHouse = exports.MediumHouse = function (_House3) {
	    _inherits(MediumHouse, _House3);
	
	    function MediumHouse() {
	        _classCallCheck(this, MediumHouse);
	
	        return _possibleConstructorReturn(this, (MediumHouse.__proto__ || Object.getPrototypeOf(MediumHouse)).apply(this, arguments));
	    }
	
	    return MediumHouse;
	}(House);
	
	MediumHouse.WIDTH = 2;
	MediumHouse.HEIGHT = 2;
	
	var LargeHouse = exports.LargeHouse = function (_House4) {
	    _inherits(LargeHouse, _House4);
	
	    function LargeHouse() {
	        _classCallCheck(this, LargeHouse);
	
	        return _possibleConstructorReturn(this, (LargeHouse.__proto__ || Object.getPrototypeOf(LargeHouse)).apply(this, arguments));
	    }
	
	    return LargeHouse;
	}(House);
	
	LargeHouse.WIDTH = 3;
	LargeHouse.HEIGHT = 3;

/***/ },
/* 11 */
/*!*********************************!*\
  !*** ./src/classes/Building.js ***!
  \*********************************/
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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Building = function (_Entity) {
	    _inherits(Building, _Entity);
	
	    function Building() {
	        _classCallCheck(this, Building);
	
	        return _possibleConstructorReturn(this, (Building.__proto__ || Object.getPrototypeOf(Building)).apply(this, arguments));
	    }
	
	    _createClass(Building, [{
	        key: 'get_adjacent_road',
	        value: function get_adjacent_road() {
	            var _this2 = this;
	
	            var _pos = _slicedToArray(this.pos, 2),
	                x = _pos[0],
	                y = _pos[1];
	
	            var result = null;
	            this.each_adjacent(1, function (x, y) {
	                var entity = _this2.world.layer_map.entity[y][x];
	                if (entity instanceof _Road2.default) {
	                    result = entity;
	                    return false;
	                }
	            });
	            return result;
	        }
	    }]);
	
	    return Building;
	}(_Entity3.default);
	
	exports.default = Building;

/***/ },
/* 12 */
/*!**************************************!*\
  !*** ./src/classes/PoliceStation.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Policeman = undefined;
	
	var _Building2 = __webpack_require__(/*! classes/Building */ 11);
	
	var _Building3 = _interopRequireDefault(_Building2);
	
	var _Unit2 = __webpack_require__(/*! classes/Unit */ 4);
	
	var _Unit3 = _interopRequireDefault(_Unit2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var PoliceStation = function (_Building) {
	    _inherits(PoliceStation, _Building);
	
	    function PoliceStation() {
	        _classCallCheck(this, PoliceStation);
	
	        return _possibleConstructorReturn(this, (PoliceStation.__proto__ || Object.getPrototypeOf(PoliceStation)).apply(this, arguments));
	    }
	
	    return PoliceStation;
	}(_Building3.default);
	
	PoliceStation.COLOR = 'black';
	exports.default = PoliceStation;
	
	var Policeman = exports.Policeman = function (_Unit) {
	    _inherits(Policeman, _Unit);
	
	    function Policeman() {
	        _classCallCheck(this, Policeman);
	
	        return _possibleConstructorReturn(this, (Policeman.__proto__ || Object.getPrototypeOf(Policeman)).apply(this, arguments));
	    }
	
	    return Policeman;
	}(_Unit3.default);
	
	Policeman.COLOR = 'blue';

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map