var View = require('./view');
var Game = require('./game');

$(function () {
  var containerEl = $('.connect4');
  var game = new Game();
  new View(game, containerEl);
});
