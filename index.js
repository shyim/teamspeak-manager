#!/usr/bin/env node

let yargs = require('yargs'),
    fs = require('fs');

global.path = `${process.env['HOME']}/.tsm`;

if (!fs.existsSync(global.path)) {
    fs.mkdirSync(global.path);
}

if (!fs.existsSync(global.path + '/instances/')) {
    fs.mkdirSync(global.path + '/instances/');
}

if (!fs.existsSync(global.path + '/configs/')) {
    fs.mkdirSync(global.path + '/configs/');
}

yargs.version('0.0.1')
    .usage('tsm <cmd> [args]')
    .command('list', 'List all entries', () => {}, require('./src/Command/ListTeamspeakCommand'))
    .command('create <name> <port> <queryPort> <downloadPort>', 'Create a new instance', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: null,
            describe: 'Name'
        });

        yargs.positional('port', {
            type: 'integer',
            default: null,
            describe: 'Port'
        });

        yargs.positional('queryPort', {
            type: 'integer',
            default: null,
            describe: 'Server Query Port'
        });

        yargs.positional('downloadPort', {
            type: 'integer',
            default: null,
            describe: 'Filemanager Download Port'
        });

    }, require('./src/Command/CreateTeamspeakCommand'))
    .command('start <name>', 'Start a instance', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: null,
            describe: 'Name'
        });

    }, require('./src/Command/StartTeamspeakCommand'))
    .command('stop <name>', 'Stop a instance', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: null,
            describe: 'Name'
        });

    }, require('./src/Command/StopTeamspeakCommand'))
    .command('restart <name>', 'Restart a instance', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: null,
            describe: 'Name'
        });

    }, require('./src/Command/RestartTeamspeakCommand'))
    .command('delete <name>', 'Delete a instance', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: null,
            describe: 'Name'
        });

    }, require('./src/Command/DeleteTeamspeakCommand'))
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;