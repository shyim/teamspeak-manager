const Docker = require('./DockerClient'),
    fs = require('fs');

class Instance {
    getConfiguration(name) {
        let instanceConfig = `${global.path}/configs/${name}/config.json`;

        if (!fs.existsSync(instanceConfig)) {
            throw new Error(`Could not find configuration for ${name}`);
        }

        return JSON.parse(fs.readFileSync(instanceConfig));
    }

    getContainer(name) {
        return Docker.docker.getContainer(this.getConfiguration(name).id);
    }
}

module.exports = new Instance();