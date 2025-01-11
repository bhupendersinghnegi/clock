// This the file from where all the js function will start executing.

import { starterClockHandler } from "./ClockOperations.js";
import { navigator } from "./Navigator.js";


// This will store the all the clock info in the local
const clockSession = "localClockSession";
// This the data format for "clockSession"
/*
    WORLDCLOCKS:{
        id:{
            id: unique id for each clock,
            hour: 10,
            minute: 30,
            second: 45,
            formattedTime: "10:30:45",
            tag: "body" // Selector for tag parsing,
            contrary: "india",

            // If it's a local time then only this will work
            localTime: true || false
        }
    },
    ALARMS: {
        [AM||PM:HH:MM:]:{
            hour: 10,
            minute: 30,
            timeStatus: "AM" || "PM",
            alarmOn: true || false,
            alarmTime: 5, // How much time it will right
            alarmType: "daily" || "weekly" || "monthly",
            alarmDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] || [],
            ringtoneName:"mp3 file path"
        }
    },
    TIMER:{
        timerOn: true || false,
        timerInSeconds: 10,
        timerStatus: "start" || "pause" || "stop"
    }
*/
// THis is the json object that will contain all the information about the application
let allClockJSON = {
    WORLDCLOCKS: {},
    ALARMS: {},
    TIMER: {}
};
function allClockJSONHandler({
    operation, type, clockJSON, alarmID
}) {
    if (operation === "insert") {
        allClockJSON[type] = {
            ...allClockJSON[type],
            ...clockJSON
        }
    } else if (operation === "delete") {
        delete allClockJSON[type][alarmID];
    } else if (operation === "update") {
        allClockJSON[type][alarmID] = clockJSON;
    }
    localStorage.setItem(clockSession, JSON.stringify(allClockJSON));
}

// When start the app just check if the localStorage has clockSession
if (localStorage.getItem(clockSession)) {
    allClockJSON = JSON.parse(localStorage.getItem(clockSession));
}

// This will start the first clock asper the user location
starterClockHandler();

// THis function will handle all the events on this application
navigator();


export { allClockJSON, allClockJSONHandler };

