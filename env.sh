# This script is used in the docker image and does the magic to
# bring the ENV variables to the generated static UI.

#!/bin/bash

# Recreate config file
echo -n > ./env-config.js
# rm -rf ./env-config.js
# touch ./env-config.js

# Add assignment
echo "window.process_env = {" >> ./env-config.js

# Read each line in .env file
# Each line represents key=value pairs
# while read -r line || [[ -n "$line" ]];
# do
#   # Split env variables by character `=`
#   if printf '%s\n' "$line" | grep -q -e '='; then
#     varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
#     varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
#   fi

#   # Read value of current variable if exists as Environment variable
#   value=$(printf '%s\n' "${!varname}")
#   # Otherwise use value from .env file
#   [[ -z $value ]] && value=${varvalue}

#   # Append configuration property to JS file
#   echo "  $varname: \"$value\"," >> ./env-config.js
# done < .env

# Here we target specific ENV that may come as ENV variables
# and not through the .env file
# echo "  WS_URL: \"$WS_URL\"," >> ./env-config.js
declare -a vars=(
  "WS_URL"
  "SAMPLE"
)

for VAR in ${vars[@]}; do
  echo "  $VAR: \"${!VAR}\"," >> ./env-config.js
done

echo "}" >> ./env-config.js
