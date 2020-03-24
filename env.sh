#!/bin/bash

# This script is used when the docker container starts and does the magic to
# bring the ENV variables to the generated static UI.

# Recreate config file
echo -n > ./env-config.js

# Add assignment
echo "window.process_env = {" >> ./env-config.js

declare -a vars=(
  "WS_URL"
  "SAMPLE"
)

for VAR in ${vars[@]}; do
  echo "  $VAR: \"${!VAR}\"," >> ./env-config.js
done

echo "}" >> ./env-config.js
