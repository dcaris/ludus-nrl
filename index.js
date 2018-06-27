#!/usr/bin/env node

const chalk = require("chalk");
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');
const glob = require('glob');
const path = require('path');

// Clear terminal
//clear();

// Log header
//console.log(chalk.default.yellow(figlet.textSync('Ludus - NRL', { horizontalLayout: 'full' })));

// Load up all commander controllers
glob.sync('command/*.js').forEach((file) => {
    var controller = require(path.resolve(file));
    controller.command();
});

// Process the command line args (essentially, execute the app)
program.parse(process.argv);

// Commands
/*

command('competition', 'List all competitions')
command('team <competition>', 'List all teams by competition')
command('round <competition> -n roundNumber -y year --detailed', 'List all matches by round')
command('player <competition> -f <search>', 'List all matches by round')

*/