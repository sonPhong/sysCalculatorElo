import Player from './Player.js';
import Ranking from './Ranking.js';

class RankingBoard {
    constructor(players) {
        this.players = players;
    }

    update() {
        this.players.sort((a, b) => b.elo - a.elo);
    }

    display(containerId) {
        this.update();
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = `
            <h2>Bảng Xếp Hạng</h2>
            <table>
                <thead>
                    <tr>
                        <th>Hạng</th>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Elo</th>
                        <th>Rank</th>
                    </tr>
                </thead>
                <tbody id="ranking-table-body">
                </tbody>
            </table>
        `;
        const tableBody = document.getElementById("ranking-table-body");
        this.players.forEach((player, index) => {
            const row = tableBody.insertRow();
            const rankCell = row.insertCell();
            const idCell = row.insertCell();
            const nameCell = row.insertCell();
            const eloCell = row.insertCell();
            const rankTextCell = row.insertCell();

            rankCell.textContent = index + 1;
            idCell.textContent = player.id;
            nameCell.textContent = player.name;
            eloCell.textContent = player.elo;
            rankTextCell.textContent = Ranking.getRank(player.elo);
        });
    }
}

export default RankingBoard;