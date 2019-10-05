Installation
git clone https://github.com/chousann/ionicfirebase.git

How to run

1: cd ionicfirebase
2: npm install

浏览器预览
3: ionic serve

Running on android
4：ionic cordova prepare android
5：ionic cordova run android    ||  ionic cordova run android  -l

integrations cordova
ionic integrations enable cordova
ionic.config.json
{
  "name": "ionicfirebase",
  "integrations": {},
  "type": "angular"
}

{
  "name": "ionicfirebase",
  "integrations": {
    "cordova": {}
  },
  "type": "angular"
}