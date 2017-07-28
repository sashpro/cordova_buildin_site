# Building in site into Android application

## Add Android platforms 
```
npm install -g cordova@6.0.0
cordova platform add android
```

## Build Android apk
```
cordova build android --release
```
It's important to sign up the apk. https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#signing-an-app
