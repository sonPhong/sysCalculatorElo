class EloScore {
  constructor(kFactor = 32) {
    this.kFactor = kFactor;
  }

  setKFactor(newK) {
    this.kFactor = newK;
  }

  expectedScore(ratingA, ratingB) {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  updateElo(playerA, playerB, scoreA) {
    const expectedA = this.expectedScore(playerA.elo, playerB.elo);
    const expectedB = this.expectedScore(playerB.elo, playerA.elo);

    const newEloA = playerA.elo + this.kFactor * (scoreA - expectedA);
    const newEloB = playerB.elo + this.kFactor * ((1 - scoreA) - expectedB);

    const eloChangeA = newEloA - playerA.elo;
    const eloChangeB = newEloB - playerB.elo;

    playerA.updateElo(newEloA, eloChangeA);
    playerB.updateElo(newEloB, eloChangeB);

    return { playerA, playerB, eloChangeA, eloChangeB };
  }

  updateMatchElo(team1, team2, winner) {
    const avgElo1 = team1.reduce((sum, p) => sum + p.elo, 0) / team1.length;
    const avgElo2 = team2.reduce((sum, p) => sum + p.elo, 0) / team2.length;

    const scoreTeam1 = winner === 1 ? 1 : 0;

    const updatedPlayers = [];

    team1.forEach(player => {
      const expected = this.expectedScore(player.elo, avgElo2);
      const newElo = player.elo + this.kFactor * (scoreTeam1 - expected);
      const eloChange = newElo - player.elo;
      player.updateElo(newElo, eloChange);
      player.recordMatch(team2.map(p => p.id), winner === 1, player.elo - eloChange, eloChange);
      updatedPlayers.push(player);
    });

    team2.forEach(player => {
      const expected = this.expectedScore(player.elo, avgElo1);
      const newElo = player.elo + this.kFactor * ((1 - scoreTeam1) - expected);
      const eloChange = newElo - player.elo;
      player.updateElo(newElo, eloChange);
      player.recordMatch(team1.map(p => p.id), winner === 2, player.elo - eloChange, eloChange);
      updatedPlayers.push(player);
    });

    return updatedPlayers;
  }
}

module.exports = EloScore;