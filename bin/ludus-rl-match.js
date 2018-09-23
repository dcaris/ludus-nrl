const program = require('commander');
const command = require('../command/match');
const pkg = require('../package.json');

// Setup commands
program
    .version(pkg.version);
program
    .command('results <competition>')
    .alias('r')
    .description('List all matches by round')
    .option('-r, --round <round>', 'Round number', 1)
    .option('-y, --year <year>', 'The year', new Date().getFullYear())
    .action((competition, option) => command.getResults(competition, option.year, option.round));
program
    .command('details <competition>')
    .alias('d')
    .description('List all matches by round')
    .option('-r, --round <round>', 'Round number', 1)
    .option('-y, --year <year>', 'The year', new Date().getFullYear())
    .option('-h, --homeTeam <homeTeam>', 'Home Team Nickname')
    .option('-a, --awayTeam <awayTeam>', 'Away Team Nickname')
    .action((competition, option) => command.getMatchDetails(competition, option.year, option.round, option.homeTeam, option.awayTeam));
program
    .command('stats <competition>')
    .alias('s')
    .description('List all matches by round')
    .option('-r, --round <round>', 'Round number', 1)
    .option('-y, --year <year>', 'The year', new Date().getFullYear())
    .option('-h, --homeTeam <homeTeam>', 'Home Team Nickname')
    .option('-a, --awayTeam <awayTeam>', 'Away Team Nickname')
    .action((competition, option) => command.getPlayerStatistics(competition, option.year, option.round, option.homeTeam, option.awayTeam));
program
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}