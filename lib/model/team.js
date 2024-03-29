/*eslint-disable no-unused-vars*/
const Club = require('./club');
const Player = require('./player');

class Team {
    /**
     * 
     * @param {Club} club
     * @param {number} score
     * @param {Player[]} players 
     */
    constructor(club, score, players) {
        this.club = club;
        this.players = players;
        this.score = score;
    }
}

module.exports = Team;