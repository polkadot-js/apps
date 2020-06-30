#!/usr/bin/env bash
# Copyright 2017-2020 @polkadot/apps authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

# fail fast on any non-zero exits
set -e

# the docker image name and dockerhub repo
NAME="polkadot-js-apps"
REPO="jacogr"

# extract the current npm version from package.json
VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | sed 's/ //g')

echo "*** Building $NAME"
docker build -t $NAME .

docker login -u $REPO -p $DOCKER_PASS

echo "*** Tagging $REPO/$NAME"
if [[ $VERSION != *"beta"* ]]; then
  docker tag $NAME $REPO/$NAME:$VERSION
fi
docker tag $NAME $REPO/$NAME

echo "*** Publishing $NAME"
docker push $REPO/$NAME
