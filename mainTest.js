import Player from './Player.js';
import Match from './Match.js';
import EloScore from './EloScore.js';
import Ranking from './Ranking.js';
import RankingBoard from './RankingBoard.js';
import MatchStats from './MatchStats.js';

const NUM_PLAYERS = 20; // Giảm số lượng cho dễ hiển thị trên web
const NUM_MATCHES_TO_SIMULATE = 50; // Số trận mô phỏng khi tải trang
const TEAM_SIZE = 2; // Giảm kích thước team cho dễ mô phỏng 1vs1

const eloScore = new EloScore(32);
const ranking = new Ranking();
const rankingBoard = new RankingBoard('ranking-board-section'); // Truyền ID container
const matchStats = new MatchStats();

let players = [];

async function initialize() {
  players = await generateRandomPlayers(NUM_PLAYERS);
  for (let i = 0; i < NUM_MATCHES_TO_SIMULATE; i++) {
    await simulateMatches(players, 1); // Mô phỏng từng trận một để cập nhật UI
  }
  displayRanking();
  displayOverallStats();
}

async function generateRandomPlayers(numPlayers) {
  const players = [];
  for (let i = 1; i <= numPlayers; i++) {
    const status = Math.random() < 0.5 ? 0 : 1;
    let elo;
    if (status === 0) {
      const baseElo = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
      elo = baseElo + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5) * 100;
      elo = Math.max(500, Math.min(2000, Math.round(elo)));
    } else {
      elo = 1200;
    }
    const newPlayer = new Player(i, `Player ${i}`, status, elo, null, null, [], 0, 0, [], elo);
    newPlayer.updateType();
    newPlayer.updateRank(ranking);
    players.push(newPlayer);
  }
  return players;
}

async function simulateMatches(players, numMatches) {
  for (let i = 0; i < numMatches; i++) {
    const activePlayers = players.filter(p => p.type === 1);
    if (activePlayers.length < TEAM_SIZE * 2) {
      console.warn("Không đủ người chơi hợp lệ để tạo một trận đấu.");
      break;
    }

    const canPlay = (p1, p2) => {
      const rank1Index = ranking.getRankIndex(p1.elo);
      const rank2Index = ranking.getRankIndex(p2.elo);
      return Math.abs(rank1Index - rank2Index) <= 2;
    };

    const availablePlayers = activePlayers.filter(p => activePlayers.some(other => other !== p && canPlay(p, other)));

    if (availablePlayers.length < TEAM_SIZE * 2) {
      console.warn("Không đủ người chơi phù hợp về rank để tạo một trận đấu.");
      continue;
    }

    let team1 = [];
    let team2 = [];
    const remainingPlayers = [...availablePlayers];

    for (let j = 0; j < TEAM_SIZE; j++) {
      if (remainingPlayers.length === 0) break;
      const player1Index = Math.floor(Math.random() * remainingPlayers.length);
      const player1 = remainingPlayers.splice(player1Index, 1)[0];
      team1.push(player1);

      const potentialOpponents = remainingPlayers.filter(p => canPlay(player1, p));
      if (potentialOpponents.length === 0) break;
      const player2Index = Math.floor(Math.random() * potentialOpponents.length);
      const player2 = potentialOpponents[player2Index];
      remainingPlayers.splice(remainingPlayers.indexOf(player2), 1);
      team2.push(player2);
    }

    if (team1.length === TEAM_SIZE && team2.length === TEAM_SIZE) {
      const match = new Match(team1, team2);
      const winner = match.simulate();
      eloScore.updateMatchElo(team1, team2, winner);
      players.forEach(p => p.updateRank(ranking));
      displayRanking(); // Cập nhật bảng xếp hạng sau mỗi trận
      displayOverallStats(); // Cập nhật thống kê tổng quan
    }
  }
}

function displayPlayerStats(playerId) {
  const player = players.find(p => p.id === parseInt(playerId));
  const statsContainer = document.getElementById('player-stats');
  if (player) {
    const stats = matchStats.generatePlayerStats(player);
    statsContainer.innerHTML = `
      <h2>Thống kê cho ${player.name} (ID: ${player.id})</h2>
      <p>Elo hiện tại: ${player.elo}</p>
      <p>Số trận thắng: ${stats.wins}</p>
      <p>Số trận thua: ${stats.losses}</p>
      <p>Tỷ lệ thắng: ${stats.winRate}</p>
      <p>Elo ban đầu: ${stats.initialElo}</p>
    `;
  } else {
    statsContainer.innerHTML = `<p>Không tìm thấy người chơi với ID ${playerId}.</p>`;
  }
}

function displayMatchHistory(playerId) {
  const player = players.find(p => p.id === parseInt(playerId));
  const historyContainer = document.getElementById('match-history');
  if (player) {
    const historyDetail = player.getMatchHistoryDetail(players);
    let historyHTML = `<h2>Lịch sử đấu của ${player.name} (ID: ${player.id})</h2>`;
    if (historyDetail.length > 0) {
      historyHTML += '<ul>';
      historyDetail.forEach(match => {
        historyHTML += `<li>Đối đầu với: ${match.opponentTeamNames}, Kết quả: ${match.win}, Elo mới: ${match.newElo}</li>`;
      });
      historyHTML += '</ul>';
    } else {
      historyHTML += '<p>Chưa có lịch sử đấu.</p>';
    }
    historyContainer.innerHTML = historyHTML;
  } else {
    historyContainer.innerHTML = `<p>Không tìm thấy người chơi với ID ${playerId}.</p>`;
  }
}

function displayPerformanceReport() {
  const reportContainer = document.getElementById('performance-report');
  const report = matchStats.generatePerformanceReport(players);
  let reportHTML = `<h2>Báo cáo hiệu suất</h2>`;
  reportHTML += `<h3>Top 5 người chơi tăng Elo nhiều nhất:</h3><ul>`;
  report.topEloGain.forEach(p => reportHTML += `<li>${p.name}: +${p.eloGain}</li>`);
  reportHTML += `</ul><h3>Top 5 người chơi có tỷ lệ thắng cao nhất:</h3><ul>`;
  report.topWinRate.forEach(p => reportHTML += `<li>${p.name}: ${p.winRate}</li>`);
  reportHTML += `</ul>`;
  reportContainer.innerHTML = reportHTML;
}

function displayOverallStats() {
  const statsContainer = document.getElementById('overall-stats');
  const overallStats = matchStats.generate(players);
  statsContainer.innerHTML = `
    <h2>Thống kê tổng quan</h2>
    <p>Tổng số trận đấu đã diễn ra: ${overallStats.totalMatches}</p>
    <p>Tổng số trận thắng: ${overallStats.totalWins}</p>
    <p>Tổng số trận thua: ${overallStats.totalLosses}</p>
    <p>Tổng số trận hòa: ${overallStats.totalDraws}</p>
  `;
}

function displayRanking() {
  rankingBoard.display(players, ranking);
}

document.addEventListener('DOMContentLoaded', initialize);

document.getElementById('view-stats-btn').addEventListener('click', () => {
  const playerId = document.getElementById('player-id-input').value;
  displayPlayerStats(playerId);
});

document.getElementById('view-history-btn').addEventListener('click', () => {
  const playerId = document.getElementById('player-id-input').value;
  displayMatchHistory(playerId);
});

document.getElementById('view-performance-btn').addEventListener('click', displayPerformanceReport);
document.getElementById('view-overall-btn').addEventListener('click', displayOverallStats);