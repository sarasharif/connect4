var Game = require("./game");
var aiPlayer = require("./ai");
var posSeqs = require("./posSeqs");

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

      $("li[pos='"+ winSeq[0] +"']").addClass("winners");
      $("li[pos='"+ winSeq[1] +"']").addClass("winners");
      $("li[pos='"+ winSeq[2] +"']").addClass("winners");
      $("li[pos='"+ winSeq[3] +"']").addClass("winners");
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
