#!/usr/bin/env bash
set -e

print () {
    tput setab 0
    tput setaf 2
    echo "$1"
    tput setab 0
    tput setaf 7
}

export DEPLOY_PATH=/home/spacehub/projects/sumeiklima.org
export HOST=spacehub.rs
export USER=spacehub
export PORT=2233
export ARTIFACT_NAME=artifact-`date '+%Y%m%d%H%M%S'`.tar.gz;

print "> composer install"
composer install

print "> yarn build"
yarn build

#print "> Security audit"
#yarn audit

#print "> Unit test"
#composer unit-test

#print "> Acceptance test"
#composer acceptance-test

print "> uploading artifact"
tar -czf ${ARTIFACT_NAME} -T ./bin/deploy.list
scp -r -P ${PORT} ${ARTIFACT_NAME} ${USER}@${HOST}:/${DEPLOY_PATH}/
rm ${ARTIFACT_NAME}

ssh ${USER}@${HOST} -p${PORT} "cd $DEPLOY_PATH && rm -rf ./assets ./bin ./config ./public/build ./src ./templates ./tests ./translations ./vendor"
ssh ${USER}@${HOST} -p${PORT} "cd $DEPLOY_PATH && tar -xf $ARTIFACT_NAME && rm $ARTIFACT_NAME"

print "> clear cache"
ssh ${USER}@${HOST} -p${PORT} "$DEPLOY_PATH/bin/console cache:clear"

print "> execute migrations"
ssh ${USER}@${HOST} -p${PORT} "$DEPLOY_PATH/bin/console doctrine:migrations:migrate --no-interaction"
