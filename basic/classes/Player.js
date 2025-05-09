class Player {
    constructor(id, name, status, type, elo) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.type = type;
        this.elo = elo;
        this.matchesPlayed = [];
    }
}
export default Player;