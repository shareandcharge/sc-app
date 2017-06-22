# sc-app

native-app for share&amp;charge

## preparation/development

Make sure you have the following applications installed:

  - homebrew
  - full xcode & xcode CLI
  - android studio, android sdk
  - java jre & sdk (Version 8)
  - cocoapods ('gem install cocoapods && pod setup')


!! Please be aware of that the existing scripts under ./bin are not handling any exceptions right now !!

!! All scripts under ./bin/ have to be executed from the ROOT directory of this project !!

  1.) Execute './bin/box-setup.sh'
    (Be aware that it probably will destroy/change your node, npm, and possible ionic/cordova - installations)

  2.) Before you can build, you have to execute './bin/prepare-build.sh'

  3.) If you want to build, you can use './bin/build.sh'
    The script requires two parameter. The first one defines the platform you want to build for (android, ios),
    the second the target (dev, prod) (Example: ./bin/build.sh android dev)


//tbd

  10.) Copy `/src/config/config.ts.dist` to `/src/config/config.ts` and fill the values.
  11.) Run "ionic build \<PLATFORM\> [--prod] [--]"

## releasing a new version

* start a new  in gitflow
* bumb version numbers in
  * `/src/config/config.ts`
  * `/src/config/config.ts.dist`
  * `/config.xml`
* finish  in gitflow




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

### todo
Add continuous integration, or at least some scripts to ease the pain.

## misc info

### Xcode config
Most of the settings are contained in the config.xml and applied by the
 cordova-custom-config plugin (deployment target, region, descriptions ...)
 when you add the platform.

Things you have to do by hand:
* Turn on: Capabilities -> Push notifications
* Set the provisioning profiles


### FB SDK
Facebook plugin is (at the moment) only used to track app installations.

> "If you need to change your APP_ID after installation, it's recommended that you remove and then re-add the plugin as above. Note that changes to the APP_ID value in your config.xml file will not be propagated to the individual platform builds."

See: https://github.com/jeduan/cordova-plugin-facebook4#installation

#### HEADS UP
If you submit a (new) iOS app version and you have the Facebook SDK included, for Christ’s sake, check the box saying “This app uses the Ad-ID (IDFA)?”
