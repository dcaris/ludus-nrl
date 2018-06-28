const competition = require('./competition');

class nrl extends competition {
    constructor() {
        super("National Rugby League",
            "nrl",
            "Australia",
            "http://www.nrl.com/");
    }
}

module.exports = nrl;