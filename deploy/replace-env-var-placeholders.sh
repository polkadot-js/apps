#!/bin/bash

set -exuk -o pipefail

date
echo "Replacing environment variable placeholders..."

cat /srv/env.var.list | \
    xargs -I{} bash -c "grep -rl '__{}__' /usr/share/nginx/html | xargs --no-run-if-empty sed -i 's/__{}__/\${{}}/g'"

date
echo "Finished replacing environment variable placeholders"

date
echo "Replacing environment variables with their runtime values..."

while read LINE; do
    TMP=$(mktemp)
    chmod 0644 "$TMP"
    chown root:root "$TMP"
    grep -rl "\${$LINE}" /usr/share/nginx/html | \
        xargs --no-run-if-empty -I{} bash -c "envsubst '\${$LINE}' < '{}' > '$TMP' && mv '$TMP' '{}'" || true
done < /srv/env.var.list

date
echo "Finished replacing environment variables with their runtime values"
