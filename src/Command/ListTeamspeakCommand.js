const fs = require('fs');
const Table = require('cli-table');
const Docker = require('../DockerClient');

module.exports = () => {
    var table = new Table({
        head: ['Name', 'Version', 'Port', 'Server-Query Port', 'Download Port', 'Running']
    });

    fs.readdir(global.path + '/configs', (err, result) => {
        Docker.listContainers((err, containers) => {
            containers = containers.map(item => item.Id);

            result.forEach(async folder => {
                let config = JSON.parse(fs.readFileSync(global.path + '/configs/' + folder + '/config.json'));

                table.push([
                    folder,
                    config.version,
                    config.port,
                    config.queryPort,
                    config.downloadPort,
                    containers.indexOf(config.id) > -1 ? 'Yes' : 'No'
                ])
            });

            console.log(table.toString());
        })
    })
};