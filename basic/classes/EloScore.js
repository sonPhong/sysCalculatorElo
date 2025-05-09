

class EloScore {
    static calculateNewElo(playerElo, opponentElo, score) {
        const K = 32; // Hệ số K, có thể điều chỉnh
        const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
        return playerElo + K * (score - expectedScore);
    }

    static updateElo(match, players) {
        const player1 = players.find(p => p.id === match.player1);
        const player2 = players.find(p => p.id === match.player2);

        if (!player1 || !player2) {
            console.error("Người chơi không tồn tại!");
            return;
        }

        let score1 = 0.5;
        let score2 = 0.5;

        if (match.winner === player1.id) {
            score1 = 1;
            score2 = 0;
        } else if (match.winner === player2.id) {
            score1 = 0;
            score2 = 1;
        }

        const newElo1 = this.calculateNewElo(player1.elo, player2.elo, score1);
        const newElo2 = this.calculateNewElo(player2.elo, player1.elo, score2);

        player1.elo = Math.round(newElo1);
        player2.elo = Math.round(newElo2);
    }
}

export default EloScore;