const Competition = require('../model/competition');
const Team = require('../model/team');
const Round = require('../model/round');
const Match = require('../model/match');
const Club = require('../model/club');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

class NrlCompetition extends Competition {
    constructor() {
        super('National Rugby League',
            'nrl',
            'Australia',
            'http://www.nrl.com/');
        this.externalId = 111;
    }

    /**
     * Returns list of teams for competition 
     * @returns {Promise<Club[]>}
     */
    async clubs() {
        var clubs = [];
        var response = await axios.default.get('https://www.nrl.com/clubs/');
        if (response.status == 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            $('div.club-card__content').each(((i, elem) => {
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
                .reduce((a, b) => { return a.concat(b); });

            // const fetchGames = games.map(g => { return match(); });
            // const mm = await Promise.all(fetchGames);

            // Parse out each game
            matches = games.map(function(g) {
                // Collect the main match details
                var matchDate = moment(g.clock.kickOffTimeLong);
                var match = new Match(matchDate.toDate(), g.venue);

                // Build away team details
                match.awayTeam = new Team(new Club(g.awayTeam.nickName)); // TODO: club id extraction
                match.awayTeam.score = g.awayTeam.score;
                match.awayTeam.players = [];

                // Build home team details
                match.homeTeam = new Team(new Club(g.homeTeam.nickName)); // TODO: club id extraction
                match.homeTeam.score = g.homeTeam.score;
                match.homeTeam.players = [];

                if (detailed) {
                    // TODO: get detailed results
                }

                return match;
            });
        }
        return matches;
    }
}

module.exports = NrlCompetition;