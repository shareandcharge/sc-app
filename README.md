# SC-APP

### Ionic Cordova Application for Share&amp;Charge

## Serving the app

To serve the app, run `ionic serve`
[http://localhost:8100/](http://localhost:8100/) will open in a new browser window.

<hr>

## Development Prep

### 1. Make sure you have the following applications installed and relevant paths exported:

  - homebrew
  - full xcode & xcode CLI
  - android studio, android sdk
  - java jre & sdk (Version 8)
  - cocoapods ('gem install cocoapods && pod setup')

### 2. Set up  the machine and environment to require the proper dependencies & versions by running the configuration scripts located in the `./bin directory`
  a. Run the box-setup script to ensure the right node version npm packages and ruby build tools are installed.(Be aware that it probably will destroy/change your node, npm, and possible ionic/cordova - installations) 
  ```./bin/box-setup.sh```

  b. Run the prepare-build script to download the required npm packages prepare the ionic build process. Fastlane will eventually take care of this process. 
  ```./bin/prepare-build.sh```
  
##### TODO: Implement error handling for scripts in `./bin`
All scripts under `./bin/*` have to be executed from the ROOT directory of this project. Please be aware of that the existing scripts under `./bin` are not handling any exceptions right now.

<hr>

## Development

### 1. Setup the config.ts
- ***LAZY OPTION*** Copy the [config.ts](https://github.com/motionwerkGmbH/wiki/blob/master/share_n_charge/config.ts) file into `./src/config/` ***OR***
- ***BETTER UNDERSTANDING OPTION*** From the repo root directory: `cp ./src/config/config.ts.dist ./src/config/config.ts && nano ./src/config/config.ts` Update the `API_URL` property to `'http://localhost:3412/v1'`, the `IMAGES_BASE_URL` property to `'http://localhost:3412'` and the `'API_KEY' -> 'param'` property to `'noapikey'` (from `'apikey'`).

### 2. Feature Toggles
As of 21.07.17, we are implementing several feature toggles to prepare for upcoming pilot releases.

All toggles are set in `src/config/config.ts`, and

##### show_juicebox_config

##### currency_sign_usd
For the US pilot with eMotorwerks, we are temporarily changing the currency sign to display as $ instead of €. To clarify, this is not a conversion of the currency. This will be removed at a later date but the functionality has been implemented in the `CurrencyService` to facilitate future stories where conversion and currency symbols will need to change conditionally.

Implementation of the feature toggle can be found in `wallet.ts` and `wallet.html` in `src/pages/wallet/` where the currency is set in the constructor by calling `getCurrency` and `isPaymentAvailable` on the injected CurrencyService.


##### hide_payment
Additionally for the US pilot with eMotorwerks, we are hiding the add payment option from the wallet view. Users will not be able to transfer fiat currency in or out of the app account. This will also be removed at a later date.

Implementation of the feature toggle can be found in `wallet.ts` and `wallet.html` in `src/pages/wallet/` where the `showPayment` is set in the constructor by calling `isPaymentAvailable` on the injected CurrencyService.

<hr>

## Manual Build & Deployment Process

### iOS

#### 1. To release a new version make sure to bump the versions in the config.ts and config.xml files

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

#### 2. Set up the provisioning profiles and certificates. 

##### At the moment this process requires manual configuration of the certificates and profiles. Until we are managing certs and profiles with Fastlane Match, you need to be given the matching distribution certificate and profile, as well as register a developer profile and download the corresponding certificate under the PO's Apple Developer account.

  Open the project in Xcode (output path is `/platforms/ios/ShareCharge.xcodeproj`). Make sure the the signing section under ShareCharge Targets has the following:
  1. "Automatically manage signing" checked
  2. As of 28/06/17, the team selected is 'RWE IT GmbH'
  3. The developer profile is either correctly configured or filled in as 'iPhone Developer: POs Name ({certificate_id})'
  ![](/src/assets/images/cert_management/signing_group.png)
  
  4. Make sure that under the menu 'Product > Destination', "Generic iOS Device" is selected
  ![](/src/assets/images/cert_management/push_notifications.png)


#### 3. Build the application
  
##### For deployment to TestFlight):

```
$ ionic build ios --device
```

##### To build for distribution run:

```
$ ionic build ios --prod --release
```
Note: This option is currently blocked.

##### To upload the build
  1. Go to Product > Destination and make sure that Genergic iOS Device is selected.
  ![](/src/assets/images/cert_management/build_generic.png)
  2. Go to 'Product > Archive'. In the opened window select the latest version and click "Upload to App Store...".
  ![](/src/assets/images/cert_management/archive_build.png)
  3. Upon success, you should be able to upload the most recent build. If the version numbers are duplicated it will throw ann error before deploying to iTunes Connect. 
  ![](/src/assets/images/cert_management/archive_upload.png)

You should then be able to log into iTunes Connect with the PO's credentials.

### Android

Currently, the manual process we are phasing out is as follows:

1. Build the unsigned APK by running `$ ionic build android --prod --release`
2. Change directories to the APK output path `$ cd <TO_APK_OUTPUT_PATH> ` or `platforms/android/build/outputs/apk`
3. Make sure you have obtained the keystore as well as the passwords to unlock the key and sign the apk (key and keystore respectively)
`$ jarsigner -verbose -tsa http://timestamp.digicert.com -sigalg SHA1withRSA -digestalg SHA1 -keystore <PATH_TO_KEYSTORE>/share-and-charge.keystore android--unsigned.apk share_and_charge
//share_and_charge is the alias the keystore`
4. Run zipalign
`$ zipalign -v 4 android--unsigned.apk ShareAndCharge-<VERSION_NUMBER>.apk`
5. Log into the google play dev console to 

NOTE: The following command includes the absolute paths for the project and keystores with the new fastlane integration
`
jarsigner -verbose -tsa http://timestamp.digicert.com  -sigalg SHA1withRSA -digestalg SHA1 -keystore ./fastlane/release-cred/share-and-charge.keystore ./platforms/android/build/outputs/apk/android--unsigned.apk share_and_charge
`

double-check that apk is not debuggable:

`$ aapt dump xmltree android--unsigned.apk AndroidManifest.xml | grep debug`
should be empty or false.

If you don't have the keystore and/or passwords, ask Felix Magdeburg <felix.magdeburg@innogy.com>.

<hr>

### FB SDK
Facebook plugin is (at the moment) only used to track app installations.

> "If you need to change your APP_ID after installation, it's recommended that you remove and then re-add the plugin as above. Note that changes to the APP_ID value in your config.xml file will not be propagated to the individual platform builds."

See: https://github.com/jeduan/cordova-plugin-facebook4#installation

#### Facebook SDK Configuration
If you submit a (new) iOS app version and you have the Facebook SDK included, please check the box saying “This app uses the Ad-ID (IDFA)?”

<hr>

## Automatic Deployment

### iOS
##### Given the default_platform is set to ios in the Fastfile...

#### To submit a new Beta Build to Apple Testflight, execute the following: ```fastlane beta```

#### To deploy a new version to the App Store, execute the following: ```fastlane deploy```


### Android
##### Given the default_platform is set to android in the Fastfile...

### To deploy an Alpha Build of the application to Google Play, execute the following: ```fastlane alpha```

##### Take note, fastlane alpha runs several gradle and android apk build tasks which require that properly configured paths are set for ANDROID_HOME, and zipalign (android sdk build-tool).
