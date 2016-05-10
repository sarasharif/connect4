var Board = require("./board");
var MoveError = require("./moveError");

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

Game.prototype.promptMove = function (reader, callback) {
  var game = this;

  this.board.print();

  reader.question("Enter col: ", function (colIdxStr) {
    var colIdx = parseInt(colIdx);
  });
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
