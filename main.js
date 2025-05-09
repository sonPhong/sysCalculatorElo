const fs = require('fs').promises;
const path = require('path');
const Player = require('./classes/Player');
const Match = require('./classes/Match');
const EloScore = require('./classes/EloScore');
const Ranking = require('./classes/Ranking');
const RankingBoard = require('./classes/RankingBoard');
const MatchStats = require('./classes/MatchStats');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const PLAYERS_FILE_PATH = path.join(__dirname, 'data', 'players.json');
const NUM_PLAYERS = 100;
const NUM_MATCHES_PER_PLAYER = 100;
const TEAM_SIZE = 5;

const eloScore = new EloScore(32);
const ranking = new Ranking();
const rankingBoard = new RankingBoard();
const matchStats = new MatchStats();

async function loadPlayers() {
  try {
    const data = await fs.readFile(PLAYERS_FILE_PATH, 'utf8');
    return JSON.parse(data).map(p => new Player(p.id, p.name, p.status, p.elo, p.type, p.rank, p.history, p.wins, p.losses, p.matchHistory, p.initialElo));
  } catch (error) {
    if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
      return [];
    }
    console.error('Lỗi khi tải dữ liệu người chơi:', error);
    return [];
  }
}

async function savePlayers(players) {
  try {
    const data = JSON.stringify(players.map(p => ({ ...p, rank: undefined })), null, 2);
    await fs.writeFile(PLAYERS_FILE_PATH, data, 'utf8');
    console.log('Dữ liệu người chơi đã được lưu.');
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu người chơi:', error);
  }
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
      const winnerTeam = match.simulate();
      const eloChange = eloScore.updateMatchElo(team1, team2, winnerTeam);

      team1.forEach(player => {
        const win = winnerTeam === 1;
        player.recordMatch(team2.map(p => p.id), win, player.elo - eloChange.team1[player.id], eloChange.team1[player.id]);
      });

      team2.forEach(player => {
        const win = winnerTeam === 2;
        player.recordMatch(team1.map(p => p.id), win, player.elo - eloChange.team2[player.id], eloChange.team2[player.id]);
      });

      players.forEach(p => p.updateRank(ranking));
    }
  }
}

async function displayPlayerStats(players, playerId) {
  const player = players.find(p => p.id === playerId);
  if (player) {
    const stats = matchStats.generatePlayerStats(player);
    console.log(`\n--- Thống kê cho ${player.name} (ID: ${player.id}) ---`);
    console.log(`Elo hiện tại: ${player.elo}`);
    console.log(`Số trận thắng: ${stats.wins}`);
    console.log(`Số trận thua: ${stats.losses}`);
    console.log(`Tỷ lệ thắng: ${stats.winRate}`);
    console.log(`Elo ban đầu: ${stats.initialElo}`);
    console.log(`---------------------------------------------------\n`);
  } else {
    console.log(`Không tìm thấy người chơi với ID ${playerId}.`);
  }
}

async function displayMatchHistory(players, playerId) {
  const player = players.find(p => p.id === playerId);
  if (player) {
    const historyDetail = player.getMatchHistoryDetail(players);
    console.log(`\n--- Lịch sử đấu của ${player.name} (ID: ${player.id}) ---`);
    if (historyDetail.length > 0) {
      historyDetail.forEach(match => {
        console.log(`Đối đầu với: ${match.opponentTeamNames}, Kết quả: ${match.win}, Elo mới: ${match.newElo}`);
      });
    } else {
      console.log('Chưa có lịch sử đấu.');
    }
    console.log(`-------------------------------------------------------\n`);
  } else {
    console.log(`Không tìm thấy người chơi với ID ${playerId}.`);
  }
}

async function displayPerformanceReport(players) {
  console.log("Giá trị của matchStats:", matchStats); // Thêm dòng này
  const report = matchStats.generatePerformanceReport(players);
  console.log("\n======================== +--+ Báo cáo hiệu suất +-+ ========================\n");
  console.log("\nTop 5 người chơi tăng Elo nhiều nhất:");
  report.topEloGain.forEach(p => console.log(`${p.name}: +${p.eloGain}`));
  console.log("\nTop 5 người chơi có tỷ lệ thắng cao nhất:");
  report.topWinRate.forEach(p => console.log(`${p.name}: ${p.winRate}`));
  console.log("========================================================================\n");
}

async function displayOverallStats(players) {
  const overallStats = matchStats.generate(players);
  console.log("\n======================== +--+ Thống kê tổng quan +-+ ========================\n");
  console.log(`Tổng số trận đấu đã diễn ra: ${overallStats.totalMatches}`);
  console.log(`Tổng số trận thắng: ${overallStats.totalWins}`);
  console.log(`Tổng số trận thua: ${overallStats.totalLosses}`);
  console.log("========================================================================\n");
}

async function main() {
  let players = await loadPlayers();

  if (players.length === 0) {
    console.log('Không tìm thấy dữ liệu người chơi hoặc dữ liệu rỗng. Tạo người chơi ngẫu nhiên...');
    players = await generateRandomPlayers(NUM_PLAYERS);
    await savePlayers(players);
  } else {
    console.log('Đã tải dữ liệu người chơi.');
    players.forEach(p => {
      p.updateType();
      p.updateRank(ranking);
    });
  }

  for (let i = 0; i < NUM_MATCHES_PER_PLAYER; i++) {
    await simulateMatches(players, NUM_PLAYERS / (TEAM_SIZE * 2));
  }

  await savePlayers(players);
  rankingBoard.display(players, ranking);
  await displayPerformanceReport(players);

  async function askForAction() {
    readline.question('Chọn hành động:\n' +
      '1. Xem thống kê người chơi\n' +
      '2. Xem lịch sử đấu của người chơi\n' +
      '3. Xem thống kê tổng quan\n' +
      '4. Thoát\n' +
      'Nhập lựa chọn của bạn: ', async choice => {
      switch (choice) {
        case '1':
          readline.question('Nhập ID người chơi để xem thống kê: ', async playerId => {
            await displayPlayerStats(players, parseInt(playerId));
            askForAction();
          });
          break;
        case '2':
          readline.question('Nhập ID người chơi để xem lịch sử đấu: ', async playerId => {
            await displayMatchHistory(players, parseInt(playerId));
            askForAction();
          });
          break;
        case '3':
          await displayOverallStats(players);
          askForAction();
          break;
        case '4':
          readline.close();
          break;
        default:
          console.log('Lựa chọn không hợp lệ. Vui lòng thử lại.');
          askForAction();
      }
    });
  }

  askForAction();
}

main();