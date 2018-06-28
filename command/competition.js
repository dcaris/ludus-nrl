const program = require('commander');
const competition = require('../competitions/competition');
const columnify = require('columnify');

const getCompetitions = () => {
    var competitions = competition.getAllCompetitions();
    console.log(columnify(competitions));
};

exports.command = () => program
    .command('competition')
    .alias('c')
    .description('List different Rugby League competitions')
    .action(() => getCompetitions());