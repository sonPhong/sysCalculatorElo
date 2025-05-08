//const K = 30; // hệ số biến động, thay đổi sau dựa trên elo update later
const K = 32;

const nPlayer = 100; // số lượng player
const nMatch = 100;

// tạo class sinh ra playeer
class Player {
    // elo mặc định người mới = 1200
    constructor(name, elo) {
        this.name = name;
        this.elo = elo;
    }

    // hàm tính xác xuất thắng của A vs B, đưa obj call back từ update => tính xác suất
    winRate(obj) {
        return 1 / (1 + Math.pow(10, (obj.elo - this.elo) / 400));
    }

    // hàm tính toán Elo trả về
    calElo(obj, result, K) {
        let rate = this.winRate(obj);
        return this.elo += K * (result - rate);
    }

    // // thay đổi elo dựa trên kết quả random, xác xuất thắng, K mặc định cho vì chưa add condition change
    // updateElo(obj, result, K) {
    //     let rate = this.winRate(obj); // this call bình thường vì hàm not global
    //     this.elo += K * (result - rate); // công thức tính elo
    // }
}

// tạo mảng chứa 100 thằng chơi
const createPlayers = (nPlayer) => {
    return Array.from({ length: nPlayer }, (_, i) =>
        new Player(`Player Name: ${i + 1}`, Math.floor(Math.random() * 1000) + 1000)
    );
}

// tạo 100 trận random rate win-lose 1vs1
const createMatchs = (players, nMatch) => {
    const arrMatch = [];

    for (let i = 0; i < nMatch; i++) {
        // lấy random 2 thằng trong mớ arrPlayers, gán random rateWin
        let [player1, player2] = players.sort(() => Math.random() - 0.5).slice(0, 2);
        let result = Math.random() < 0.5 ? 0 : 1;
        const newElo1 = player1.calElo(player2, result); // new elo chưa xử lý
        const newElo2 = player2.calElo(player1, 1 - result);
        arrMatch.push({ player1: player1.name, player2: player2.name, winner: result ? player1.name : player2.name });
    }
    return arrMatch;
}


const players = createPlayers(nPlayer);
const matchs = createMatchs(players, nMatch);

console.log(players);
console.log(players.length);

console.log(matchs);
console.log(matchs.length);