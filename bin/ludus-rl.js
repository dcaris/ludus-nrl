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
    //.command('round', 'List all matches by round')
    //.command('player', 'List all players')
    .parse(process.argv);