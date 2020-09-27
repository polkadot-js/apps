#!/bin/bash
# Copyright 2017-2020 @polkadot/apps authors & contributors
# SPDX-License-Identifier: Apache-2.0

# This script is used when the docker container starts and does the magic to
# bring the ENV variables to the generated static UI.

TARGET=./env-config.js

# Recreate config file
echo -n > $TARGET

declare -a vars=(
  "WS_URL"
  "SAMPLE"
)

echo "window.process_env = {" >> $TARGET
for VAR in ${vars[@]}; do
  echo "  $VAR: \"${!VAR}\"," >> $TARGET
done
echo "}" >> $TARGET
