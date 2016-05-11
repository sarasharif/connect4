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
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	var Game = __webpack_require__(2);
	
	$(function () {
	  var containerEl = $('.connect4');
	  var game = new Game();
	  new View(game, containerEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	
	var View = function (game, $el) {
	  this.game = game;
	  this.$el = $el;
	
	  this.setupBoard();
	  this.bindEvents();
	};
	
	View.prototype.bindEvents = function () {
	  this.$el.on("click", "li", (function (clicker) {
	    var $col = $(clicker.currentTarget).parent();
	    this.makeMove($col);
	
	  }).bind(this));
	};
	
	View.prototype.makeMove = function ($col) {
	  var col = $col.data("col");
	  var currentPlayer = this.game.currentPlayer;
	
	
	  try {
	    this.game.playMove(col);
	  } catch (e) {
	    alert("invalid move! Try again");
	    return;
	  }
	
	  var $slot = $col.find("li.empty").last();
	  var $slots = $col.find("li.empty");
	  this.dropToken($slots, currentPlayer);
	
	  if (this.game.isOver()) {
	    this.$el.off("click");
	    this.$el.addClass("game-over");
	
	
	    var winner = this.game.winner()[0];
	    var winSeq = this.game.winner()[1];
	
	    if (winner) {
	      // debugger;
	      this.$el.addClass("winner-" + winner);
	      this.$el.prev().addClass("winner-" + winner);
	    }
	  }
	};
	
	View.prototype.dropToken = function ($slots, currentPlayer) {
	  var $currentSlot = $slots.first();
	  $currentSlot.removeClass("empty").addClass(currentPlayer);
	  setTimeout(this.dropAnimation.bind(this, $currentSlot, currentPlayer), 45);
	
	  $slots.last().addClass("animated bounce");
	};
	
	View.prototype.dropAnimation = function ($currentSlot, currentPlayer) {
	  if ($currentSlot.next("li").hasClass("empty")) {
	    $currentSlot.removeClass(currentPlayer).addClass("empty");
	    $currentSlot  = $currentSlot.next("li");
	    $currentSlot.removeClass("empty").addClass(currentPlayer);
	    setTimeout(this.dropAnimation.bind(this, $currentSlot, currentPlayer), 45);
	  }
	};
	
	View.prototype.setupBoard = function () {
	
	  var $div = $("<div>");
	  $div.addClass("board");
	
	    for (var colIdx = 0; colIdx < 7; colIdx++) {
	      var $ul = $("<ul>");
	
	      $ul.data("col", colIdx);
	
	        for (var rowIdx = 0; rowIdx < 6; rowIdx++) {
	          var $li = $("<li>");
	          $li.data("pos", [colIdx, rowIdx]);
	          $li.addClass("empty");
	
	          $ul.append($li);
	        }
	
	      $div.append($ul);
	    }
	    this.$el.append($div);
	};
	
	
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	var MoveError = __webpack_require__(4);
	
	function Game () {
	  this.board = new Board();
	  this.currentPlayer = Board.tokens[0];
	}
	
	Game.prototype.isOver = function () {
	  return this.board.isOver();
	};
	
	Game.prototype.playMove = function (col) {
	  this.board.dropToken(col, this.currentPlayer);
	  this.swapTurn();
	};
	
	Game.prototype.swapTurn = function () {
	  if (this.currentPlayer === Board.tokens[0]) {
	    this.currentPlayer = Board.tokens[1];
	  } else {
	    this.currentPlayer = Board.tokens[0];
	  }
	};
	
	Game.prototype.winner = function () {
	  return this.board.winner();
	};
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MoveError = __webpack_require__(4);
	
	function Board () {
	  this.grid = Board.makeGrid();
	}
	
	Board.makeGrid = function () {
	  var grid = [];
	
	  for (var i = 0; i < 7; i++) {
	    grid.push([]);
	    for (var j = 0; j < 6; j++) {
	      grid[i].push(null);
	    }
	  }
	
	  return grid;
	};
	
	Board.tokens = ["red", "blue"];
	
	Board.isValidCol = function (col) {
	  return (
	    (col >= 0 & col < 7)
	  );
	};
	
	Board.prototype.isEmptyCol = function (col) {
	  if (!Board.isValidCol(col)) {
	    throw new MoveError("Not a valid move!");
	  }
	
	  return (this.grid[col][0] === null);
	};
	
	Board.prototype.isOver = function () {
	  if (this.winner() !== null) {
	    return true;
	  }
	
	  for (var colIdx = 0; colIdx < 7; colIdx++) {
	    if (this.isEmptyCol(colIdx)) {
	      return false;
	    }
	  }
	
	  return true;
	};
	
	Board.prototype.dropToken = function (col, token) {
	
	  if (!this.isEmptyCol(col)) {
	    throw new MoveError("Not an empty column!");
	  }
	
	  for (rowIdx = 5; rowIdx >= 0; rowIdx--) {
	    if (this.grid[col][rowIdx] === null) { break; }
	  }
	
	  this.grid[col][rowIdx] = token;
	};
	
	
	Board.prototype.winner = function () {
	
	  var posSeqs = [
	    // horizontals
	    [[0, 0], [0, 1], [0, 2], [0, 3]],
	    [[1, 0], [1, 1], [1, 2], [1, 3]],
	    [[2, 0], [2, 1], [2, 2], [2, 3]],
	    [[3, 0], [3, 1], [3, 2], [3, 3]],
	    [[4, 0], [4, 1], [4, 2], [4, 3]],
	    [[5, 0], [5, 1], [5, 2], [5, 3]],
	    [[6, 0], [6, 1], [6, 2], [6, 3]],
	
	    [[0, 1], [0, 2], [0, 3], [0, 4]],
	    [[1, 1], [1, 2], [1, 3], [1, 4]],
	    [[2, 1], [2, 2], [2, 3], [2, 4]],
	    [[3, 1], [3, 2], [3, 3], [3, 4]],
	    [[4, 1], [4, 2], [4, 3], [4, 4]],
	    [[5, 1], [5, 2], [5, 3], [5, 4]],
	    [[6, 1], [6, 2], [6, 3], [6, 4]],
	
	    [[0, 2], [0, 3], [0, 4], [0, 5]],
	    [[1, 2], [1, 3], [1, 4], [1, 5]],
	    [[2, 2], [2, 3], [2, 4], [2, 5]],
	    [[3, 2], [3, 3], [3, 4], [3, 5]],
	    [[4, 2], [4, 3], [4, 4], [4, 5]],
	    [[5, 2], [5, 3], [5, 4], [5, 5]],
	    [[6, 2], [6, 3], [6, 4], [6, 5]],
	    // verticals
	    [[0, 0], [1, 0], [2, 0], [3, 0]],
	    [[1, 0], [2, 0], [3, 0], [4, 0]],
	    [[2, 0], [3, 0], [4, 0], [5, 0]],
	    [[3, 0], [4, 0], [5, 0], [6, 0]],
	
	    [[0, 1], [1, 1], [2, 1], [3, 1]],
	    [[1, 1], [2, 1], [3, 1], [4, 1]],
	    [[2, 1], [3, 1], [4, 1], [5, 1]],
	    [[3, 1], [4, 1], [5, 1], [6, 1]],
	
	    [[0, 2], [1, 2], [2, 2], [3, 2]],
	    [[1, 2], [2, 2], [3, 2], [4, 2]],
	    [[2, 2], [3, 2], [4, 2], [5, 2]],
	    [[3, 2], [4, 2], [5, 2], [6, 2]],
	
	    [[0, 3], [1, 3], [2, 3], [3, 3]],
	    [[1, 3], [2, 3], [3, 3], [4, 3]],
	    [[2, 3], [3, 3], [4, 3], [5, 3]],
	    [[3, 3], [4, 3], [5, 3], [6, 3]],
	
	    [[0, 4], [1, 4], [2, 4], [3, 4]],
	    [[1, 4], [2, 4], [3, 4], [4, 4]],
	    [[2, 4], [3, 4], [4, 4], [5, 4]],
	    [[3, 4], [4, 4], [5, 4], [6, 4]],
	
	    [[0, 5], [1, 5], [2, 5], [3, 5]],
	    [[1, 5], [2, 5], [3, 5], [4, 5]],
	    [[2, 5], [3, 5], [4, 5], [5, 5]],
	    [[3, 5], [4, 5], [5, 5], [6, 5]],
	    // diagonals
	    [[0, 0], [1, 1], [2, 2], [3, 3]],
	    [[1, 1], [2, 2], [3, 3], [4, 4]],
	    [[2, 2], [3, 3], [4, 4], [5, 5]],
	    [[1, 0], [2, 1], [3, 2], [4, 3]],
	    [[2, 1], [3, 2], [4, 3], [5, 4]],
	    [[3, 2], [4, 3], [5, 4], [6, 5]],
	
	    [[6, 0], [5, 1], [4, 2], [3, 3]],
	    [[5, 1], [4, 2], [3, 3], [2, 4]],
	    [[4, 2], [3, 3], [2, 4], [1, 5]],
	    [[5, 0], [4, 1], [3, 2], [2, 3]],
	    [[4, 1], [3, 2], [2, 3], [1, 4]],
	    [[3, 2], [2, 3], [1, 4], [0, 5]],
	
	    [[2, 0], [3, 1], [4, 2], [5, 3]],
	    [[3, 1], [4, 2], [5, 3], [6, 4]],
	    [[3, 0], [4, 1], [5, 2], [6, 3]],
	
	    [[4, 0], [3, 1], [2, 2], [1, 3]],
	    [[3, 1], [2, 2], [1, 3], [0, 4]],
	    [[3, 0], [2, 1], [1, 2], [0, 3]],
	
	    [[0, 1], [1, 2], [2, 3], [3, 4]],
	    [[1, 2], [2, 3], [3, 4], [4, 5]],
	    [[0, 2], [1, 3], [2, 4], [3, 5]],
	
	    [[2, 5], [3, 4], [4, 3], [5, 2]],
	    [[3, 4], [4, 3], [5, 2], [6, 1]],
	    [[3, 5], [4, 4], [5, 3], [6, 2]],
	
	
	  ];
	
	    for (var i = 0; i < posSeqs.length; i++) {
	      var winner = this.winnerHelper(posSeqs[i]);
	      if (winner !== null) {
	        return [winner, posSeqs[i]];
	      }
	    }
	  return null;
	};
	
	Board.prototype.winnerHelper = function (posSeq) {
	  for (var tokenIdx = 0; tokenIdx < Board.tokens.length; tokenIdx++) {
	    var targetToken = Board.tokens[tokenIdx];
	    var winner = true;
	    for (var posIdx = 0; posIdx < 4; posIdx++) {
	      var pos = posSeq[posIdx];
	      var token = this.grid[pos[0]][pos[1]];
	
	      if (token !== targetToken) {
	        winner = false;
	      }
	    }
	
	    if (winner) {
	      return targetToken;
	    }
	  }
	
	  return null;
	};
	
	module.exports = Board;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function MoveError (msg) {
	  this.msg = msg;
	}
	
	module.exports = MoveError;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map