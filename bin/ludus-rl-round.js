const program = require('commander');
const command = require('../command/round');
const pkg = require('../package.json');

// Setup commands
program
    .version(pkg.version);
program
    .command('list <competition>')
    .alias('ls')
    .option('-y, --year <year>', 'The year', new Date().getFullYear())
    .description('List all rounds for the year')
    .action((competition, option) => command.getRounds(competition, option.year));
program
    .command('results <competition>')
    .description('List all matches by round')
    .option('-r, --round <round>', 'Round number', 1)
    .option('-y, --year <year>', 'The year', new Date().getFullYear())
    .action((competition, option) => command.getMatches(competition, option.year, option.round));
program
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}