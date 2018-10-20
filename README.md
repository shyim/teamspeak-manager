# Simple Teamspeak Manager for managing multiple servers on one host

## Why?

When you run multiple teamspeaks using Docker and you forward the ports, there will be a Filetransfer issue. So i wrote a simple CLI which fixes easy the issue with a generated ts3server.ini

## Requirements

* Docker
* min NodeJs 8.x

## Install

```bash
npm install -g teamspeak-manager
```

## Usage

All configs and teamspeak-files will be saved in $HOME/.tsm

### Create a new instance

```bash
tsm create TS1 9987 9987 101457
```

´´´bash
tsm create TS2 9988 9988 101458
```

### Start / Stop / Restart / Delete

```bash
tsm start TS1

tsm stop TS1

tsm restart TS1

tsm delete TS1
```