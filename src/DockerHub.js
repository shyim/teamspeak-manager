const https = require('https');

class DockerHub {
    getLatestVersion() {
        return new Promise((resolve) => {
            https.get('https://hub.docker.com/v2/repositories/library/teamspeak/tags/?page=1&page_size=250', (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    resolve(this.resolveLatestVersion(JSON.parse(data)));
                });
            });
        })
    }

    resolveLatestVersion(data) {
        let found = false;

        data.results.forEach(version => {
            if (version.name !== 'latest' && found === false) {
                found = version.name;
            }
        });

        return found;
    }
}

module.exports = new DockerHub();