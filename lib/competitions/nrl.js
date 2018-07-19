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
        super("National Rugby League",
            "nrl",
            "Australia",
            "http://www.nrl.com/");
        this.externalId = 111;
    }

    /**
     * Returns list of teams for competition 
     */
    clubs() {
        return new Promise(function(resolve, reject) {
            axios.default.get(`https://www.nrl.com/clubs/`)
                .then((response) => {
                    if (response.status == 200) {
                        var clubs = [];
                        const html = response.data;
                        const $ = cheerio.load(html);
                        $('div.club-card__content').each(((i, elem) => {
                            let club = new Club($(elem).find('h2.club-card__title').text().trim().replace('\n', ' '));
                            clubs.push(club);
                        }));
                        resolve(clubs);
                    }
                }, (error) => reject(error));
        });

    }

    /**
     * Retrieves all the rounds for a given year
     *
     * @param {number} year
     * @returns {Promise<Round[]>}
     * @memberof NrlCompetition
     */
    rounds(year) {
        var self = this;
        return new Promise(function(resolve, reject) {
            axios.default.get(`${self.url}/draw/nrl-premiership/${year}`)
                .then((response) => {
                    if (response.status == 200) {
                        const html = response.data;
                        const $ = cheerio.load(html);
                        var filterData = $('div[id="vue-draw"]').attr('q-data').trim();
                        var json = JSON.parse(filterData);
                        var rounds = [];
                        json.filterRounds.forEach(function(i) {
                            var round = new Round(year, i.value, i.name);
                            rounds.push(round);
                        });

                        resolve(rounds);
                    }
                }, (error) => reject(error));
        });
    }

    /**
     * Returns results for a given round
     * @param {Round} round 
     */
    results(round) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var matches = [];
            axios.default.get(`${self.url}/draw/nrl-premiership/${round.year}/round-${round.number}`)
                .then((response) => {
                    if (response.status == 200) {
                        const html = response.data;
                        const $ = cheerio.load(html);
                        var filterData = $('div[id="vue-draw"]').attr('q-data').trim();
                        var json = JSON.parse(filterData);
                        json.drawGroups.forEach(function(d) {
                            d.matches.forEach(function(g) {
                                // Collect the main match details
                                var matchDate = moment(g.clock.kickOffTimeLong);
                                var match = new Match(matchDate.toDate(), g.venue);

                                // Build away team deatils
                                match.awayTeam = new Team(g.awayTeam.nickName);
                                match.awayTeam.score = g.awayTeam.score;
                                match.awayTeam.players = [];

                                // Build home team details
                                match.homeTeam = new Team(g.homeTeam.nickName);
                                match.homeTeam.score = g.homeTeam.score;
                                match.homeTeam.players = [];

                                matches.push(match);
                            });
                        });
                        resolve(matches);
                    }
                }, (error) => reject(error));
        });
    }
}

module.exports = NrlCompetition;