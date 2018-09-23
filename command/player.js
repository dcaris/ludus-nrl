const program = require('commander');

const getPlayerDetails = (competition, filter) => {
    if (!competition) throw new Error('No competition parameter provided');
    if (!filter) throw new Error('No filter parameter provided');

    console.log('players go here (%s %s)', competition, filter);
};

exports.command = () => {
    return program
        .command('player <competition> <filter>')
        .description('List player details')
        .action((competition, filter) => getPlayerDetails(competition, filter));
};