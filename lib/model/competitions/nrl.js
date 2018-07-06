const competition = require('../competition');
const Team = require('../team');
const axios = require('axios');
const cheerio = require('cheerio');

class nrl extends competition {
    constructor() {
        super("National Rugby League",
            "nrl",
            "Australia",
            "http://www.nrl.com/");
    }

    /**
     * Returns list of teams for competition 
     *
     * @returns
     * @memberof nrl
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

}

module.exports = nrl;