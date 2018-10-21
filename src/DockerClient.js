const Docker = require('dockerode'),
    fs = require('fs'),
    hub = require('./DockerHub');

class DockerClient {
    constructor() {
        this.docker = new Docker();
    }

    async createContainer(name, port, queryPort, downloadPort, version) {
        if (fs.existsSync(global.path + '/instances/' + name)) {
            throw new Error(`Name ${name} is already given`)
        }

        if (version === null || version === undefined || version === 'latest') {
            version = await hub.getLatestVersion();
        }

        this.docker.pull(`teamspeak:${version}`, (err, stream) => {
            console.log(`Pulling teamspeak:${version} from hub.docker.com`);

            if (err) {
                console.error(`Downloading version ${version} failed`);
                return;
            }

            this.docker.modem.followProgress(stream, () => {
                fs.mkdirSync(global.path + '/instances/' + name);
                fs.mkdirSync(global.path + '/configs/' + name);

                DockerClient.addTeamspeakConfig(global.path + '/instances/' + name, port, queryPort, downloadPort);

                this.createDockerContainer(name, version)
                    .then(result => {
                    console.log(`Container created with id ${result.id}`);
                    result.start().then(() => {
                        console.log('Container is started');
                        console.log(`Execute "docker logs -f ${result.id}" to see the permission key`);

                        fs.writeFileSync(`${global.path}/configs/${name}/config.json`, JSON.stringify({
                            id: result.id,
                            port: port,
                            queryPort: port,
                            downloadPort: downloadPort,
                            version: version
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

    stop (id) {
        return this.docker.getContainer(id).stop();
    }

    listContainers (callback) {
        this.docker.listContainers(callback);
    }

    createDockerContainer(name, version) {
        return this.docker.createContainer({
            Image: `teamspeak:${version}`,
            Env: [
                'TS3SERVER_LICENSE=accept'
            ],
            Cmd: ['ts3server', 'inifile=/var/ts3server/server.ini'],
            HostConfig: {
                NetworkMode: 'host',
                Mounts: [
                    {
                        Target: '/var/ts3server/',
                        Source: `${global.path}/instances/${name}`,
                        Type: 'bind',
                        ReadOnly: false
                    }
                ]
            }
        });
    }
}

module.exports = new DockerClient();