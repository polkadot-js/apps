#!/bin/bash

set -exu -o pipefail

: "${AWS_PROFILE:=polymesh_primary}"
: "${AWS_REGION:=us-west-2}"
: "${CONTAINER_REGISTRY:=201135299591.dkr.ecr.${AWS_REGION}.amazonaws.com}"
: "${CONTAINER_TAG:=$(git rev-parse HEAD)}"

export AWS_REGION
export AWS_DEFAULT_REGION=$AWS_REGION

if [[ $(whoami) != "jenkins" ]]; then
    export AWS_PROFILE=$AWS_PROFILE
fi

aws ecr get-login-password | \
    docker login "$CONTAINER_REGISTRY" --username AWS --password-stdin

docker push "${CONTAINER_REGISTRY}/polymesh/app-ui:${CONTAINER_TAG}" || true # temporary workaround for "... image tag already exists... and cannot be overwritten because the repository is immutable."
