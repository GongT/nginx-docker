import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
import {MicroBuildConfig, ELabelNames, EPlugins} from "./.micro-build/x/microbuild-config";
import {JsonEnv} from "./.jsonenv/_current_result";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
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

// temp
build.forwardPort(JsonEnv.mCotton.mqttRegisterPort).publish(JsonEnv.mCotton.mqttRegisterPort);
build.forwardPort(JsonEnv.mCotton.mqttMessagePort).publish(JsonEnv.mCotton.mqttMessagePort);
// temp

build.forceLocalDns();

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
build.prependDockerFileContent('RUN rm -rf /etc/nginx && ln -s /data/config /etc/nginx');
