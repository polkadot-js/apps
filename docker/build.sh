#!/usr/bin/env bash
# Copyright 2017-2022 @polkadot/apps authors & contributors
# This software may be modified and distributed under the terms
# of the Apache-2.0 license. See the LICENSE file for details.

# fail fast on any non-zero exits
set -e

# the docker image name and dockerhub repo
NAME=aleph-wallet
ECR_REGISTRY=public.ecr.aws/x2t8a1o3

# -- BUIDL

# extract the current npm version from package.json
VERSION=$(cat package.json \
            | grep version \
            | head -1 \
            | awk -F: '{ print $2 }' \
            | sed 's/[",]//g' \
            | sed 's/ //g')

echo "*** Buidling $NAME"
#docker build -t $NAME:latest -f docker/Dockerfile .

docker tag $NAME:latest $ECR_REGISTRY/$NAME:latest
docker tag $NAME:latest $ECR_REGISTRY/$NAME:$VERSION
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
echo "*** Pushing to $ECR_REGISTRY/$NAME"
docker push --all-tags $ECR_REGISTRY/$NAME

exit $?
