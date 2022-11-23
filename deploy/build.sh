#!/bin/bash

set -exu -o pipefail

: "${AWS_REGION:=us-west-2}"
: "${CONTAINER_REGISTRY:=201135299591.dkr.ecr.${AWS_REGION}.amazonaws.com}"
: "${CONTAINER_TAG:=$(git rev-parse HEAD)}"

export CONTAINER_TAG

docker build -f deploy/Dockerfile -t "${CONTAINER_REGISTRY}/polymesh/app-ui:${CONTAINER_TAG}" .
