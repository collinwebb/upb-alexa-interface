let fs = require('fs'),
    possibleFiles = fs.readdirSync('UPBsettings/sourceFile/'),
    UPBfile = possibleFiles[0] === '.keep' ? possibleFiles[1] : possibleFiles[0];

let createUPBobjectEntries = (csvLine) => {
  let UPBarray = csvLine.split(',');

  if (UPBarray[0] === '3') {
    let roomName = UPBarray[UPBarray.length - 3],
        lightName = UPBarray[UPBarray.length - 2],
        switchID = UPBarray[1];

    return ['room', roomName, lightName, switchID];

  } else if (UPBarray[0] === '2') {
    let scene = UPBarray[2],
        sceneID = UPBarray[1];

    return ['scene', scene, sceneID];

  } else {
    return ['nothing'];
  }
};

let processFile = (inputFile) => {
  let readline = require('readline'),
      instream = fs.createReadStream(inputFile),
      outstream = new (require('stream'))(),
      rl = readline.createInterface(instream, outstream),
      UPBdictionary = {'rooms': {}, 'scenes': {}};

  rl.on('line', function (line) {
      newLineList = createUPBobjectEntries(line);
      if (newLineList[0] === 'room') {
        if (typeof(UPBdictionary.rooms[newLineList[1]]) !== 'object') {
          UPBdictionary.rooms[newLineList[1]] = {'lights':{}};
        }
        UPBdictionary.rooms[newLineList[1]].lights[newLineList[2]] = newLineList[3];
      } else if (newLineList[0] === 'scene') {
        UPBdictionary.scenes[newLineList[1]] = newLineList[2];
      }
  });

  rl.on('close', function(){
    fs.writeFile("UPBsettings/settings.json", JSON.stringify(UPBdictionary), function(err) {
      if(err) {
        return console.log('error!!');
      }
    });
  });
};

processFile('UPBsettings/sourceFile/' + UPBfile);
