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
  createLiveConfig) createLiveConfig;;
  *)
    help
    exit 1
    ;;

  esac
}

function help {
  echo "Usage:"
  echo " runLocal          start and connect to local backend"
  echo " runTest2          start and connect to test2 backend"
  echo " runStaging2       start and connect to staging2 backend"
  echo " createLiveConfig  creates the right config.ts file for production. The file contains sensitive information."
}

function ensure_pass() {
  local command=${PASS_CMD:-../password-store/go pass}

  if [ -z `${command} &> /dev/null` ] ; then
    echo "Using pass: ${command}"
  else
    echo "Unable to run ${command}. Please verify that your pass environment is working."
    exit 1
  fi

}

function createLiveConfig() {
  ensure_pass
  local api_key_secret=`../password-store/go pass show sc_production/api_key_secret`
  sed "s/secret_placeholder/${api_key_secret//&/\\&}/g" src/config/config.ts.live > src/config/config.ts
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
