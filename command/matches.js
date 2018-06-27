const program = require('commander');

const getMatches = (competition, round, year, detailed, callback) => {
    if (!competition) throw "No competition parameter provided";
    //if (round && !Number.isInteger(round)) throw "No round parameter provided";
    //if (year && !Number.isInteger(year)) throw "No year parameter provided";

    console.log('matches go here (%s %s %s %s)', competition, round, year, detailed);
};

exports.command = () => {
    return program
        .command('matches <competition>')
        .description('List all matches by round')
        .option('-r, --round <round>', 'Round number', 0)
        .option('-y, --year <year>', 'The year', new Date().getFullYear())
        .option('-d, --detailed', 'Return detailed match stats', false)
        .action((competition, option) => {
            getMatches(competition,
                option.round,
                option.year,
                option.detailed,
                (matches) => console.log('matches go here'));
        });
};