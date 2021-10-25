#!/usr/bin/env bash
# Copyright 2017-2021 @polkadot/apps authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

# fail fast on any non-zero exits
set -e

# the docker image name and dockerhub repo
NAME="polkadot-js-apps"
REPO="jacogr"
ARCH="linux/amd64,linux/arm64/v8,linux/arm/v7"

echo "*** Logging in to Dockerhub"
docker login -u $REPO -p $DOCKER_PASS

echo "*** Getting tags"
TAGS="--tag ${REPO}/${NAME}:latest"
# extract the current npm version from package.json
VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | sed 's/ //g')

if [[ $VERSION != *"beta"* ]]; then
  TAGS="${TAGS} --tag ${REPO}/${NAME}:${VERSION}"
fi

echo "*** Building $NAME"
BUILD="docker buildx build \
  --platform $ARCH \
  $TAGS \
  -f docker/Dockerfile \
  --push \
  ."
echo $BUILD
$BUILD
