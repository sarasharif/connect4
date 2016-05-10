var MoveError = require("./moveError");

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

Board.prototype.print = function () {
  var strs = [];
  for (var colIdx = 0; colIdx < 7; colIdx++) {
    var tokens = [];
    for (var rowIdx = 0; rowIdx < 6; rowIdx++) {
      tokens.push(
        this.grid[colIdx][rowIdx] ? this.grid[colIdx][rowIdx] : " "
      );
    }

    strs.push(tokens.join("|") + "\n");
  }

  console.log(strs.join("-----\n"));
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
  ];

    for (var i = 0; i < posSeqs.length; i++) {
      var winner = this.winnerHelper(posSeqs[i]);
      if (winner !== null) {
        return winner;
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
