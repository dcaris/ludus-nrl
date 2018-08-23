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
     * @param {Round} round 
     * @param {boolean} detailed
     */
    async results(round, detailed = false) {
        var self = this;
        var matches = [];
        var response = await axios.default.get(`${this.url}/draw/nrl-premiership/${round.year}/round-${round.number}`);
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
                    if (detailed) {
                        return await self.match(round.year,
                            round.number,
                            g.homeTeam.nickName,
                            g.awayTeam.nickName);
                    } else {
                        return NrlCompetition.getMatchDetails(g);
                    }
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

            //match.mode = Post; // TODO: handle future not completed games

            // Build away team details
            match.awayTeam.players = NrlCompetition.getPlayers(json.match.awayTeam);
            match.homeTeam.players = NrlCompetition.getPlayers(json.match.homeTeam);

            // Get player stats
            match.awayTeam.players.forEach(p => match.playerStats.push(NrlCompetition.getPlayerStats(p, match.awayTeam.club, json.match.stats.players.awayTeam)));
            match.homeTeam.players.forEach(p => match.playerStats.push(NrlCompetition.getPlayerStats(p, match.homeTeam.club, json.match.stats.players.homeTeam)));
            // match.playerStats = NrlCompetition.getTeamStats(json.match.awayTeam,
            //     json.match.stats.players.awayTeam);

            return match;
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
        match.awayTeam = new Team(new Club(matchJson.awayTeam.nickName)); // TODO: club id extraction
        match.awayTeam.score = matchJson.awayTeam.score;

        // Build home team details
        match.homeTeam = new Team(new Club(matchJson.homeTeam.nickName)); // TODO: club id extraction
        match.homeTeam.score = matchJson.homeTeam.score;

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
     * @param {JSON} playerStatsJson
     * @returns
     * @memberof NrlCompetition
     */
    static getPlayerStats(player, club, playerStatsJson) {
        var ms = playerStatsJson.find(function(ps) {
            return ps.playerId = player.playerId;
        });

        // Fill in match stats
        var stats = new PlayerStats(player, club);
        if (ms) {
            stats.allRunMetres = ms.allRunMetres;
            stats.allRuns = ms.allRuns;
            stats.bombKicks = ms.bombKicks;
            stats.crossFieldKicks = ms.crossFieldKicks;
            stats.conversions = ms.conversions;
            stats.conversionAttempts = ms.conversionAttempts;
            stats.dummyHalfRuns = ms.dummyHalfRuns;
            stats.dummyHalfRunMetres = ms.dummyHalfRunMetres;
            stats.dummyPasses = ms.dummyPasses;
            stats.errors = ms.errors;
            stats.fantasyPointsTotal = ms.fantasyPointsTotal;
            stats.fieldGoals = ms.fieldGoals;
            stats.forcedDropOutKicks = ms.forcedDropOutKicks;
            stats.fortyTwentyKicks = ms.fortyTwentyKicks;
            stats.goals = ms.goals;
            stats.goalConversionRate = ms.goalConversionRate;
            stats.grubberKicks = ms.grubberKicks;
            stats.handlingErrors = ms.handlingErrors;
            stats.hitUps = ms.hitUps;
            stats.hitUpRunMetres = ms.hitUpRunMetres;
            stats.ineffectiveTackles = ms.ineffectiveTackles;
            stats.intercepts = ms.intercepts;
            stats.kicks = ms.kicks;
            stats.kicksDead = ms.kicksDead;
            stats.kicksDefused = ms.kicksDefused;
            stats.kickMetres = ms.kickMetres;
            stats.kickReturnMetres = ms.kickReturnMetres;
            stats.lineBreakAssists = ms.lineBreakAssists;
            stats.lineBreaks = ms.lineBreaks;
            stats.lineEngagedRuns = ms.lineEngagedRuns;
            stats.minutesPlayed = ms.minutesPlayed;
            stats.missedTackles = ms.missedTackles;
            stats.offloads = ms.offloads;
            stats.oneOnOneLost = ms.oneOnOneLost;
            stats.oneOnOneSteal = ms.oneOnOneSteal;
            stats.onReport = ms.onReport;
            stats.passesToRunRatio = ms.passesToRunRatio;
            stats.passes = ms.passes;
            stats.playTheBallTotal = ms.playTheBallTotal;
            stats.playTheBallAverageSpeed = ms.playTheBallAverageSpeed;
            stats.penalties = ms.penalties;
            stats.points = ms.points;
            stats.penaltyGoals = ms.penaltyGoals;
            stats.postContactMetres = ms.postContactMetres;
            stats.receipts = ms.receipts;
            stats.sendOffs = ms.sendOffs;
            stats.sinBins = ms.sinBins;
            stats.stintOne = ms.stintOne;
            stats.tackleBreaks = ms.tackleBreaks;
            stats.tackleEfficiency = ms.tackleEfficiency;
            stats.tacklesMade = ms.tacklesMade;
            stats.tries = ms.tries;
            stats.tryAssists = ms.tryAssists;
        }

        return stats;
    }
}

module.exports = NrlCompetition;