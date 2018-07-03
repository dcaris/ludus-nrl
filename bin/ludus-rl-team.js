const program = require('commander');
const command = require('../command/team');
const pkg = require('../package.json');

// Setup commands
program
    .version(pkg.version);
program
    .command('list <competition>')
    .alias('ls')
    .description('List teams for Rugby League competitions')
    .action((competition) => command.getTeams(competition));
program
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}