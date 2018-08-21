const ludus = require('../lib/ludus');
const columnify = require('columnify');

const commands = {
    getCompetitions() {
        var competitions = ludus.competitions();
        console.log(columnify(competitions, {
            columns: ['code', 'name', 'location']
        }));
    }
};

module.exports = commands;