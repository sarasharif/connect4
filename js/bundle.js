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
	var aiPlayer = __webpack_require__(5);
	var posSeqs = __webpack_require__(4);
	
	var View = function (game, $el) {
	  this.game = game;
	  this.$el = $el;
	  this.computer = new aiPlayer();
	
	  this.setupBoard();
	  this.bindEvents();
	};
	
	View.prototype.bindEvents = function () {
	  this.$el.on("click", "li", (function (clicker) {
	    $('.click-defense').addClass('activated');
	    var $col = $(clicker.currentTarget).parent();
	    this.makeMove($col);
	  }).bind(this));
	};
	
	View.prototype.bindResetEvent = function () {
	  var winner = this.game.winner()[0];
	  $('.click-defense').removeClass('activated');
	  this.$el.on("click", "li", (function (clicker) {
	   this.resetGame(winner);
	  }).bind(this));
	};
	
	View.prototype.resetGame = function(winner) {
	  this.$el.removeClass("winner-" + winner);
	  this.$el.prev().removeClass("winner-" + winner);
	  this.$el.children("div").remove();
	  winner = null;
	  this.game = new Game();
	  this.setupBoard();
	  this.$el.off("click");
	  this.bindEvents();
	};
	
	
	View.prototype.makeMove = function ($col) {
	  var col = $col.attr("col");
	  var currentPlayer = this.game.currentPlayer;
	  var success = true;
	  try {
	    this.game.playMove(col);
	  } catch (e) {
	    success = false;
	    $('.click-defense').removeClass('activated');
	    return;
	  } finally {
	    if (success) {
	      this.finishMove($col, "human", currentPlayer);
	    } else {
	      return;
	    }
	
	  }
	
	};
	
	View.prototype.getAImove = function () {
	
	  var currentPlayer = this.game.currentPlayer;
	  var col = this.computer.makeMove(this.game);
	
	
	  var $col = $("ul[col='"+ col +"']");
	
	  try {
	    this.game.playMove(col);
	  } catch (e) {
	    this.getAImove();
	  } finally {
	    this.finishMove($col, "computer", currentPlayer);
	  }
	
	};
	
	View.prototype.finishMove = function ($col, user, currentPlayer) {
	  var $slots = $col.find("li.empty");
	  this.dropToken($slots, user, currentPlayer);
	
	  if (this.game.isOver()) {
	    this.$el.off("click");
	
	    var winner = this.game.winner()[0];
	    var winSeq = this.game.winner()[1];
	    this.bindResetEvent(winner);
	
	    if (winner) {
	      this.$el.addClass("winner-" + winner);
	      this.$el.prev().addClass("winner-" + winner);
	
	      for (var i = 0; i < winSeq.length; i++) {
	        $("li[pos='"+ winSeq[i] +"']").addClass("winners");
	      }
	    }
	
	  } else {
	    if (user === "human") {
	      setTimeout(this.getAImove.bind(this), 700);
	    } else {
	      return;
	    }
	  }
	
	
	};
	
	
	View.prototype.dropToken = function ($slots, user, currentPlayer) {
	  var $currentSlot = $slots.first();
	  $currentSlot.removeClass("empty").addClass(currentPlayer);
	  setTimeout(this.dropAnimation.bind(this, $currentSlot, user, currentPlayer), 45);
	
	  $slots.last().addClass("animated bounce");
	};
	
	View.prototype.dropAnimation = function ($currentSlot, user, currentPlayer) {
	  if ($currentSlot.next("li").hasClass("empty")) {
	    $currentSlot.removeClass(currentPlayer).addClass("empty");
	    $currentSlot  = $currentSlot.next("li");
	    $currentSlot.removeClass("empty").addClass(currentPlayer);
	    setTimeout(this.dropAnimation.bind(this, $currentSlot, user, currentPlayer), 45);
	
	  } else if (user === "computer"){
	    $('.click-defense').removeClass('activated');
	  }
	};
	
	View.prototype.setupBoard = function () {
	  var $div = $("<div>");
	  $div.addClass("board");
	    for (var colIdx = 0; colIdx < 7; colIdx++) {
	      var $ul = $("<ul>");
	      $ul.attr("col", colIdx);
	        for (var rowIdx = 0; rowIdx < 6; rowIdx++) {
	          var $li = $("<li>");
	          $li.attr("pos", [colIdx, rowIdx]);
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

	var posSeqs = __webpack_require__(4);
	
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
	  var winSeqs = []; var winner = null;
	  for (var i = 0; i < posSeqs.length; i++) {
	    winner = this.winnerHelper(posSeqs[i]);
	    if (winner !== null) {
	      var winSeqArray = posSeqs[i];
	      winSeqString = posSeqs[i].map(function(tuple) {
	        return tuple.toString();
	      });
	      winSeqs = winSeqs.concat(winSeqString);
	    }
	  }
	  if (winSeqs.length > 0) {
	    return [this.winnerHelper(winSeqArray), winSeqs];
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

	module.exports = [
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var posSeqs = __webpack_require__(4);
	
	function aiPlayer () {
	  this.posSeqs = posSeqs;
	}
	
	aiPlayer.prototype.makeMove = function (game) {
	  this.grid = game.board.grid;
	  if (this.makeWinningMove()) {
	    return this.makeWinningMove() - 1;
	  } else if (this.makeDefensiveMove()) {
	    return this.makeDefensiveMove() - 1;
	  } else {
	    return this.makeRandomMove() - 1;
	  }
	};
	
	aiPlayer.prototype.makeWinningMove = function () {
	
	  var contains3of4 = [];
	
	  for (var i = 0; i < this.posSeqs.length; i++) {
	    var curSeq = this.posSeqs[i]; var count = 0;
	    for (var j = 0; j < 4; j++) {
	      if (this.grid[curSeq[j][0]][curSeq[j][1]] === "blue") {
	        count++;
	        if (count === 3) {
	          contains3of4.push(curSeq);
	        }
	      }
	    }
	  }
	
	  for (var k = 0; k < contains3of4.length; k++ ) {
	    var curSeq = contains3of4[k]; var that = this;
	    var curSeqcolors = curSeq.map(function (el) {
	      return that.grid[el[0]][el[1]];
	    });
	    var fourth = curSeqcolors.indexOf(null);
	    if (fourth > -1 && this.isAvailableSlot(curSeq[fourth]))  {
	      return curSeq[fourth][0] + 1;
	    }
	  }
	};
	
	aiPlayer.prototype.isAvailableSlot = function (pos) {
	  return (pos[1] === 5 || this.grid[pos[0]][pos[1]+1] !== null);
	};
	
	aiPlayer.prototype.makeDefensiveMove = function () {
	  var contains3of4 = [];
	
	  for (var i = 0; i < this.posSeqs.length; i++) {
	    var curSeq = this.posSeqs[i]; var count = 0;
	    for (var j = 0; j < 4; j++) {
	      if (this.grid[curSeq[j][0]][curSeq[j][1]] === "red") {
	        count++;
	        if (count === 3) {
	          contains3of4.push(curSeq);
	        }
	      }
	    }
	  }
	
	  for (var i = 0; i < contains3of4.length; i++ ) {
	    var curSeq = contains3of4[i]; var that = this;
	    var curSeqcolors = curSeq.map(function (el) {
	      return that.grid[el[0]][el[1]];
	    });
	    var fourth = curSeqcolors.indexOf(null);
	    if (fourth > -1 && this.isAvailableSlot(curSeq[fourth]))  {
	      return curSeq[fourth][0] + 1;
	    }
	  }
	};
	
	aiPlayer.prototype.makeRandomMove = function () {
	  return Math.floor(Math.random() * 7) + 1;
	};
	
	
	
	
	module.exports = aiPlayer;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map