#!/bin/bash

set -e

# Get current directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="${DIR}/../meteor-app"

# Read version tag from the npm package file, if not provided.
JS="\
var npmInfo = require('${APP_DIR}/package.json');\
var packageVersion = npmInfo.version;\
console.log(packageVersion);\
"
TAG=${TAG:-$(echo $JS | node)}

(
  cd "${APP_DIR}" && \
  meteor npm install --production --unsafe-perm && \
  meteor build --architecture os.linux.x86_64 "${DIR}"
)

docker build -t openskope/web-app:$TAG "${DIR}"
