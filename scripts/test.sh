#!/bin/bash

set -eou pipefail # Safe mode

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PACKAGE_DIR="$(dirname "${SCRIPT_DIR}")"

cd "${PACKAGE_DIR}"

export PATH="./node_modules/.bin:${PATH}"

SCRIPT_NAME="$( basename "${BASH_SOURCE[0]}" )"

function usage() {
	>&2 echo "Usage: ${SCRIPT_NAME}"
	exit 1
}

if [ $# -ne 0 ]; then
	>&2 echo "Error: Unxpected arguments"
	usage
fi

set -o xtrace
npm run lint
npm run build
npm run unit-test

# Test whether "init" command works in a unpackaged package. This is necessary
# because npm makes it difficult to use a package as a project template and
# we've had to jump through some hoops to accommodate.

TMP_DIR="$( mktemp -d )"
npm pack
mv carnesen-dev-*.tgz "${TMP_DIR}"
cd "${TMP_DIR}"
tar xvfz carnesen-dev-*.tgz > /dev/null
cd package/
npm install --production > /dev/null
cd ..
mkdir tmp
cd tmp
node ../package/lib init > /dev/null

echo "All tests completed sucessfully"
