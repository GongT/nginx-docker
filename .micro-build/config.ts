import {MicroBuildConfig, ELabelNames} from "./x/microbuild-config";
declare const build: MicroBuildConfig;
/*
 +==================================+
 | <**DON'T EDIT ABOVE THIS LINE**> |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'nginx-docker';

build.baseImage('nginx', 'alpine');
build.projectName(projectName);
build.domainName(projectName + '.localdomain');

build.forwardPort(80).publish(80);
build.forwardPort(443).publish(443);

build.startupCommand('nginx -c /etc/nginx/nginx.conf -g "daemon off;"');
build.shellCommand('/bin/sh', '-c');
build.stopCommand('nginx', '-s', 'quit');

build.dependService('microservice-dnsmasq', 'git@github.com:GongT/microservice-dnsmasq.git');
build.dockerRunArgument('--dns=127.0.0.1', '--tmpfs=/etc/nginx/generated.d:rw,noexec,nosuid,nodev,size=500k');

build.nsgLabel(ELabelNames.alias, ['nginx']);

build.environmentVariable('RUN_IN_DOCKER', 'yes');

build.volume('./config', '/etc/nginx');
build.volume('/var/log', '/var/log');
build.volume('/var/run', '/host/var/log');

// build.prependDockerFile('install.Dockerfile');
// build.appendDockerFile('configure.Dockerfile');
