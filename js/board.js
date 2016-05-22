var MoveError = require("./moveError");
var posSeqs = require("./posSeqs");

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
// 
// Board.prototype.openRow = function (col) {
//   this.grid[col].each
//
// };

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

    for (var i = 0; i < posSeqs.length; i++) {
      var winner = this.winnerHelper(posSeqs[i]);
      if (winner !== null) {
        winSeq = posSeqs[i].map(function(tuple) {
          return tuple.toString();
        });
        return [winner, winSeq];
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
