import Player from './classes/Player.js';
import Match from './classes/Match.js';
import EloScore from './classes/EloScore.js';
import Ranking from './classes/Ranking.js';
import RankingBoard from './classes/RankingBoard.js';
import MatchStats from './classes/MatchStats.js';


// Helper function để tạo ID ngẫu nhiên
function generateId() {
    return Math.random().toString(10).substring(2, 5);
}

// Helper function để tạo tên ngẫu nhiên
function generateName() {
    const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Jona", "Kane", "Luna"];
    return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
}

// Tạo danh sách người chơi ban đầu
const players = [];
for (let i = 0; i < 10; i++) {
    const id = generateId();
    const status = Math.random() < 0.5 ? 0 : 1;
    let elo;
    let detail;
    if (status === 0) {
        detail = "mới chơi";
        elo = 1200;
    } else {
        detail = "cũ";
        elo = Math.floor(Math.random() * 26) * 100 + 500; // Random 500 - 3000, bước nhảy 100
    }
    let type = elo < 500 ? 0 : 1;
    const name = generateName();
    if (type === 0) {
        console.warn(`Không thể tạo người chơi ${name} (ID: ${id}) vì Elo quá thấp.`);
    } else {
        players.push(new Player(id, name, status, type, elo));
    }
}

// Tạo một số trận đấu ngẫu nhiên
const matches = [];
function createRandomMatch() {
    if (players.length < 2) return;
    const player1Index = Math.floor(Math.random() * players.length);
    let player2Index = Math.floor(Math.random() * players.length);
    while (player1Index === player2Index) {
        player2Index = Math.floor(Math.random() * players.length);
    }
    const match = new Match(players[player1Index].id, players[player2Index].id);
    matches.push(match);
    EloScore.updateElo(match, players);
    const winnerPlayer = players.find(p => p.id === match.winner);
    MatchStats.updateStats(players[player1Index], match, match.winner);
    MatchStats.updateStats(players[player2Index], match, match.winner === players[player2Index].id ? players[player2Index].id : (match.winner === null ? null : players[player1Index].id));
    rankingBoard.display("ranking-board");
    displayMatchList("match-list");
}

// Hiển thị danh sách người chơi
function displayPlayerList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<h2>Danh Sách Người Chơi</h2><ul>${players.map(p => `<li>ID: ${p.id}, Tên: ${p.name}, Elo: ${p.elo} (${Ranking.getRank(p.elo)})</li>`).join('')}</ul>`;
}

// Hiển thị danh sách trận đấu
function displayMatchList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<h2>Lịch Sử Trận Đấu</h2><ul>${matches.map((match, index) => {
        const player1 = players.find(p => p.id === match.player1)?.name || 'N/A';
        const player2 = players.find(p => p.id === match.player2)?.name || 'N/A';
        let result = '';
        if (match.winner === match.player1) {
            result = `${player1} thắng`;
        } else if (match.winner === match.player2) {
            result = `${player2} thắng`;
        }
        return `<li>Trận ${index + 1}: ${player1} vs ${player2} - Kết quả: ${result}</li>`;
    }).join('')}</ul>`;
}

// Tạo và hiển thị bảng xếp hạng ban đầu
const rankingBoard = new RankingBoard(players);
rankingBoard.display("ranking-board");
displayPlayerList("player-list");
displayMatchList("match-list");

// Thêm nút tạo trận đấu
const createMatchButton = document.createElement("button");
createMatchButton.textContent = "Tạo Trận Đấu Mới";
createMatchButton.addEventListener("click", createRandomMatch);
document.getElementById("match-actions").appendChild(createMatchButton);

// Hàm hiển thị thông tin chi tiết của một người chơi
function displayPlayerDetails(playerId) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        MatchStats.display(player, "player-details", players);
    } else {
        document.getElementById("player-details").innerHTML = "<p>Không tìm thấy người chơi.</p>";
    }
}

// Thêm sự kiện click cho danh sách người chơi để xem chi tiết
document.getElementById("player-list").addEventListener("click", function(event) {
    const listItem = event.target.closest("li");
    if (listItem) {
        const playerIdMatch = listItem.textContent.match(/ID: ([a-z0-9]+)/);
        if (playerIdMatch && playerIdMatch[1]) {
            displayPlayerDetails(playerIdMatch[1]);
        }
    }
});

// Cập nhật bảng xếp hạng và danh sách trận đấu định kỳ (ví dụ mỗi 5 giây)
setInterval(() => {
    rankingBoard.display("ranking-board");
    displayMatchList("match-list");
    displayPlayerList("player-list"); // Cập nhật lại danh sách người chơi để thấy Elo thay đổi
    const playerDetailsContainer = document.getElementById("player-details");
    if (playerDetailsContainer.querySelector('h2')) { // Nếu đang hiển thị chi tiết người chơi, cập nhật lại
        const playerIdMatch = playerDetailsContainer.querySelector('h2').textContent.match(/ID: ([a-z0-9]+)/);
        if (playerIdMatch && playerIdMatch[1]) {
            displayPlayerDetails(playerIdMatch[1]);
        }
    }
}, 5000);