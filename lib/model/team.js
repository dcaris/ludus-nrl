class Team {
    /**
     * 
     * @param {string} nickname 
     * @param {string} fullName 
     * @param {Player[]} players 
     */
    constructor(nickname, fullName, players) {
        this.nickname = nickname;
        this.fullName = fullName;
        this.players = players;
    }
}

module.exports = Team;