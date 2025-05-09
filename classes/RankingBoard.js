
class RankingBoard {
  display(players, ranking) {
    const rankedPlayers = [...players].sort((a, b) => b.elo - a.elo);
    console.log("\n======================== +--+ Bảng Xếp Hạng +-+ ========================\n");
    rankedPlayers.forEach(player => {
      console.log(`${player.elo} - ${ranking.getRank(player.elo)} (ID: ${player.id}, Tên: ${player.name})`);
    });
    console.log("========================================================================\n");
  }
}




module.exports = RankingBoard;