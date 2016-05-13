var posSeqs = require("./posSeqs");

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
