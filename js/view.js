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

View.prototype.bindResetEvent = function (winner) {
  this.$el.on("click", "li", (function (clicker) {
    this.resetGame(winner);
  }).bind(this));

  // this.$el.on("click", "ul", (function (clicker) {
  //   this.resetGame();
  // }).bind(this));
  //
  // this.$el.on("click", "h1", (function (clicker) {
  //   this.resetGame();
  // }).bind(this));

};

View.prototype.resetGame = function(winner) {
  this.$el.removeClass("winner-" + winner);
  this.$el.prev().removeClass("winner-" + winner);
  this.$el.children("div").remove();
  winner = null;
  this.$el.off("click");
  this.game = new Game();
  this.setupBoard();
  this.bindEvents();
};


View.prototype.makeMove = function ($col) {
  this.$el.off("click");
  var col = $col.attr("col");
  var currentPlayer = this.game.currentPlayer;

  try {
    this.game.playMove(col);
  } catch (e) {
    return;
  }

  this.finishMove($col, "human", currentPlayer);

};

View.prototype.makeAImove = function () {
  // this.$el.off("click");


  var col = Math.floor(Math.random() * 7);
  var currentPlayer = this.game.currentPlayer;
  var $col = $("ul[col='"+ col +"']");

  try {
    this.game.playMove(col);
  } catch (e) {
    this.makeAImove();
  }

  this.finishMove($col, "computer", currentPlayer);
};

View.prototype.finishMove = function ($col, user, currentPlayer) {
  var $slots = $col.find("li.empty");
  this.dropToken($slots, currentPlayer);

  if (this.game.isOver()) {
    this.$el.off("click");

    var winner = this.game.winner()[0];
    var winSeq = this.game.winner()[1];

    if (winner) {
      this.$el.addClass("winner-" + winner);
      this.$el.prev().addClass("winner-" + winner);

      $("li[pos='"+ winSeq[0] +"']").addClass("winners");
      $("li[pos='"+ winSeq[1] +"']").addClass("winners");
      $("li[pos='"+ winSeq[2] +"']").addClass("winners");
      $("li[pos='"+ winSeq[3] +"']").addClass("winners");
    }

    this.bindResetEvent(winner);

  } else {
    if (user === "human") {
      setTimeout(this.makeAImove.bind(this), 700);
    } else {
      this.bindEvents();
      return;
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
