let client = require('../DockerClient');

module.exports = function(argv) {
    client.createContainer(argv.name, argv.port, argv.queryPort, argv.downloadPort);
};