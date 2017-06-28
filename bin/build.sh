#!/bin/bash

CONFIG_DIST='./src/config/config.ts.dist';
CONFIG='./src/config/config.ts';

API_KEY_NAME_PLACEHOLDER='{SC_APP_NAME}';
API_KEY_SECRET_PLACEHOLDER='{SC_APP_SECRET}';
MIX_TOKEN_PLACEHOLDER='{SC_APP_MIX_TOKEN}';

function main_build() {
    
    BUILD_PLATFORM=$1;
    BUILD_TARGET=$2;

    if [[ $BUILD_PLATFORM = 'ios' ]]
    then
        build_ios $2;
    elif [[ $BUILD_PLATFORM = 'android' ]]
    then
        build_android $2;
    else
        echo 'build-platform is not existing! (ios/android)' ;
    fi
}

function build_ios() {

    BUILD_TARGET=$1;

    if [[ $BUILD_TARGET = 'dev' ]]
    then
        ionic build ios --dev;
    elif [[ $BUILD_TARGET = 'prod' ]]
    then
        ionic build ios --prod --release;
    else
        echo 'build-target is not existing! (dev/prod)'
    fi
}

function build_android() {
    
    BUILD_TARGET=$1;

    if [[ $BUILD_TARGET = 'dev' ]]
    then
        ionic build android --dev;
    elif [[ $BUILD_TARGET = 'prod' ]]
    then
        ionic build android --prod --release;
    else
        echo 'build-target is not existing! (dev/prod)'
    fi
}

main_build $1 $2;