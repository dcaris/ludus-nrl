const osmosis = require("osmosis");
const { competition } = require('../model/competition');
const program = require('commander');

const getCompetitions = () => {
    competition.forEach(((type) => {
        console.log('%s: %s', type.code, type.name)
    }));
}

exports.command = () => {
    program
        .command('competition')
        .alias('c')
        .description('List different Rugby League competitions')
        .action(() => {
            getCompetitions();
        })
}