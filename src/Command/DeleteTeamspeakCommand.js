let instance = require('../Instance'),
    deleteFolder = require('folder-delete');


module.exports = async function(argv) {
    let container = instance.getContainer(argv.name);

    try {
        await container.stop();
    } catch (e) {
        console.log(typeof e.reason === 'string' ? e.reason : e);
    }

    container.remove()
        .then(() => {
            console.log(`Deleted container for teamspeak instance ${argv.name}`);

            deleteFolder(`${global.path}/configs/${argv.name}`);

            try {
                deleteFolder(`${global.path}/instances/${argv.name}`);
            } catch (e) {
                console.error(`Could not delete instance data directory. Please delete it yourself (${global.path}/instances/${argv.name})`);
            }

        }).catch(err => {
            console.error(`Could not delete teamspeak instance with name ${argv.name}`);
            console.error(err);
        });
};