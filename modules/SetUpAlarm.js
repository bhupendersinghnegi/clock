// This is the  file where all the setAlarm function will live.
import { currentTime, secondsToHHMMSS, toggleClassHandler } from "./CommonFunctions.js";
import { allClockJSON } from "./Container.js";

// Strat the ringtone to the user interface
function ringtoneHanlder({ alarmTime, ringtoneName }) {
    // This function will start and stop the ringtone
    const bodyTag = document.body;
    bodyTag.insertAdjacentHTML("beforeend",
        `<audio class="alarmAudio" controls autoplay loop>
                <source src="${ringtoneName}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>`);
    setTimeout(() => {
        document.querySelector(".alarmAudio")?.remove();
    }, alarmTime * 1000);
}

// This function will get check in every minute and start's the ringtone if it's the time
function startRightHandler() {

    const { hour, minute, amOrPm } = currentTime();

    const { ALARMS } = allClockJSON;
    const alarmID = amOrPm + hour + minute;//[AM||PM:HH:MM:]  
    const isAlarm = ALARMS.hasOwnProperty(alarmID);
    if (isAlarm) {
        const { alarmTime, ringtoneName, alarmOn } = ALARMS[alarmID];
        alarmOn && ringtoneHanlder({ alarmTime, ringtoneName });
    }

    return isAlarm;
}
// This function will give the information about how much time is left for alarm
function timeLeftHandler({ alarmDetails }) {
    const { hour, minute, timeStatus } = alarmDetails;
    const { hour: currentHour, minute: currentMinute, second: currentSecond, amOrPm } = currentTime();

    let setCurrentHour = amOrPm == "PM" ? (+currentHour) + 12 : currentHour;
    let setAlarmHour = timeStatus == "PM" ? (+hour) + 12 : hour;
    const currentTimer = new Date().setHours(setCurrentHour, currentMinute, currentSecond);
    const alarmTimer = new Date().setHours(setAlarmHour, minute, 0);

    const totalSeconds = Math.floor(Math.abs(currentTimer - alarmTimer) / 1000); // Time difference in seconds between current time and alarm time
    const { setHours, setMints, setSeconds } = secondsToHHMMSS({ totalSeconds })
    // Different between hours and minutes
    let outputString = "";
    let differenceHour = "";
    if (amOrPm === timeStatus) {
        differenceHour = currentTimer > alarmTimer ? 24 - (+setHours) : setHours;
    } else {
        differenceHour = currentTimer < alarmTimer ? 24 - (+setHours) : setHours;
    }

    // Check hours and minutes
    if (differenceHour > 0 || setMints > 0) {
        outputString += ` |`
    }
    if (differenceHour > 0) {
        outputString += ` ${differenceHour} hour`;
    }
    if (setMints > 0) {
        outputString += ` ${setMints} minute`;
    }

    // Return the final string with time left for the alarm
    return outputString;
}

// This function will setup the DOM for the alarm
function addAlarmHandler({ ALARMS }) {
    return Object.entries(ALARMS).map(([keys, values]) => {
        const { alarmOn, alarmType, timeStatus, hour, minute } = values;
        const setHour = hour.toString().padStart(2, '0');
        const setMinute = minute.toString().padStart(2, '0');
        const timeLeft = timeLeftHandler({ alarmDetails: values });
        // const alarmDetails = `${alarmType} | Alarm in 12 hours 13 mins`;
        const alarmDetails = `${alarmType} ${timeLeft}`;
        return `<div class="setAlarm ${alarmOn ? "activeTimer" : ""}" data-alarm="${keys}">
            <div class="alarmTimer">
                <div>
                    <span class="setTime">${setHour}:${setMinute}</span><span class="timeInfo">${timeStatus}</span>
                </div>
                <span>
                    <img src="./images/delete-alarm.svg" width="16" height="16" class="deleteAlarm" alt="delete alarm">
                    <p>${alarmDetails}</p>
                </span>
            </div>
            <div class="alarmOnOff">
                <input type="checkbox" name="${keys}" ${alarmOn ? "checked" : ""} class="alarmOnOff" id="${keys}">
                <label for="${keys}"></label>
            </div>
        </div>`;
    }).join('');
}

// This function will setup the alarm landing section look and feel
function loadAlarms({ sidebar, containerTag }) {
    // Empty the container for new setups.
    const allContainerTags = containerTag.querySelectorAll("*");
    Array.from(allContainerTags).forEach(tag => tag.remove());

    const ALARMS = allClockJSON["ALARMS"];
    const isAlarmEmpty = Object.keys(ALARMS).length;
    let alarmsContent = `<img src="./images/add-alarm.png" width="60" height="60" alt="add alarm">
                        <h2>ADD ALARM</h2>
                       <p>Set your alarm easily by selecting the desired time and customizing it with optional labels or tones. Stay organized and never miss an important moment!</p>`;
    if (isAlarmEmpty) {
        alarmsContent = addAlarmHandler({ ALARMS });
    }
    // If there are no alarms, then display a message. Else display the alarms.
    const HTML = `<h2>Alarm</h2>
                    <div class="alarmContainer ${isAlarmEmpty == 0 ? "emptyAlarm" : ""}">
                        ${alarmsContent}
                    </div>

                    <div class="addAlarm">
                        <img src="./images/plus.svg" width="16" height="16" alt="add alarm">
                    </div>`;
    containerTag.insertAdjacentHTML("beforeend", HTML);

    // Open the sidebar
    toggleClassHandler({ action: true, element: sidebar, className: "activeSlider" });
}

// This function will handle the alarm setup
function setUpAlarmHandler({ containerTag }) {

    const { hour, minute, amOrPm } = currentTime();
    // Implement the logic to delete the alarm with the given id.
    const HTML = `<div class="addAlarmModal sideSlider activeSlider">
                        <button type="button" class="sliderClose none-btn">
                            <img src="./images/close.svg" width="24" height="24" alt="close btn">
                        </button>
                        <h2>Add Alarm</h2>
                        <div class="AlarmModalBody">
                            <div>
                                <select class="timeState">
                                    <option value="AM" ${amOrPm === "AM" ? "selected" : ""}>AM</option>
                                    <option value="PM" ${amOrPm === "PM" ? "selected" : ""}>PM</option>
                                </select>
                                <input type="text" class="setHour" value="${hour}" data-type="tel" data-limit="2" maxlength="2" inputmode="tel">
                                <input type="text" class="setMints" value="${minute}" data-type="tel" data-limit="2"  maxlength="2"  inputmode="tel">
                            </div>
                            <button type="button" class="btn btn-dark setUpAlarm">Done</button>
                        </div>
                    </div>`;
    containerTag.insertAdjacentHTML("beforeend", HTML);
}

// This function will create an alarm with the provided settings
// and add it to the alarm list.
function createAlarmsHandler() {
}

export { createAlarmsHandler, loadAlarms, setUpAlarmHandler, ringtoneHanlder, startRightHandler };

