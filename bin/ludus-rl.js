#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify({ isGlobal: true });

// Setup default commands
program
    .version(pkg.version)
    .command('competition', 'List all the competitions')
    .command('team', 'List all the teams for the competition')
    //.command('match', 'List match details per round')
    .command('round', 'List all round details for the competition')
    //.command('player', 'List all players')
    .parse(process.argv);