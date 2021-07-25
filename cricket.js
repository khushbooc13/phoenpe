const prompt = require("prompt-sync")();
var Player = function () {
  var _playerName;
  var _score;
  var _noOfFours;
  var _noOfSixes;
  var _isOnStrike;
  var _noOfBalls;
  var _isOut;

  function init(type, playerName) {
    // BATSMAN ,BALLER
    _type = type;
    _playerName = playerName;

    _score = 0;
    _noOfSixes = 0;
    _noOfFours = 0;
    _noOfBalls = 0;
    _isOut = 0;
  }

  // 0 -> Strike Changed
  // 1 -> StillOnStrike
  // 2 -> Out
  // return value (isStrike, scoredOnCurrBall)
  function addScore(scored, isLastBall) {
    if (scored === "W") {
      _noOfBalls++;
      _isOut = true;
      return [2, -1];
    }

    if (scored === "NB") {
      _score++;
      return [1, 1];
    }

    _noOfBalls++;
    if (scored == 6) {
      _score += 6;
      _noOfSixes++;
      return isLastBall ? 0 : [1, 6];
    }
    if (scored == 4) {
      _score += 4;
      _noOfFours++;
      return isLastBall ? 0 : [1, 4];
    }
    _score += scored;
    var newStrike = scored % 2 == 1 || isLastBall ? 0 : 1;
    return [newStrike, scored];
  }

  function getScore() {
    return {
      playerName: _playerName,
      six: _noOfSixes,
      four: _noOfFours,
      totalBall: _noOfBalls,
      score: _score,
      out: _isOut,
    };
  }

  return {
    init: init,
    addScore: addScore,
    getScore: getScore,
  };
};

var Team = function () {
  var _teamName;
  var players = [];
  var score;
  var wickets;

  var batsman;
  var nonStrike;
  var nextPlayerIndex;

  function init(teamName, noOfPlayers) {
    _teamName = teamName;
    for (var i = 0; i < noOfPlayers; i++) {
      var playerName = prompt("Enter Player name");
      player = Player();
      player.init("BATSMAN", playerName);
      players.push(player);
    }

    score = 0;
    target = 0;
    wickets = 0;

    batsman = players[0];
    nonStrike = players[1];
    nextPlayerIndex = 2;
  }

  function genrateScorecard() {
    console.log(`Total: ${score}/${wickets}`);
    for (let i = 0; i < players.length; i++) {
      console.log(players[i].getScore());
    }
    return score;
  }

  function playOver() {
    let ballsPlayedSoFar = 6; // does not include extras
    while (ballsPlayedSoFar != 0) {
      var isLastBall = false;
      var special = prompt("is it a W, Enter Y or N");
      if (special === "Y") {
        s = prompt("Enter value for W");
        play(s, isLastBall);
      } else if (special !== "Y") {
        ball = Number(prompt("Enter ball"));
        play(ball, isLastBall);
      }
      if (ballsPlayedSoFar == 1) isLastBall = true;
      if ((ball || s) != "NB") ballsPlayedSoFar--;
    }
  }

  function play(ball, isLastBall) {
    var state = batsman.addScore(
      typeof ball === "number" ? parseInt(ball) : ball,
      isLastBall
    );
    if (state[1] != -1) score += state[1];
    if (state[0] == 0) {
      var temp = batsman;
      batsman = nonStrike;
      nonStrike = temp;
    }

    if (state[0] == 2) {
      if (nextPlayerIndex > players.length - 1) {
        return false;
      }

      wickets++;
      batsman = players[nextPlayerIndex];
      nextPlayerIndex++;
    }
    return true;
  }

  return {
    init: init,
    genrateScorecard: genrateScorecard,
    playOver: playOver,
  };
};

let noOPlayersTeam = 5; // input
let noOfOvers = 2; // input

// team 1
team1 = Team();
team1.init("TEAM 1", noOPlayersTeam);
let team1Total = 0,
  team2Total = 0;
for (var i = 0; i < noOfOvers; i++) {
  team1.playOver();
  team1Total = team1.genrateScorecard();
}

team2 = Team();
team2.init("TEAM 2", noOPlayersTeam);
for (var i = 0; i < noOfOvers; i++) {
  team2.playOver();
  team2Total = team2.genrateScorecard();
}

console.log(
  team1Total > team2Total
    ? `Team1 won the match by ${team1Total - team2Total}`
    : `Team2 won the match by ${team2Total - team1Total}`
);
