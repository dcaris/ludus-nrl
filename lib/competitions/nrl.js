const Competition = require('../model/competition');
const Team = require('../model/team');
const Round = require('../model/round');
const axios = require('axios');
const cheerio = require('cheerio');

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
     *
     * @returns
     * @memberof Team
     */
    clubs(callback) {
        var teams = [];
        axios.default.get(`https://www.nrl.com/clubs/`)
            .then((response) => {
                if (response.status == 200) {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    $('div.club-card__content').each(((i, elem) => {
                        let team = new Team($(elem).find('h2.club-card__title').text().trim().replace('\n', ' '));
                        teams.push(team);
                    }));
                    callback(teams);
                }
            }, (error) => console.log(error));
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
}

module.exports = NrlCompetition;