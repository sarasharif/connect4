var Game = require("./game");

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
  // debugger;
  var col = $col.data("col");
  var currentPlayer = this.game.currentPlayer;


  try {
    this.game.playMove(col);
  } catch (e) {
    alert("invalid move! Try again");
    return;
  }

  var $slot = $col.find("li.empty").last();
  $slot.removeClass("empty").addClass(currentPlayer);

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

  for (var colIdx = 0; colIdx < 7; colIdx++) {
    var $ul = $("<ul>");

    $ul.data("col", colIdx);

      for (var rowIdx = 0; rowIdx < 6; rowIdx++) {
        var $li = $("<li>");
        $li.data("col", [colIdx, rowIdx]);
        $li.addClass("empty");

        $ul.append($li);
      }
    this.$el.append($ul);
  }
};



module.exports = View;
