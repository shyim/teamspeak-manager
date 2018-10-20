const Docker = require('dockerode'),
    fs = require('fs');

class DockerClient {
    constructor() {
        this.docker = new Docker();
    }

    createContainer(name, port, queryPort, downloadPort) {
        if (fs.existsSync(global.path + '/instances/' + name)) {
            throw new Error(`Name ${name} is already given`)
        }

        fs.mkdirSync(global.path + '/instances/' + name);
        fs.mkdirSync(global.path + '/configs/' + name);

        DockerClient.addTeamspeakConfig(global.path + '/instances/' + name, port, queryPort, downloadPort);

        this.docker.pull('teamspeak:latest', (err, stream) => {
            console.log('Pulling teamspeak:latest from hub.docker.com');
            this.docker.modem.followProgress(stream, () => {
                this.docker.createContainer({
                    Image: 'teamspeak:latest',
                    Env: [
                        'TS3SERVER_LICENSE=accept'
                    ],
                    Cmd: ['ts3server', 'inifile=/var/ts3server/server.ini'],
                    HostConfig: {
                        NetworkMode: 'host',
                        Mounts: [
                            {
                                Target: '/var/ts3server/',
                                Source: global.path + '/instances/' + name,
                                Type: 'bind',
                                ReadOnly: false
                            }
                        ]
                    }
                }).then(result => {
                    console.log(`Container created with id ${result.id}`);
                    result.start().then(() => {
                        console.log('Container is started');
                        console.log(`Execute "docker logs -f ${result.id}" to see the permission key`);

                        fs.writeFileSync(global.path + '/configs/' + name + '/config.json', JSON.stringify({
                            id: result.id,
                            port: port,
                            queryPort: port,
                            downloadPort: downloadPort
                        }));
                    });
                })
            });
        });
    }

    static addTeamspeakConfig(folder, port, queryPort, downloadPort) {
        fs.writeFileSync(folder + '/server.ini',  'voice_ip=0.0.0.0\n' +
            'filetransfer_port=' + downloadPort + '\n' +
            'default_voice_port=' + port + '\n' +
            'filetransfer_ip=0.0.0.0\n' +
            'query_port=' + queryPort + '\n' +
            'dbsqlpath=/opt/ts3server/sql/\n'
        )
    }

    start (id) {
        return this.docker.getContainer(id).start();
    }

    stop (id) {
        return this.docker.getContainer(id).stop();
    }

    listContainers (callback) {
        this.docker.listContainers(callback);
    }
}

module.exports = new DockerClient();