const competition = require('./competition');

class nswrl extends competition {
    constructor() {
        super("Intrust Championship",
            "nswrl",
            "New South Wales, Australia",
            "http://www.nswrl.com.au/");
    }
}

module.exports = nswrl;