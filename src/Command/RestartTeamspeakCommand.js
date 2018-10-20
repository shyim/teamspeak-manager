let instance = require('../Instance');


module.exports = function(argv) {
    let container = instance.getContainer(argv.name);

    container.restart()
        .then(() => {
            console.log(`Restarted teamspeak with name ${argv.name}`);
        }).catch(err => {
            console.error(`Could not restart teamspeak with name ${argv.name}`);
            console.error(err);
        });
};