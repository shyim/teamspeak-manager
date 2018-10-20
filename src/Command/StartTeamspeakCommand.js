let instance = require('../Instance');


module.exports = function(argv) {
    let container = instance.getContainer(argv.name);

    container.start()
        .then(() => {
            console.log(`Started teamspeak with name ${argv.name}`);
        }).catch(err => {
            console.error(`Could not start teamspeak with name ${argv.name}`);
            console.error(err);
        });
};