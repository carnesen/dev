#!/bin/bash

set -eou pipefail # Safe mode

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SCRIPT_NAME="$( basename "${BASH_SOURCE[0]}" )"
PACKAGE_DIR="$(dirname "${SCRIPT_DIR}")"

cd "${PACKAGE_DIR}"

export PATH="./node_modules/.bin:${PATH}"

SEMVER_BUMP="${1:-""}"

function usage() {
	echo "Usage: ${SCRIPT_NAME} <semver bump>"
	exit 1
}

if [ "${SEMVER_BUMP}" = "" ]; then
	usage
fi

npm ci
npm run build
node lib release --semverBump "${SEMVER_BUMP}"
