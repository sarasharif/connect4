

function aiPlayer () {

}

aiPlayer.makeMove = function () {
  return Math.floor(Math.random() * 7);
};


module.exports = aiPlayer;
