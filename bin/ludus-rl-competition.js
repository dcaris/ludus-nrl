const program = require('commander');
const command = require('../command/competition');
const pkg = require('../package.json');

// Setup commands
program
    .version(pkg.version);
program
    .command('list')
    .alias('ls')
    .description('List different Rugby League competitions')
    .action(() => command.getCompetitions());
program
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}