#!/bin/bash

set -eou pipefail # Safe mode

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SCRIPT_NAME="$( basename "${BASH_SOURCE[0]}" )"

PACKAGE_DIR="$(dirname "${SCRIPT_DIR}")"

cd "${PACKAGE_DIR}"

export PATH="./node_modules/.bin:${PATH}"

function usage() {
	>&2 echo "Usage: ${SCRIPT_NAME}"
	exit 1
}

if [ $# -ne 0 ]; then
	>&2 echo "Error: Unxpected arguments"
	usage
fi

# Echo all commands to the terminal
set -o xtrace 

# Since npm publish always excludes .gitignore, we need to jump through hoops to
# include a copy of it in the published package
# https://github.com/npm/npm/issues/3763
cp .gitignore .gitignore.copy
cp .npmrc .npmrc.copy

rm -rf lib
tsc
