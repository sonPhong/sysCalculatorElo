import Player from './Player.js';
import Ranking from './Ranking.js';
import RankingBoard from './RankingBoard.js'; // Cần import để tạo instance hiển thị rank


class MatchStats {
    static updateStats(player, match, winner) {
        player.matchesPlayed.push({
            opponentId: player.id === match.player1 ? match.player2 : match.player1,
            outcome: winner === player.id ? 'Thắng' : (winner === null ? 'Hòa' : 'Thua'),
            eloBefore: player.elo // Cần lưu trữ elo trước trận đấu
        });
    }

    static display(player, containerId, allPlayers) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const wins = player.matchesPlayed.filter(m => m.outcome === 'Thắng').length;
        const losses = player.matchesPlayed.filter(m => m.outcome === 'Thua').length;
        const draws = player.matchesPlayed.filter(m => m.outcome === 'Hòa').length;
        const winRate = player.matchesPlayed.length > 0 ? ((wins / player.matchesPlayed.length) * 100).toFixed(2) + '%' : '0%';
        const firstElo = player.matchesPlayed.length > 0 ? player.matchesPlayed[0].eloBefore : player.elo; // Giả định elo hiện tại là elo ban đầu nếu chưa chơi trận nào

        const rankingBoard = new RankingBoard(allPlayers);
        rankingBoard.update();
        const rank = rankingBoard.players.findIndex(p => p.id === player.id) + 1;

        let opponentsList = '';
        player.matchesPlayed.forEach(match => {
            const opponent = allPlayers.find(p => p.id === match.opponentId);
            const opponentName = opponent ? opponent.name : 'Không xác định';
            opponentsList += `<li>Đối thủ: ${opponentName} (${match.outcome}, Elo trước trận: ${match.eloBefore})</li>`;
        });

        container.innerHTML = `
            <h2>Thống Kê Người Chơi: ${player.name} (ID: ${player.id})</h2>
            <ul>
                <li>Trạng thái: ${player.detail || (player.status === 0 ? "mới chơi" : "cũ")}</li>
                <li>Elo hiện tại: ${player.elo}</li>
                <li>Elo ban đầu: ${firstElo}</li>
                <li>Số trận đã chơi: ${player.matchesPlayed.length}</li>
                <li>Số trận thắng: ${wins}</li>
                <li>Số trận thua: ${losses}</li>
                <li>Số trận hòa: ${draws}</li>
                <li>Tỉ lệ thắng: ${winRate}</li>
                <li>Thứ hạng hiện tại: ${rank} (${Ranking.getRank(player.elo)})</li>
                <li>Các đối thủ đã đối đầu:
                    <ul>${opponentsList}</ul>
                </li>
            </ul>
        `;
    }
}

export default MatchStats;