class Player {
  constructor(id, name, status, elo, type, rank, history = [], wins = 0, losses = 0, matchHistory = [], initialElo) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.elo = Math.round(elo);
    this.type = type;
    this.rank = rank;
    this.history = history;
    this.wins = wins;
    this.losses = losses;
    this.matchHistory = matchHistory;
    this.initialElo = initialElo !== undefined ? Math.round(initialElo) : Math.round(elo);
  }

  updateElo(newElo, eloChange) {
    this.elo = Math.round(newElo);
    this.history.push({ win: null, eloBefore: this.elo - eloChange, newElo: this.elo, eloChange: eloChange });
    this.updateType();
  }

  updateType() {
    this.type = this.elo < 500 ? 0 : 1;
  }

  updateRank(ranking) {
    this.rank = ranking.getRank(this.elo);
  }

  recordMatch(opponentTeamIds, win, eloBefore, eloChange) {
    this.history.push({ win: win, eloBefore: eloBefore, newElo: this.elo, eloChange: eloChange });
    if (win) {
      this.wins++;
    } else if (win !== null) {
      this.losses++;
    }
    this.updateMatchHistory(opponentTeamIds, win, this.elo);
  }

  updateMatchHistory(opponentTeamIds, win, newElo) {
    this.matchHistory.push({
      opponentTeam: opponentTeamIds,
      win: win,
      newElo: newElo,
    });
  }

  getWinRate() {
    if (this.wins + this.losses === 0) {
      return 0;
    }
    return this.wins / (this.wins + this.losses);
  }

  getMatchHistoryDetail(allPlayers) {
    return this.matchHistory.map(match => {
      const opponentNames = match.opponentTeam.map(id => {
        const player = allPlayers.find(p => p.id === id);
        return player ? player.name : 'Unknown Player';
      }).join(', ');
      return {
        opponentTeamNames: opponentNames,
        win: match.win === true ? 'Thắng' : (match.win === false ? 'Thua' : 'Hòa'),
        newElo: match.newElo,
      };
    });
  }
}

module.exports = Player;