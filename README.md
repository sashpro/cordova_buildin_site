# Building in site into Android application

## Add Android platforms 
```
npm install -g cordova@6.0.0
cordova platform add android
```
## Plugins 
```
cordova-plugin-certificates 0.6.4 "Certificate Plugin"
cordova-plugin-inappbrowser 1.7.1 "InAppBrowser"
cordova-plugin-whitelist 1.3.2 "Whitelist"
```

## Build Android apk
```
cordova build android --release
```
It's important to sign up the apk. https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#signing-an-app
