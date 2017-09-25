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
  runTest) runTest;;
  runTest2) runTest2;;
  runStaging2) runStaging2;;
  createConfigForLive) createConfigForLive;;
  createConfigForStaging2) createConfigForStaging2;;
  createConfigForTest) createConfigForTest;;
  createConfigForTesAt2) createConfigForTest2;;
  *)
    help
    exit 1
    ;;

  esac
}

function help {
  echo "Usage:"
  echo " runLocal          start and connect to local backend"
  echo " runTest           start and connect to test backend"
  echo " runTest2          start and connect to test2 backend"
  echo " runStaging2       start and connect to staging2 backend"
  echo " createConfigForLive      creates the right config.ts file for production. The file contains sensitive information."
  echo " createConfigForStaging2  creates the right config.ts file for staging2"
  echo " createConfigForTest      creates the right config.ts file for test"
  echo " createConfigForTest2     creates the right config.ts file for test2"
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

function createConfigForLive() {
  ensure_pass
  local api_key_secret=`../password-store/go pass show sc_production/api_key_secret`
  sed "s/secret_placeholder/${api_key_secret//&/\\&}/g" src/config/config.ts.live > src/config/config.ts
}

function createConfigForStaging2() {
  cp src/config/config.ts.staging2 src/config/config.ts
}

function createConfigForTest2() {
  cp src/config/config.ts.test2 src/config/config.ts
}

function createConfigForTest() {
  cp src/config/config.ts.test src/config/config.ts
}

function runLocal() {
  cp src/config/config.ts.local src/config/config.ts
  start
}

function runTest() {
  cp src/config/config.ts.test src/config/config.ts
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
