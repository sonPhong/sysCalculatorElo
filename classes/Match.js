class Match {
  constructor(players1, players2) {
    this.team1 = players1;
    this.team2 = players2;
    this.winner = this.determineWinner();
  }

  determineWinner() {
    // Tỉ lệ thắng thua ngẫu nhiên (ví dụ: 50/50)
    return Math.random() < 0.5 ? 1 : 2;
  }

  simulate() {
    return this.winner;
  }
}

module.exports = Match;