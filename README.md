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

In default all instances will be created with the latest version. If you want to select a version specify it on the 5 argument.

```bash
tsm create <name> <port> <server query port> <filemanager port>
```

### Start / Stop / Restart / Delete / Update

```bash
tsm start <name>

tsm stop <name>

tsm restart <name>

tsm delete <name>

tsm update <name>
```
