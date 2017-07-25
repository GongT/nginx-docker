/// <reference path="./.jsonenv/_current_result.json.d.ts"/>
import {JsonEnv} from "@gongt/jenv-data";
import {EPlugins, MicroBuildConfig} from "./.micro-build/x/microbuild-config";
import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
/*
 +==================================+
 |  **DON'T EDIT ABOVE THIS LINE**  |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'nginx';

build.baseImage('nginx', 'alpine');
build.projectName(projectName);
build.domainName(projectName + '.' + JsonEnv.baseDomainName);

build.isInChina(JsonEnv.gfw.isInChina, JsonEnv.gfw);
build.systemInstall(
	'nginx-mod-http-lua',
	'nginx-mod-http-echo',
	'nginx-mod-http-image-filter',
	'nginx-mod-http-fancyindex',
	'nginx-mod-http-headers-more',
	'nginx-mod-stream',
);

build.forwardPort(80);
build.forwardPort(81).publish(80);
build.forwardPort(443).publish(443); // no need export if no gateway

build.forceLocalDns(false, true);

build.startupCommand('./scripts/start');
build.shellCommand('/bin/sh');
build.stopCommand('./scripts/stop');

build.dependService('microservice-dnsmasq', 'http://github.com/GongT/microservice-dnsmasq.git');
build.dockerRunArgument('--dns=${HOST_LOOP_IP}', '--cap-add=SYS_ADMIN');

build.specialLabel(ELabelNames.alias, ['nginx']);

build.noDataCopy();
build.appendDockerFileContent('COPY scripts /data/scripts');

build.volume('./config', '/data/config');
build.volume('./letsencrypt', '/data/letsencrypt');
build.volume('./certbot-root', '/data/certbot-root');

build.volume('/var/log', '/host/var/log');
build.volume('/var/run', '/host/var/run');
build.volume('/data', '/host/data:ro');

build.disablePlugin(EPlugins.jenv);

build.appendDockerFileContent(`RUN \
	mv /etc/nginx/modules/ /usr/local/ \
	&& rm -rf /etc/nginx \
	&& ln -s /data/config /etc/nginx
`);

let postRun = '';
if (JsonEnv.services && JsonEnv.services.nginx) {
	if (JsonEnv.services.nginx.ports) {
		for (const port of JsonEnv.services.nginx.ports) {
			build.forwardPort(port);
			build.forwardPort(port + 1).publish(port);
		}
	}
	if (JsonEnv.services.nginx.postRun) {
		postRun = JsonEnv.services.nginx.postRun;
	}
}

build.systemd({
	type: 'simple',
	watchdog: 0,
	startTimeout: 10,
	commands: {
		postStart: postRun,
	},
});
