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

<hr></hr>
## Development

### Setup the config.ts
- ***LAZY OPTION*** Copy the [config.ts](https://github.com/motionwerkGmbH/wiki/blob/master/share_n_charge/config.ts) file into `./src/config/` ***OR***
- ***BETTER UNDERSTANDING OPTION*** From the repo root directory: `cp ./src/config/config.ts.dist ./src/config/config.ts && nano ./src/config/config.ts` Update the `API_URL` property to `'http://localhost:3412/v1'`, the `IMAGES_BASE_URL` property to `'http://localhost:3412'` and the `'API_KEY' -> 'param'` property to `'noapikey'` (from `'apikey'`).

### Serving the app

To make sure the correct packages and dependencies installed, consider running `ionic build ios --dev` before serving the application.

To serve the app, run 'ionic serve'
[http://localhost:8100/](http://localhost:8100/) will open in a new browser window.

### Feature Toggles
As of 21.07.17, we are implementing several feature toggles to prepare for upcoming pilot releases.

All toggles are set in `src/config/config.ts`, and

##### show_juicebox_config

##### currency_sign_usd
For the US pilot with eMotorwerks, we are temporarily changing the currency sign to display as $ instead of €. To clarify, this is not a conversion of the currency. This will be removed at a later date but the functionality has been implemented in the `CurrencyService` to facilitate future stories where conversion and currency symbols will need to change conditionally.

Implementation of the feature toggle can be found in `wallet.ts` and `wallet.html` in `src/pages/wallet/` where the currency is set in the constructor by calling `getCurrency` and `isPaymentAvailable` on the injected CurrencyService.


##### hide_payment
Additionally for the US pilot with eMotorwerks, we are hiding the add payment option from the wallet view. Users will not be able to transfer fiat currency in or out of the app account. This will also be removed at a later date.

Implementation of the feature toggle can be found in `wallet.ts` and `wallet.html` in `src/pages/wallet/` where the `showPayment` is set in the constructor by calling `isPaymentAvailable` on the injected CurrencyService.

<hr></hr>

## Manual Build & Deployment Process

### iOS

### To release a new version

* Bumb version numbers in
  * `/src/config/config.ts`
  * `/src/config/config.ts.dist`
  ```javascript
  export let CONFIG = {
      APP_VERSION: '{BUMPED_VERSION_NUMBER}',
      ...
  }
  ```
  * `/config.xml`
  ```xml
  <widget id="com.shareandcharge.app" version="{BUMPED_VERSION_NUMBER}" xmlns="...">
  ```

#### Before :
  Open in Xcode. Make sure the the signing section under ShareCharge Targets has the following:
  1. "Automatically manage signing" checked
  2. As of 28/06/17, the team selected is 'RWE IT GmbH'
  3. The developer profile is either correctly configured or filled in as 'iPhone Developer: POs Name ({certificate_id})'
  4. Make sure that under the menu 'Product > Destination', "Generic iOS Device" is selected


#### To build for testing (deployment to TestFlight):

At the moment this process requires manual configuration of the certificates and profiles. Until we are managing certs and profiles with Fastlane Match, you need to be given the matching distribution certificate and profile, as well as register a developer profile and download the corresponding certificate under the PO's Apple Developer account.

```
$ ionic build ios --device
```

#### To build for distribution run:

```
$ ionic build ios --prod --release
```
Note: This option is currently blocked.

#### To upload the build
Go to 'Product > Archive'. In the opened window select the latest version and click "Upload to App Store...".

You should then be able to log into iTunes Connect with the PO's credentials.

### Android

Currently, the manual process we are phasing out is as follows:
```
$ ionic build android --prod --release
$ cd <TO_APK_OUTPUT_PATH>
//platforms/android/
$ jarsigner -verbose -tsa http://timestamp.digicert.com -sigalg SHA1withRSA -digestalg SHA1 -keystore <PATH_TO_KEYSTORE>/share-and-charge.keystore android--unsigned.apk share_and_charge
//share_and_charge may be the key for the keystore

$ zipalign -v 4 android--unsigned.apk ShareAndCharge-<VERSION_NUMBER>.apk
```

The following command includes the absolute paths for the project and keystores with the new fastlane integration
```
jarsigner -verbose -tsa http://timestamp.digicert.com  -sigalg SHA1withRSA -digestalg SHA1 -keystore ./fastlane/release-cred/share-and-charge.keystore ./platforms/android/build/outputs/apk/android--unsigned.apk share_and_charge
```

double-check that apk is not debuggable:
```
$ aapt dump xmltree android--unsigned.apk AndroidManifest.xml | grep debug
```
should be empty or `false`.

If you don't have the keystore and/or passwords, ask Felix Magdeburg <felix.magdeburg@innogy.com>.



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

## TO-DO: Automated Build & Deployment Process

Fastlane is being used to automate builds to iTunes Connect (Testflight) and to the Google Play store. Fastlane can be configured to run build/deploy commands defined in "lanes" for each platform.


### iOS
##### Given the default_platform is set to ios in the Fastfile...

#### To submit a new Beta Build to Apple Testflight, execute the following: ```fastlane beta```

#### To deploy a new version to the App Store, execute the following: ```fastlane deploy```


### Android
##### Given the default_platform is set to android in the Fastfile...

### To deploy an Alpha Build of the application to Google Play, execute the following: ```fastlane alpha```

##### Take note, fastlane alpha runs several gradle and android apk build tasks which require that properly configured paths are set for ANDROID_HOME, and zipalign (android sdk build-tool).
