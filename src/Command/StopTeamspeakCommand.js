let instance = require('../Instance');


module.exports = function(argv) {
    let container = instance.getContainer(argv.name);

    container.stop()
        .then(() => {
            console.log(`Stopped teamspeak with name ${argv.name}`);
        }).catch((err) => {
            console.log(`Could not stop teamspeak with name ${argv.name}`);
            console.log(err);
        });
};