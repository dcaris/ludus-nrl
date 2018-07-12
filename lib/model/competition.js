class Competition {
    /**
     * Creates an instance of competition.
     * @param {*} name
     * @param {*} code
     * @param {*} location
     * @param {*} url
     * @memberof Competition
     */
    constructor(name, code, location, url) {
        this.name = name;
        this.code = code;
        this.url = url;
        this.location = location;
    }
}

module.exports = Competition;