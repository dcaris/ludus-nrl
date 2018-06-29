const competition = require('../competition');
const osmosis = require("osmosis");
const Team = require('../team');

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
        osmosis
            .get('https://www.nrl.com/clubs/')
            .find('.club-card__content')
            .set({
                'name': 'h2.club-card__title'
            })
            .data((json) => {
                let team = new Team(json.name.replace('\r\n', ' '));
                teams.push(team);
            })
            .done(() => callback(teams));
    }

}

module.exports = nrl;