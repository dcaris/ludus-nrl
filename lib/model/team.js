class Team {
    /**
     * 
     * @param {string} clubNickName  
     * @param {number} score
     * @param {Player[]} players 
     */
    constructor(clubNickName, score, players) {
        this.clubNickName = clubNickName;
        this.players = players;
        this.score = score;
    }
}

module.exports = Team;