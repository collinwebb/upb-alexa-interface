const fs = require('fs'),
      possibleFiles = fs.readdirSync('UPBsettings/sourceFile/'),
      UPBfile = possibleFiles[0] === '.keep' ? possibleFiles[1] : possibleFiles[0];

// takes .csv or .upe lines and turns them into an array.
const createUPBobjectEntries = (csvLine) => {
  let UPBarray = csvLine.split(',');

  // in my .upe file, lines that start with '3' specify a switch and look like:
  // 3,36,1,1,1,5,53,2,1,1,16,Kitchen,Lite over micro,1
  // and may have varying numbers of entries between '3' and 'Kitchen'
  if (UPBarray[0] === '3') {
    let roomName = UPBarray[UPBarray.length - 3],
        lightName = UPBarray[UPBarray.length - 2],
        switchID = UPBarray[1];

    return ['switch', roomName, lightName, switchID];
  // lines that start with '2' specify scenes and look like:
  // 2,23,Garage Off
  } else if (UPBarray[0] === '2') {
    let sceneName = UPBarray[2],
        sceneID = UPBarray[1];

    // ignore generic scene names
    if (sceneName.substr(0, 5) === 'Scene') {
      return ['nothing'];
    }

    return ['scene', sceneName, sceneID];

  } else {
    return ['nothing'];
  }
};

// highest level function to turn .upe files into .json structured object
const processFile = (inputFile) => {
  const readline = require('readline'),
      instream = fs.createReadStream(inputFile),
      outstream = new (require('stream'))(),
      rl = readline.createInterface(instream, outstream),
      UPBdictionary = {'rooms': {}, 'scenes': {}};

  // For each line, make list and create an object from that list.
  rl.on('line', (line) => {
      let newLineList = createUPBobjectEntries(line);
      if (newLineList[0] === 'switch') {
        if (typeof(UPBdictionary.rooms[newLineList[1]]) !== 'object') {
          UPBdictionary.rooms[newLineList[1]] = {'lights':{}};
        }
        UPBdictionary.rooms[newLineList[1]].lights[newLineList[2]] = newLineList[3];
      } else if (newLineList[0] === 'scene') {
        UPBdictionary.scenes[newLineList[1]] = newLineList[2];
      }
  });

  // On Close write the file.
  rl.on('close', () => {
    // Adding some restrictions.
    // [Note: if more restrictions are needed made a js file to handle them.]
    UPBdictionary.switchOrSceneRestrictions = {
      // The switchOrSceneID is the same as the object key.
      // In this casse I needed to prevent the upb device ID 3 from being dimmed.

      // I've made a value the same as the keys to more easily return the values...
      //I don't actually know if this is a good idea, but I'm trying it.
      '3': {
        'switchOrSceneID': '3',
        'commands': {
          'activate': {'name': 'activate', 'commandNumber':20, 'allowed': true},
          'deactivate': {'name': 'deactivate', 'commandNumber':21, 'allowed': true},
          'goto': {'name': 'goto', 'commandNumber':22, 'allowed': false},
          'fadeStart': {'name': 'fadeStart', 'commandNumber':23, 'allowed': false},
          'fadeStop': {'name': 'fadeStop', 'commandNumber':24, 'allowed': false},
          'blink': {'name': 'blink', 'commandNumber':25, 'allowed': false},
          'indicate': {'name': 'indicate', 'commandNumber':26, 'allowed': false},
          'toggle': {'name': 'toggle', 'commandNumber':27, 'allowed': true},
          'reportState': {'name': 'reportState', 'commandNumber':30, 'allowed': true},
          'storeState': {'name': 'storeState', 'commandNumber':31, 'allowed': true},
          'ackResponse': {'name': 'ackResponse', 'commandNumber':80, 'allowed': true},
          'setupTimeReport': {'name': 'setupTimeReport', 'commandNumber':85, 'allowed': true},
          'deviceStateReport': {'name': 'deviceStateReport', 'commandNumber':86, 'allowed': true},
          'deviceStatusReport': {'name': 'deviceStatusReport', 'commandNumber':87, 'allowed': true},
          'registerValuesReport': {'name': 'registerValuesReport', 'commandNumber':90, 'allowed': true},
          'RAMvaluesReport': {'name': 'RAMvaluesReport', 'commandNumber':91, 'allowed': true},
          'rawDataReport': {'name': 'rawDataReport', 'commandNumber':92, 'allowed': true},
          'heartbeatReport': {'name': 'heartbeatReport', 'commandNumber':93, 'allowed': true},
          'deviceSignatureReport': {'name': 'deviceSignatureReport', 'commandNumber':143, 'allowed': true}
        }
      }
    };
    fs.writeFile("UPBsettings/settings.json", JSON.stringify(UPBdictionary), (err) => {
      if(err) {
        return console.log('error: ', err);
      }
    });
  });
};

processFile('UPBsettings/sourceFile/' + UPBfile);
