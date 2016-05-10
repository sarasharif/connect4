var Game = require("./game");

var View = function (game, $el) {
  this.game = game;
  this.$el = $el;

  this.setupBoard();
  this.bindEvents();
};

View.prototype.bindEvents = function () {
  this.$el.on("click", "li", (function (clicker) {
    var $slot = $(clicker.currentTarget);
    this.makeMove($slot);
  }).bind(this));
};

View.prototype.makeMove = function ($slot) {
  var pos = $slot.data("col");
  var currentPlayer = this.game.currentPlayer;

  try {
    this.game.playMove(col);
  } catch (e) {
    alert("invalid move! Try again");
    return;
  }

  $slot.addClass(currentPlayer);

  if (this.game.isOver()) {
    this.$el.off("click");
    this.$el.addClass("game-over");

    var winner = this.game.winner();
    var $figcaption = $("<figcaption>");

    if (winner) {
      this.$el.addClass("winner-" + winner);
      $figcaption.html("You win, " + winner + "!");
    } else {
      $figcaption.html("It's a draw!");
    }

    this.$el.append($figcaption);
  }
};


View.prototype.setupBoard = function () {
  var $ul = $("<ul>");
  $ul.addClass("group");

  for (var colIdx = 0; colIdx < 7; colIdx++) {
    for (var rowIdx = 0; rowIdx < 6; rowIdx++) {
      var $li = $("<li>");
      $li.data("col", [colIdx, rowIdx]);

      $ul.append($li);
    }
  }

  this.$el.append($ul);
};



module.exports = View;
