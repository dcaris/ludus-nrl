const glob = require('glob');
const path = require('path');

class Ludus {

    /**
     * Returns all competitions available to query
     *
     * @static
     * @returns Competition[]
     * @memberof Competition
     */
    static competitions() {
        return this.competition();
    }

    /**
     * Returns a new competition object using the provided competition code
     *
     * @static
     * @param {*} code The competition code
     * @returns {Competition}
     * @memberof Competition
     */
    static competition(code) {
        var result = null;
        glob.sync('lib/competitions/*.js').forEach((file) => {
            if (!file.endsWith('competition.js')) {
                if (!code || file.endsWith(`${code}.js`)) {
                    var comp = require(path.resolve(file));
                    result = new comp();
                }
            }
        });

        return result;
    }

}

module.exports = Ludus;