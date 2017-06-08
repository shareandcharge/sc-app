# sc-app
native-app for share&amp;charge

## installation/building

Make sure you have a full-installation of xcode, as well as android studio, the android sdk as well as java jre and sdk.
It is also required to have cocoapods installed and set up (sudo gem install cocoapods && pod setup)

  1.) brew install node@6
  2.) brew link node@6 --force
  3.) npm install -g npm@latest-3
  4.) npm install -g ionic@2 cordova@6
  5.) npm install -g ios-deploy
  6.) npm install -g ios-sim
  7.) npm install
  8.) ionic build
  9.) ionic state restore
  10.) Copy `/src/config/config.ts.dist` to `/src/config/config.ts` and fill the values.
  11.) Run "ionic build \<PLATFORM\> [--prod] [--release]"

## releasing a new version

* start a new release in gitflow
* bumb version numbers in
  * `/src/config/config.ts`
  * `/src/config/config.ts.dist`
  * `/config.xml`
* finish release in gitflow

### iOS
```
$ ionic build ios --prod --release
```

Open in Xcode. If you added/removed ios since the last build (or if you want to be super sure), check capabilities (push notifications).

Goto "Product > Archive". In the opened window select the latest version and push "Upload to App Store...".

### Android
```
$ ionic build android --prod --release
$ cd <TO_APK_OUTPUT_PATH>
$ jarsigner -verbose -tsa http://timestamp.digicert.com -sigalg SHA1withRSA -digestalg SHA1 -keystore <PATH_TO_KEYSTORE>/share-and-charge.keystore android-release-unsigned.apk share_and_charge
$ zipalign -v 4 android-release-unsigned.apk ShareAndCharge-<VERSION_NUMBER>.apk
```
double-check that apk is not debuggable:
```
$ aapt dump xmltree android-release-unsigned.apk AndroidManifest.xml | grep debug
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
