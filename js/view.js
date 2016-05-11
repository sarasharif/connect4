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
      this.$el.addClass("winner-" + winner);
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
