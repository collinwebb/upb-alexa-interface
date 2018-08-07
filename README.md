# UPB Alexa Interface


## capturing UPB settings

### get settings

First I would go to whatever program you first set up your smart system with and edit all the names to be simple human readable and speakable phrases. What you have named your lights will (soon) be what Alexa looks for when you ask her to turn a light/scene off or on.

### run command

The first thing I've built takes a .csv or .upe UPB settings file and turn it into a .json file that will be easy to load into my javascript code.

You can run `node captureUPBsettings.js` to turn any file in the upb-alexa-interface/UPBsettings/sourceFile/ folder into a file called upb-alexa-interface/UPBsettings/settings.json

The file it is built to work with looks like:
```
2,21,Man Cave Bath Off
2,22,Laundry Room Off
2,23,Garage Off
2,24,Laundry Room Walkway on
2,25,Laundry Room Walkway off
10,,,,,,,,,,,
11,,,,,,,,,,,
3,36,1,1,1,5,53,2,1,1,16,Kitchen,Lite over micro,1
12,0,14,00,ff,0d,00,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff
12,16,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff
12,32,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff,ff
```
All lines with a scene have 3 entries: the number 2, the hex id of the scene, and a pronounceable name.
All lines associated with a room have more than 3 entries: the first is the number 3, the second is the hex id for the switch/light, the third from the last is the room name, and the second from the last is switch/light name.

I have also temprorarily hard coded switchID 3 as non-dimmable. I will make this more flexible at some point. Edit as needed to work with your own selection of dimmable and non-dimmable switches.
