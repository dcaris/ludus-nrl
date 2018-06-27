const program = require('commander');

const getPlayerDetails = (competition, filter, callback) => {
    if (!competition) throw "No competition parameter provided";
    if (!filter) throw "No filter parameter provided";
    //if (round && !Number.isInteger(round)) throw "No round parameter provided";
    //if (year && !Number.isInteger(year)) throw "No year parameter provided";

    console.log('players go here (%s %s)', competition, filter);
};

exports.command = () => {
    return program
        .command('player <competition> <filter>')
        .description('List player details')
        .action((competition, filter) => {
            getPlayerDetails(competition,
                filter,
                (players) => console.log('players go here'));
        });
};