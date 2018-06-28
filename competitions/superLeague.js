const competition = require('./competition');

class superLeague extends competition {
    constructor() {
        super("Super League",
            "sl",
            "England",
            "http://www.rugby-league.com/superleague/");
    }
}

module.exports = superLeague;