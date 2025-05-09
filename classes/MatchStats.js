class MatchStats {
  generate(players) {
    let totalMatches = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let totalDraws = 0;

    players.forEach(player => {
      player.history.forEach(match => {
        if (match.win === true) totalWins++;
        else if (match.win === false) totalLosses++;
        else if (match.win === null) totalDraws++;
        totalMatches++;
      });
    });

    return { totalMatches, totalWins, totalLosses, totalDraws };
  }

  generatePlayerStats(player) {
    return {
      playerId: player.id,
      playerName: player.name,
      wins: player.wins,
      losses: player.losses,
      winRate: (player.getWinRate() * 100).toFixed(2) + '%',
      initialElo: player.initialElo,
      currentElo: player.elo,
    };
  }

  generateAllPlayerStats(players) {
    return players.map(this.generatePlayerStats);
  }

  generateEloHistory(player) {
    return player.history.map(h => ({ elo: h.newElo, time: new Date() })); 
  }

  findCommonOpponents(players) {
    const opponentStats = {};
    players.forEach(p1 => {
      opponentStats[p1.id] = {};
      p1.matchHistory.forEach(match1 => {
        match1.opponentTeam.forEach(opponentId => {
          if (!opponentStats[p1.id][opponentId]) {
            opponentStats[p1.id][opponentId] = { played: 0, wins: 0 };
          }
          opponentStats[p1.id][opponentId].played++;
          if (match1.win) {
            opponentStats[p1.id][opponentId].wins++;
          }
        });
      });
    });
    return opponentStats;
  }

  generatePerformanceReport(players) {
    const sortedByEloGain = [...players].sort((a, b) => (b.elo - b.initialElo) - (a.elo - a.initialElo)).slice(0, 5);
    const sortedByWinRate = [...players].sort((a, b) => b.getWinRate() - a.getWinRate()).slice(0, 5);

    return {
      topEloGain: sortedByEloGain.map(p => ({ name: p.name, eloGain: p.elo - p.initialElo })),
      topWinRate: sortedByWinRate.map(p => ({ name: p.name, winRate: (p.getWinRate() * 100).toFixed(2) + '%' })),
    };
  }
}

module.exports = MatchStats;