class Team {
    /**
     *Creates an instance of Team.
     * @param {string} fullname
     * @memberof Team
     */
    constructor(fullname = "") {
        this.fullname = fullname;
    }
}

exports.Team = Team;