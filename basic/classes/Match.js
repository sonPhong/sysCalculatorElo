import Player from './Player.js'; // Import Player để có thể tham chiếu đến đối tượng Player


class Match {
    constructor(player1Id, player2Id) {
        this.player1 = player1Id; // Lưu ID thay vì trực tiếp đối tượng
        this.player2 = player2Id; // Lưu ID thay vì trực tiếp đối tượng
        this.winner = this.determineWinner();
    }

    determineWinner() {
        const outcome = Math.random();
        if (outcome < 0.5) { // Player 1 thắng (50% cơ hội)
            return this.player1;
        } else { // Player 2 thắng (50% cơ hội)
            return this.player2;
        }
    }
}

export default Match;