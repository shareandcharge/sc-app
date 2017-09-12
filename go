#!/usr/bin/env bash

# bash unofficial "strict mode"
set -euo pipefail
IFS=$'\n\t'

SOURCE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function main {
  local command=${1:-help}
  echo "Command: $command"
  case "$command" in

  runLocal) runLocal;;
  runTest2) runTest2;;
  runStaging2) runStaging2;;
  setup) setup;;
  run) run;;
  *)
    help
    exit 1
    ;;

  esac
}

function help {
  echo "Usage:"
  echo " runLocal        start and connect to local backend"
  echo " runTest2        start and connect to test2 backend"
  echo " runStaging2     start and connect to staging2 backend"
}


function runLocal() {
  cp src/config/config.ts.local src/config/config.ts
  start
}

function runTest2() {
  cp src/config/config.ts.test2 src/config/config.ts
  start
}

function runStaging2() {
  cp src/config/config.ts.staging2 src/config/config.ts
  start
}

function start() {
  npm install
  npm run ionic:serve
}

main "$@"
