const Competition = require('../competition');
const Team = require('../team');
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
    getTeams(callback) {
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

    getRoundSummary(round, year, callback) {
        var matches = [];
        axios.default.get(`https://www.nrl.com/draw/?competition=${this.externalId}&season=${year}&round=${round}`)
            .then((response) => {
                if (response.status == 200) {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    var d = $('div[id="vue-draw"]').attr('q-data').trim();
                    console.log(d);
                }
            }, (error) => console.log(error));
    }
}

module.exports = NrlCompetition;