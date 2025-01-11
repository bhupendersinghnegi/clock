// This page will sport all the functionality that are needed for the timer page

import { errorModal, secondsToHHMMSS } from "./CommonFunctions.js";
import { ringtoneHanlder } from "./SetUpAlarm.js";

let isTimer;// This variable will hold the setInterval for the timer
let timerPaused = false;
// Here you will initialize the timer
function initTimer({ timerPage }) {
    const isInputs = timerPage.querySelectorAll('input');
    // Check if there is a time setup
    const isTimeSetup = Array.from(isInputs).filter(tag => {
        if (!tag.value || tag.value === "00") {
            return false;
        }
        return true;
    });
    if (isTimeSetup.length === 0) {
        errorModal({ value: "Please set a timer first" });
        return null;
    }
    // The value ready to start working on the timer
    timerPage.dataset.play = false;
    const hour = timerPage.querySelector(".setHour");
    const mints = timerPage.querySelector(".setMints");
    const seconds = timerPage.querySelector(".setSeconds");

    const setHour = +hour.value * 60 * 60;
    const setMints = +mints.value * 60;
    const setSeconds = +seconds.value;
    let totalSeconds = (setHour + setMints + setSeconds);


    timerPaused = false;
    isTimer = setInterval(() => {
        if (totalSeconds <= 0) {
            hour.value = "00";
            mints.value = "00";
            seconds.value = "00";
            timerPage.dataset.play = true;
            clearInterval(isTimer);
            ringtoneHanlder({ alarmTime:10, ringtoneName:"./ringtone/soft.mp3" });
            return null; // Break the loop of timer
        }
        // Reset timer every second
        const {
            setHours, setMints, setSeconds
        } = secondsToHHMMSS({ totalSeconds })
        hour.value = setHours;
        mints.value = setMints;
        seconds.value = setSeconds; 
        if (!timerPaused) {
            totalSeconds--;
        }
    }, 1000);
}

// Pause || Stop the timer
function TimerHandler({ timerPage, runningTimer }) {
    timerPage.dataset.play = true;
    timerPaused = true;
    if (runningTimer) { return false; }
    clearInterval(isTimer);
    const isInputs = timerPage.querySelectorAll('input');
    Array.from(isInputs).forEach(tag => {
        tag.value = "00";
    });
}
export { initTimer, TimerHandler }