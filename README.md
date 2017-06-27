# SC-APP

### Ionic Cordova Application for Share&amp;Charge

## Development Preparation

Make sure you have the following applications installed and relevant paths exported:

  - homebrew
  - full xcode & xcode CLI
  - android studio, android sdk
  - java jre & sdk (Version 8)
  - cocoapods ('gem install cocoapods && pod setup')

<hr></hr>

### Set up  the machine and environment to require the proper dependencies & versions by running a series of configuration scripts located in the ./bin directory

##### NOTE: All scripts under ./bin/ have to be executed from the ROOT directory of this project. Please be aware of that the existing scripts under ./bin are not handling any exceptions right now

  1.) Run the box-setup script to ensure the right node version npm packages and ruby build tools are installed.(Be aware that it probably will destroy/change your node, npm, and possible ionic/cordova - installations) ```./bin/box-setup.sh```

  2.) Run the prepare-build script to download the required npm packages prepare the ionic build process. Fastlane will eventually take care of this process. ```./bin/prepare-build.sh```

  3.) If you want to build, you can use './bin/build.sh', but this process will eventually be replaced by running 'fastlane gym' or 'fastlane alpha'
    The script requires two parameter. The first one defines the platform you want to build for (android, ios),
    the second the target (dev, prod) (Example: ./bin/build.sh android dev)


//tbd

  10.) Copy `/src/config/config.ts.dist` to `/src/config/config.ts` and fill the values.
  11.) Run "ionic build \<PLATFORM\> [--prod] [--]"

### releasing a new version

* start a new  in gitflow
* bumb version numbers in
  * `/src/config/config.ts`
  * `/src/config/config.ts.dist`
  * `/config.xml`
* finish  in gitflow

<hr></hr>

## Manual Build & Deployment Process

### iOS

##### To build for development (deployment to TestFlight) run:
```
$ ionic build ios --device
```
You should then have a valid .ipa file that you can upload to iTunes Connect

##### To build for distribution run:
```
$ ionic build ios --prod --release
```

Open in Xcode. If you added/removed ios since the last build (or if you want to be super sure), check capabilities (push notifications).

Goto "Product > Archive". In the opened window select the latest version and push "Upload to App Store...".

### Android

Currently, the manual process we are phasing out is as follows:
```
$ ionic build android --prod --
$ cd <TO_APK_OUTPUT_PATH>
$ jarsigner -verbose -tsa http://timestamp.digicert.com -sigalg SHA1withRSA -digestalg SHA1 -keystore <PATH_TO_KEYSTORE>/share-and-charge.keystore android--unsigned.apk share_and_charge
$ zipalign -v 4 android--unsigned.apk ShareAndCharge-<VERSION_NUMBER>.apk
```

The following command includes the absolute paths for the project and keystores with the new fastlane integration
```
jarsigner -verbose -tsa http://timestamp.digicert.com  -sigalg SHA1withRSA -digestalg SHA1 -keystore ./fastlane/-cred/share-and-charge.keystore ./platforms/android/build/outputs/apk/android--unsigned.apk share_and_charge
```

double-check that apk is not debuggable:
```
$ aapt dump xmltree android--unsigned.apk AndroidManifest.xml | grep debug
```
should be empty or `false`.

If you don't have the keystore and/or passwords, ask Felix Magdeburg <felix.magdeburg@innogy.com>.

### Xcode config
Most of the settings are contained in the config.xml and applied by the
 cordova-custom-config plugin (deployment target, region, descriptions ...)
 when you add the platform.

Things you have to do by hand:
* Turn on: Capabilities -> Push notifications
* Set the provisioning profiles
##### Currently the provisioning profiles and certificates are not being managed by Fastlane and are configured manually. Eventually these will reside in a secured repository that Fastlane Match will manage for all developers.
https://github.com/fastlane/fastlane/tree/master/match

### FB SDK
Facebook plugin is (at the moment) only used to track app installations.

> "If you need to change your APP_ID after installation, it's recommended that you remove and then re-add the plugin as above. Note that changes to the APP_ID value in your config.xml file will not be propagated to the individual platform builds."

See: https://github.com/jeduan/cordova-plugin-facebook4#installation

#### Facebook SDK Configuration
If you submit a (new) iOS app version and you have the Facebook SDK included, please check the box saying “This app uses the Ad-ID (IDFA)?”

<hr></hr>

## Automated Build & Deployment Process

Fastlane is being used to automate builds to iTunes Connect (Testflight) and to the Google Play store. Fastlane can be configured to run build/deploy commands defined in "lanes" for each platform.


### iOS
##### Given the default_platform is set to ios in the Fastfile...

#### To submit a new Beta Build to Apple Testflight, execute the following: ```fastlane beta```

#### To deploy a new version to the App Store, execute the following: ```fastlane deploy```


### Android
##### Given the default_platform is set to android in the Fastfile...

### To deploy an Alpha Build of the application to Google Play, execute the following: ```fastlane alpha```

##### Take note, fastlane alpha runs several gradle and android apk build tasks which require that properly configured paths are set for ANDROID_HOME, and zipalign (android sdk build-tool). 
