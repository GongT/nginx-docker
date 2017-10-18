#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")"
mkdir -p certbot-root letsencrypt config
mkdir -p /data/docker/nginx/

for i in "certbot-root" "letsencrypt" "config"; do
	[ -e "/data/docker/nginx/$i" ] && unlink "/data/docker/nginx/$i"
	ln -s "`pwd`/$i" /data/docker/nginx/
done

[ -e "/etc/letsencrypt" ] && unlink "/etc/letsencrypt"
ln -s `pwd`/letsencrypt /etc/
