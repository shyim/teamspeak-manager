let instance = require('../Instance'),
    hub = require('../DockerHub'),
    client = require('../DockerClient'),
    fs = require('fs');


module.exports = async function (argv) {
    let config = instance.getConfiguration(argv.name);
    let version = await hub.getLatestVersion();

    if (version === config.version) {
        console.log(`Already on latest version ${version}`);
        return;
    }

    let container = instance.getContainer(argv.name);

    try {
        await container.stop();
    } catch (e) {
        console.log(typeof e.reason === 'string' ? e.reason : e);
    }

    container.remove()
        .then(() => {
            console.log(`Deleted container for teamspeak instance ${argv.name}`);

            client.createDockerContainer(argv.name, version)
                .then(result => {
                    console.log(`Created new container for teamspeak instance ${argv.name} with id ${result.id}`);
                    result.start().then(() => {
                        console.log(`Container for teamspeak instance ${argv.name} started`);
                    });

                    config.version = version;
                    config.id = result.id;
                    fs.writeFileSync(`${global.path}/configs/${argv.name}/config.json`, JSON.stringify(config));
                })
        })
        .catch((err) => {
            console.log(`Could not delete teamspeak instance with name ${argv.name}`);
            console.log(err);
        });
};