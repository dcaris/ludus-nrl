/*eslint-disable no-unused-vars*/
const Competition = require('../model/competition');
const Team = require('../model/team');
const Round = require('../model/round');
const Match = require('../model/match');
const Club = require('../model/club');
const Player = require('../model/player');
const PlayerStats = require('../model/playerStats');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

class NrlCompetition extends Competition {
    constructor() {
        super('National Rugby League',
            'nrl',
            'Australia',
            'https://www.nrl.com');
        this.externalId = 111;
    }

    /**
     * Returns list of teams for competition 
     * @returns {Promise<Club[]>}
     */
    async clubs() {
        var clubs = [];
        var response = await axios.default.get(`${this.url}/clubs/`);
        if (response.status == 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            $('div.club-card-content').each(((i, elem) => {
                var fullname = $(elem).find('h2.club-card__title').text().trim().replace('\n', ' ');
                var names = fullname.split(' ');
                let club = new Club(fullname, names[names.length - 1]);
                clubs.push(club);
            }));
        }

        return clubs;
    }

    /**
     * Retrieves all the rounds for a given year
     *
     * @param {number} year
     * @returns {Promise<Round[]>}
     * @memberof NrlCompetition
     */
    async rounds(year) {
        var rounds = [];
        var response = await axios.default.get(`${this.url}/draw/nrl-premiership/${year}`);
        if (response.status == 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            var filterData = $('div[id="vue-draw"]').attr('q-data').trim();
            var json = JSON.parse(filterData);

            json.filterRounds.forEach(function(i) {
                var round = new Round(year, i.value, i.name);
                rounds.push(round);
            });
        }
        return rounds;
    }

    /**
     * Returns results for a given round
     *
     * @param {number} year
     * @param {number} round 
     * @returns {Promise<Match>}
     * @memberof NrlCompetition
     */
    async results(year, round) {
        var matches = [];
        var response = await axios.default.get(`${this.url}/draw/nrl-premiership/${year}/round-${round}`);
        if (response.status == 200) {
            // Get the html and load it into cheerio
            const html = response.data;
            const $ = cheerio.load(html);

            // Select out Vue.js JSON
            var filterData = $('div[id="vue-draw"]').attr('q-data').trim();
            var json = JSON.parse(filterData);

            // Extract each game
            var games = json.drawGroups
                .map(g => { return g.matches; })
                .reduce((a, b) => { return a.concat(b); })
                .map(async function(g) {
                    return NrlCompetition.getMatchDetails(g);
                });

            matches = await Promise.all(games);
        }
        return matches;
    }

    /**
     * Returns detailed match statistic
     *
     * @param {*} year
     * @param {*} round
     * @param {*} homeTeamNickname
     * @param {*} awayTeamNickname
     * @returns {Promise<Match>}
     * @memberof NrlCompetition
     */
    async match(year, round, homeTeamNickname, awayTeamNickname) {
        var url = `${this.url}/draw/nrl-premiership/${year}/round-${round}/${homeTeamNickname.replace(' ', '-')}-vs-${awayTeamNickname.replace(' ', '-')}/`;
        var response = await axios.default.get(url);
        if (response.status == 200) {
            // Get the html and load it into cheerio
            const html = response.data;
            const $ = cheerio.load(html);

            // Select out Vue.js JSON
            var filterData = $('div[id="vue-match-centre"]').attr('q-data').trim();
            var json = JSON.parse(filterData);

            // Build up match result
            var match = NrlCompetition.getMatchDetails(json.match);
            return match;
        }
    }

    /**
     * Returns detailed match player statistic
     *
     * @param {*} year
     * @param {*} round
     * @param {*} homeTeamNickname
     * @param {*} awayTeamNickname
     * @returns {Promise<Match>}
     * @memberof NrlCompetition
     */
    async matchStatistics(year, round, homeTeamNickname, awayTeamNickname) {
        var url = `${this.url}/draw/nrl-premiership/${year}/round-${round}/${homeTeamNickname.replace(' ', '-')}-vs-${awayTeamNickname.replace(' ', '-')}/`;
        var response = await axios.default.get(url);
        if (response.status == 200) {
            // Get the html and load it into cheerio
            const html = response.data;
            const $ = cheerio.load(html);

            // Select out Vue.js JSON
            var filterData = $('div[id="vue-match-centre"]').attr('q-data').trim();
            var json = JSON.parse(filterData);

            // Build up match result
            var match = NrlCompetition.getMatchDetails(json.match);

            var awayTeamPlayers = NrlCompetition.getPlayers(json.match.awayTeam)
                .map(p => NrlCompetition.getPlayerStats(p,
                    match.awayTeam.club,
                    json.match.stats.players.awayTeam.find(s => s.playerId = p.playerId)));
            var homeTeamPlayers = NrlCompetition.getPlayers(json.match.homeTeam)
                .map(p => NrlCompetition.getPlayerStats(p,
                    match.homeTeam.club,
                    json.match.stats.players.homeTeam.find(s => s.playerId = p.playerId)));

            return awayTeamPlayers.concat(homeTeamPlayers);
        }
    }

    /**
     * Return match details found in JSON data
     *
     * @static
     * @param {*} matchJson
     * @returns
     * @memberof NrlCompetition
     */
    static getMatchDetails(matchJson) {
        // Collect the main match details
        var matchDate = moment(matchJson.startTime || matchJson.clock.kickOffTimeLong);
        var match = new Match(matchJson.matchId,
            matchDate.toDate(),
            matchJson.venue,
            matchJson.attendance);

        //match.mode = Post; // TODO: handle future not completed games

        // Build away team details
        match.awayTeam = new Club(matchJson.awayTeam.nickName);
        match.awayTeamScore = matchJson.awayTeam.score;

        // Build home team details
        match.homeTeam = new Club(matchJson.homeTeam.nickName);
        match.homeTeamScore = matchJson.homeTeam.score;

        return match;
    }

    /**
     * Returns the Players for a team found in JSON data
     *
     * @static
     * @param {*} team
     * @returns
     * @memberof NrlCompetition
     */
    static getPlayers(team) {
        return team.players.map(function(p) {
            return new Player(p.playerId,
                p.firstName,
                p.lastName,
                p.position,
                p.number);
        });
    }

    /**
     * Returns statistics for a Player in a match
     *
     * @static
     * @param {Player} player
     * @param {Club} club
     * @param {JSON} playerStat
     * @returns
     * @memberof NrlCompetition
     */
    static getPlayerStats(player, club, playerStat) {
        // Fill in match stats
        var stats = new PlayerStats(player, club);
        if (playerStat) {
            stats.allRunMetres = playerStat.allRunMetres;
            stats.allRuns = playerStat.allRuns;
            stats.bombKicks = playerStat.bombKicks;
            stats.crossFieldKicks = playerStat.crossFieldKicks;
            stats.conversions = playerStat.conversions;
            stats.conversionAttempts = playerStat.conversionAttempts;
            stats.dummyHalfRuns = playerStat.dummyHalfRuns;
            stats.dummyHalfRunMetres = playerStat.dummyHalfRunMetres;
            stats.dummyPasses = playerStat.dummyPasses;
            stats.errors = playerStat.errors;
            stats.fantasyPointsTotal = playerStat.fantasyPointsTotal;
            stats.fieldGoals = playerStat.fieldGoals;
            stats.forcedDropOutKicks = playerStat.forcedDropOutKicks;
            stats.fortyTwentyKicks = playerStat.fortyTwentyKicks;
            stats.goals = playerStat.goals;
            stats.goalConversionRate = playerStat.goalConversionRate;
            stats.grubberKicks = playerStat.grubberKicks;
            stats.handlingErrors = playerStat.handlingErrors;
            stats.hitUps = playerStat.hitUps;
            stats.hitUpRunMetres = playerStat.hitUpRunMetres;
            stats.ineffectiveTackles = playerStat.ineffectiveTackles;
            stats.intercepts = playerStat.intercepts;
            stats.kicks = playerStat.kicks;
            stats.kicksDead = playerStat.kicksDead;
            stats.kicksDefused = playerStat.kicksDefused;
            stats.kickMetres = playerStat.kickMetres;
            stats.kickReturnMetres = playerStat.kickReturnMetres;
            stats.lineBreakAssists = playerStat.lineBreakAssists;
            stats.lineBreaks = playerStat.lineBreaks;
            stats.lineEngagedRuns = playerStat.lineEngagedRuns;
            stats.minutesPlayed = playerStat.minutesPlayed;
            stats.missedTackles = playerStat.missedTackles;
            stats.offloads = playerStat.offloads;
            stats.oneOnOneLost = playerStat.oneOnOneLost;
            stats.oneOnOneSteal = playerStat.oneOnOneSteal;
            stats.onReport = playerStat.onReport;
            stats.passesToRunRatio = playerStat.passesToRunRatio;
            stats.passes = playerStat.passes;
            stats.playTheBallTotal = playerStat.playTheBallTotal;
            stats.playTheBallAverageSpeed = playerStat.playTheBallAverageSpeed;
            stats.penalties = playerStat.penalties;
            stats.points = playerStat.points;
            stats.penaltyGoals = playerStat.penaltyGoals;
            stats.postContactMetres = playerStat.postContactMetres;
            stats.receipts = playerStat.receipts;
            stats.sendOffs = playerStat.sendOffs;
            stats.sinBins = playerStat.sinBins;
            stats.stintOne = playerStat.stintOne;
            stats.tackleBreaks = playerStat.tackleBreaks;
            stats.tackleEfficiency = playerStat.tackleEfficiency;
            stats.tacklesMade = playerStat.tacklesMade;
            stats.tries = playerStat.tries;
            stats.tryAssists = playerStat.tryAssists;
        }

        return stats;
    }
}

module.exports = NrlCompetition;