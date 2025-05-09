
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

    const scoreTeam1 = winner === 1 ? 1 : 0.5; // Giả sử có thể có logic hòa ở Elo level nếu cần
    const scoreTeam2 = 1 - scoreTeam1;

    const eloChanges = {
      team1: {},
      team2: {}
    };

    team1.forEach(player => {
      const expected = this.expectedScore(player.elo, avgElo2);
      const newElo = player.elo + this.kFactor * (scoreTeam1 - expected);
      const eloChange = newElo - player.elo;
      player.updateElo(newElo, eloChange);
      eloChanges.team1[player.id] = eloChange;
    });

    team2.forEach(player => {
      const expected = this.expectedScore(player.elo, avgElo1);
      const newElo = player.elo + this.kFactor * (scoreTeam2 - expected);
      const eloChange = newElo - player.elo;
      player.updateElo(newElo, eloChange);
      eloChanges.team2[player.id] = eloChange;
    });

    return eloChanges; // Trả về đối tượng chứa elo changes cho từng đội và người chơi
  }
}


module.exports = EloScore;