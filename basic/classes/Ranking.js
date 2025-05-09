


class Ranking {
    static getRank(elo) {
        if (elo < 500) return "cút";
        if (elo < 1200) return "Tân binh";
        if (elo < 1500) return "Lợn";
        if (elo < 2000) return "Được được";
        if (elo < 3000) return "Dị nhân";
        return "Quái thú";
    }
}

export default Ranking;