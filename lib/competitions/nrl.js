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
            match.awayTeam.players = NrlCompetition.getTeamStats(json.match.awayTeam,
                json.match.stats.players.awayTeam);

            // Build home team details
            match.homeTeam.players = NrlCompetition.getTeamStats(json.match.homeTeam,
                json.match.stats.players.homeTeam);

            return match;
        }
    }

    static getMatchDetails(matchJson) {
        // Collect the main match details
        var matchDate = moment(matchJson.startTime || matchJson.kickOffTimeLong);
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

    static getTeamStats(team, playerStats) {
        return team.players.map(function(p) {
            var player = new Player(p.playerId,
                p.firstName,
                p.lastName,
                p.position,
                p.number);
            var ms = playerStats.find(function(ps) {
                return ps.playerId = p.playerId;
            });

            // Fill in match stats
            player.matchStats.allRunMetres = ms.allRunMetres;
            player.matchStats.allRuns = ms.allRuns;
            player.matchStats.bombKicks = ms.bombKicks;
            player.matchStats.crossFieldKicks = ms.crossFieldKicks;
            player.matchStats.conversions = ms.conversions;
            player.matchStats.conversionAttempts = ms.conversionAttempts;
            player.matchStats.dummyHalfRuns = ms.dummyHalfRuns;
            player.matchStats.dummyHalfRunMetres = ms.dummyHalfRunMetres;
            player.matchStats.dummyPasses = ms.dummyPasses;
            player.matchStats.errors = ms.errors;
            player.matchStats.fantasyPointsTotal = ms.fantasyPointsTotal;
            player.matchStats.fieldGoals = ms.fieldGoals;
            player.matchStats.forcedDropOutKicks = ms.forcedDropOutKicks;
            player.matchStats.fortyTwentyKicks = ms.fortyTwentyKicks;
            player.matchStats.goals = ms.goals;
            player.matchStats.goalConversionRate = ms.goalConversionRate;
            player.matchStats.grubberKicks = ms.grubberKicks;
            player.matchStats.handlingErrors = ms.handlingErrors;
            player.matchStats.hitUps = ms.hitUps;
            player.matchStats.hitUpRunMetres = ms.hitUpRunMetres;
            player.matchStats.ineffectiveTackles = ms.ineffectiveTackles;
            player.matchStats.intercepts = ms.intercepts;
            player.matchStats.kicks = ms.kicks;
            player.matchStats.kicksDead = ms.kicksDead;
            player.matchStats.kicksDefused = ms.kicksDefused;
            player.matchStats.kickMetres = ms.kickMetres;
            player.matchStats.kickReturnMetres = ms.kickReturnMetres;
            player.matchStats.lineBreakAssists = ms.lineBreakAssists;
            player.matchStats.lineBreaks = ms.lineBreaks;
            player.matchStats.lineEngagedRuns = ms.lineEngagedRuns;
            player.matchStats.minutesPlayed = ms.minutesPlayed;
            player.matchStats.missedTackles = ms.missedTackles;
            player.matchStats.offloads = ms.offloads;
            player.matchStats.oneOnOneLost = ms.oneOnOneLost;
            player.matchStats.oneOnOneSteal = ms.oneOnOneSteal;
            player.matchStats.onReport = ms.onReport;
            player.matchStats.passesToRunRatio = ms.passesToRunRatio;
            player.matchStats.passes = ms.passes;
            player.matchStats.playTheBallTotal = ms.playTheBallTotal;
            player.matchStats.playTheBallAverageSpeed = ms.playTheBallAverageSpeed;
            player.matchStats.penalties = ms.penalties;
            player.matchStats.points = ms.points;
            player.matchStats.penaltyGoals = ms.penaltyGoals;
            player.matchStats.postContactMetres = ms.postContactMetres;
            player.matchStats.receipts = ms.receipts;
            player.matchStats.sendOffs = ms.sendOffs;
            player.matchStats.sinBins = ms.sinBins;
            player.matchStats.stintOne = ms.stintOne;
            player.matchStats.tackleBreaks = ms.tackleBreaks;
            player.matchStats.tackleEfficiency = ms.tackleEfficiency;
            player.matchStats.tacklesMade = ms.tacklesMade;
            player.matchStats.tries = ms.tries;
            player.matchStats.tryAssists = ms.tryAssists;

            return player;
        });
    }
}

module.exports = NrlCompetition;