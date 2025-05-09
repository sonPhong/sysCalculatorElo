
class Ranking {
  getRank(elo) {
    if (elo <= 1200) {
      return "Con gà";
    } else if (elo <= 1300) {
      return "Con bò";
    } else if (elo <= 1400) {
      return "Con người";
    } else if (elo <= 1500) {
      return "Dị nhân";
    } else {
      return "Siêu nhân"; // Thêm các rank cao hơn nếu cần
    }
  }

  getRankIndex(elo) {
    if (elo <= 1200) return 0;
    if (elo <= 1300) return 1;
    if (elo <= 1400) return 2;
    if (elo <= 1500) return 3;
    return 4;
  }
}

module.exports = Ranking;