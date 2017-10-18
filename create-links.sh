#!/usr/bin/env bash

cd "$(dirname "${BASH_SOURCE[0]}")"
mkdir -p certbot-root letsencrypt config
mkdir -p /data/docker/nginx/

ln -s `pwd`/certbot-root /data/docker/nginx/
ln -s `pwd`/letsencrypt /data/docker/nginx/
ln -s `pwd`/config /data/docker/nginx/

ln -s `pwd`/letsencrypt /etc/
