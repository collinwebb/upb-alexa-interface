// Note: throught this document switches and scenes can often be intermixed
// a swichID and a sceneID correspond to the same thing in the UPB hex code.

const fs = require('fs');
const upb = require('upb');
const house = require ('./UPBsettings/settings.json');

const nonDimmableCommands = {
  20: {'name': 'activate', 'allowed': true},
  21: {'name': 'deactivate', 'allowed': true},
  22: {'name': 'goto', 'allowed': false},
  23: {'name': 'fadeStart', 'allowed': false},
  24: {'name': 'fadeStop', 'allowed': false},
  25: {'name': 'blink', 'allowed': false},
  26: {'name': 'indicate', 'allowed': false},
  27: {'name': 'toggle', 'allowed': true},
  30: {'name': 'reportState', 'allowed': true},
  31: {'name': 'storeState', 'allowed': true},
  80: {'name': 'ackResponse', 'allowed': true},
  85: {'name': 'setupTimeReport', 'allowed': true},
  86: {'name': 'deviceStateReport', 'allowed': true},
  87: {'name': 'deviceStatusReport', 'allowed': true},
  90: {'name': 'registerValuesReport', 'allowed': true},
  91: {'name': 'RAMvaluesReport', 'allowed': true},
  92: {'name': 'rawDataReport', 'allowed': true},
  93: {'name': 'heartbeatReport', 'allowed': true},
  143: {'name': 'deviceSignatureReport', 'allowed': true}
};

// make function protect any switches that may be sensative to certain commands.
// a temporary form of this is in the beginning of turnSwitchOn as an experiment.

// make buildUPBcommand to take settings.json and turn them into commands.

// temporarily making an On version of the more general build command
const turnSwitchOn = (room, light) => {
  const switchID = house.rooms[room].lights[light];
  const commandID = 20;

  const switchIsNonDimmable = house.switchOrSceneRestrictions.nonDimmable[switchID];
  const commandIsNonDimming = !nonDimmableCommands[commandID].allowed;

  // console.log(!!switchIsNonDimmable, commandIsNonDimming);

  if (switchIsNonDimmable && commandIsNonDimming) {
    throw 'error: trying to dim non-dimmable switch';
  }

  upb.generate({
    network: 1, 				// Required - Set Network ID. Use 0 for the global network (controls all devices)
    id: switchID,					// Required - Set link or device ID
    type: "device",			// Required - Set whether to control a link or device
    source: 255,				// Optional - Set PIM source ID. Defaults to 255, which is almost always fine.
    cmd: 20,				// Required - Set the command to send. You may also use the command numbers associated with those commands.
    // level: 100,				// Optional - Set the level (percent). Accepts values 0 through 100. Required with goto and fade start. Only applies to goto, fadeStart, fadeStop, and toggle. Otherwise this will be ignored.
    // rate: 1,					// Optional - Set the fade rate (seconds). Use false for instant on. Only applies to goto, fadeStart, and toggle. Otherwise  this will be ignored. Defaults to device settings.
    sendx: 2,					// Optional - Set the number of times to send the command. Accepts numbers 1 through 4. Defaults to 1.
    sendTime: 1,				// Optional - Send the number of time this command is sent out of the total (sendx). NOTE: THE PIM WILL AUTOMATICALLY SEND THE CORRECT NUMBER OF COMMANDS! So, this is only useful for displaying commands and not sending them. Accepts numbers 1 through 4. Cannot be greater than sendx. Defaults to 1.
    ackPulse: false,			// Optional - Request an acknowledge pulse. Defaults to false.
    idPulse: false, 			// Optional - Request an ID pulse. Defaults to false.
    ackMsg: true
  }).then(function(newCommand) {
    console.log(newCommand.generated);
  }, function(err) {
    throw err;
  });
};

turnSwitchOn('Kitchen', 'Over Sink Light');
