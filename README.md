# sc-app
native-app for share&amp;charge


Xcode config
============
Most of the settings are contained in the config.xml and applied by the
 cordova-custom-config plugin (deployment target, region, descriptions ...)
 when you add the platform.
 
Things you have to do by hand:
* Turn on: Capabilities -> Push notifications
* Set the provisioning profiles


FB SDK
======
Facebook plugin is (at the moment) only used to track app installations.

> "If you need to change your APP_ID after installation, it's recommended that you remove and then re-add the plugin as above. Note that changes to the APP_ID value in your config.xml file will not be propagated to the individual platform builds."

See: https://github.com/jeduan/cordova-plugin-facebook4#installation