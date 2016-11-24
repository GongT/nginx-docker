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

build.startupCommand('rm -rfv /etc/nginx/generated.d/* ; nginx -c /etc/nginx/nginx.conf -g "daemon off;"');
build.shellCommand('/bin/sh', '-c');
build.stopCommand('nginx', '-s', 'quit');

build.dependService('microservice-dnsmasq', 'http://github.com/GongT/microservice-dnsmasq.git');
build.dockerRunArgument('--dns=${HOST_LOOP_IP}');

build.nsgLabel(ELabelNames.alias, ['nginx']);

build.environmentVariable('RUN_IN_DOCKER', 'yes');

build.volume('./config', '/etc/nginx');
build.volume('/var/log', '/host/var/log');
build.volume('/var/run', '/host/var/run');

// build.prependDockerFile('install.Dockerfile');
// build.appendDockerFile('build/configure.Dockerfile');
