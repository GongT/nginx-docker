#!/bin/sh

if [ -z "${RUN_IN_DOCKER}" ]; then
	echo "Only run in docker." >&2
fi

echo "remove cache files."

rm -rvf /etc/nginx/generated.d
rm -rvf /etc/nginx/config.d

echo "Try start nginx server."

nginx
