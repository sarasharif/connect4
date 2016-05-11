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

View.prototype.bindResetEvent = function () {
  this.$el.on("click", "li", (function (clicker) {
    this.resetGame();
  }).bind(this));

  this.$el.on("click", "ul", (function (clicker) {
    this.resetGame();
  }).bind(this));

  this.$el.on("click", "h1", (function (clicker) {
    this.resetGame();
  }).bind(this));

};

View.prototype.resetGame = function() {
  var winner = this.game.winner()[0];
  this.$el.removeClass("winner-" + winner);
  this.$el.prev().removeClass("winner-" + winner)
  this.$el.off("click");
  this.game = new Game();
  this.setupBoard();
  this.bindEvents();
};


View.prototype.makeMove = function ($col) {
  var col = $col.data("col");
  var currentPlayer = this.game.currentPlayer;


  try {
    this.game.playMove(col);
  } catch (e) {
    return;
  }

  var $slot = $col.find("li.empty").last();
  var $slots = $col.find("li.empty");
  this.dropToken($slots, currentPlayer);

  if (this.game.isOver()) {
    this.$el.off("click");

    var winner = this.game.winner()[0];
    var winSeq = this.game.winner()[1];

    if (winner) {
      this.$el.addClass("winner-" + winner);
      this.$el.prev().addClass("winner-" + winner);
    }

    this.bindResetEvent();
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
