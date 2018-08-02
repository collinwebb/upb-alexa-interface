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
    fs.writeFile("UPBsettings/settings.json", JSON.stringify(UPBdictionary), (err) => {
      if(err) {
        return console.log('error: ', err);
      }
    });
  });
};

processFile('UPBsettings/sourceFile/' + UPBfile);
