import {MicroBuildConfig, ELabelNames, EPlugins} from "./x/microbuild-config";
declare const build: MicroBuildConfig;
/*
 +==================================+
 | <**DON'T EDIT ABOVE THIS LINE**> |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'nginx';

build.baseImage('nginx', 'alpine');
build.projectName(projectName);
build.domainName(projectName + '.' + JsonEnv.baseDomainName);

build.forwardPort(80).publish(80);
build.forwardPort(443).publish(443);

build.startupCommand('./scripts/start');
build.shellCommand('/bin/sh');
build.stopCommand('./scripts/stop');

build.dependService('microservice-dnsmasq', 'http://github.com/GongT/microservice-dnsmasq.git');
build.dockerRunArgument('--dns=${HOST_LOOP_IP}');

build.specialLabel(ELabelNames.alias, ['nginx']);

build.environmentVariable('RUN_IN_DOCKER', 'yes');

if (JsonEnv.isDebug) {
	build.volume('./config', '/etc/nginx');
	build.volume('./letsencrypt', '/etc/letsencrypt');
} else {
	build.volume('/etc/nginx', '/etc/nginx');
	build.volume('/etc/letsencrypt', '/etc/letsencrypt');
}

build.volume('/var/log', '/host/var/log');
build.volume('./certbot-root', '/data/certbot');
build.volume('/var/run', '/host/var/run');

// build.prependDockerFile('install.Dockerfile');
// build.appendDockerFile('build/configure.Dockerfile');
build.disablePlugin(EPlugins.jenv);
