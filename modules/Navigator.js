// This file will disable what to do(When an event is fired) or what to do show the user as per the url

import { errorModal, getURLQuery, urlWriting, validateInputHandler } from "./CommonFunctions.js";
import { allClockJSON, allClockJSONHandler } from "./Container.js";
import { loadAlarms, setUpAlarmHandler } from "./SetUpAlarm.js";

// THis function will handle all the events on this application
const sideSliderContainer = document.querySelector(".sideSliderContainer");
const sideSlider = document.querySelector(".sideSlider");
function navigator() {
    document.addEventListener("click", (Event) => {
        const targetElement = Event.target;

        // Side bar close button
        if (targetElement.closest(".addAlarm")) {
            const containerTag = targetElement.closest(".sideSliderContainer");
            setUpAlarmHandler({ containerTag })
        }
        if (targetElement.closest(".createAlarm")) {
            // Set up the UI of set alarm section
            loadAlarms({ sidebar: sideSlider, containerTag: sideSliderContainer });
        }
        if (targetElement.closest(".setUpAlarm")) {
            const addAlarmModal = targetElement.closest(".addAlarmModal");
            const hour = addAlarmModal.querySelector(".setHour").value;
            const minute = addAlarmModal.querySelector(".setMints").value;
            const timeStatus = addAlarmModal.querySelector(".timeState").value;
            if (!hour || !minute || !timeStatus) {
                errorModal({ value: "Alarm inputs filled can't be empty" });
                return null;
            }

            const clockID = timeStatus + hour + minute; //[AM||PM:HH:MM:]
            const clockJSON = {
                [clockID]: {
                    hour, minute, timeStatus,
                    alarmOn: true,
                    alarmTime: 10, // How much time it will right
                    alarmType: "Weekly",
                    alarmDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    ringtoneName: "./ringtone/alarm.mp3"
                }
            };
            const operation = "insert";
            const type = "ALARMS";
            allClockJSONHandler({ operation, type, clockJSON })
            loadAlarms({ sidebar: sideSlider, containerTag: sideSliderContainer });
        }

        if (targetElement.closest(".deleteAlarm")) {
            const operation = "delete";
            const type = "ALARMS";
            const alarmID = targetElement.closest(".setAlarm").dataset.alarm;
            allClockJSONHandler({ operation, type, alarmID })
            loadAlarms({ sidebar: sideSlider, containerTag: sideSliderContainer });
        }
        if (targetElement.closest(".sliderClose")) {
            const sideSlider = targetElement.closest(".sideSlider");
            sideSlider.classList?.remove("activeSlider");
        }

        if (targetElement.closest(".navPage")) {
            const page = +targetElement.dataset.page;
            if (page === 1) {
                urlWriting(``);
                pageNavigation(targetElement);
            } else if (page === 2) {
                urlWriting(`?world-clock`);
                pageNavigation(targetElement);
            } else if (page === 3) {
                urlWriting(`?timer`);
                pageNavigation(targetElement);
            }
        }
    })

    document.addEventListener("input", (Event) => {
        const targetElement = Event.target;
        validateInputHandler({ element: targetElement });
        if (targetElement.closest(".alarmOnOff")) {
            const alarmID = targetElement.closest(".setAlarm").dataset.alarm;
            const updatedValue = targetElement.closest(".alarmOnOff").checked;
            const type = "ALARMS";
            const jsonDump = JSON.parse(JSON.stringify(allClockJSON[type][alarmID]));
            const clockJSON = {
                ...jsonDump,
                alarmOn: updatedValue
            };
            const operation = "update";
            // allClockJSON[type][alarmID] = clockJSON;
            allClockJSONHandler({
                operation, type, clockJSON, alarmID,
            })
        }
    })
}
// This function will check the url if the url keys are not that we need then it will remove the query from the url
function URLHandler() {
    // Get info from the url and setup the display container
    const URLSetup = getURLQuery();
    if (Object.keys(URLSetup).length !== 1) {
        urlWriting(``);
        return null;
    }
    const urlKeys = {
        "world-clock": true, // This is the world clock page 
        "timer": true,       // This is page where timer functionality is working
    }
    Object.entries(URLSetup).forEach(([key, value]) => {
        if (!urlKeys[key]) {
            urlWriting(``);
        }
    });
}

// This the function that will set the page as per the need
// RIght now this application has 3 pages
function pageNavigation(target) {
    // If the url is not what the program expects then just reset it
    URLHandler();
    // Get info from the url and setup the display container
    const URLSetup = getURLQuery();
    // Using this we will change the page navigation
    let toGoPage = 1;
    if (Object.keys(URLSetup).length === 1) {
        if (URLSetup.hasOwnProperty("world-clock")) {
            toGoPage = 2;
        } else if (URLSetup.hasOwnProperty("timer")) {
            toGoPage = 3;
        }
    }
    // Reset the page navigation
    document.querySelector(".activePage")?.classList.remove("activePage");
    document.querySelector(".spinnerContainer")?.classList.remove("activeLoader");
    document.querySelector(`section[data-page="${toGoPage}"]`).classList.add("activePage");
    // Nav update
    document.querySelector(".navPage.activePage")?.classList.remove("activePage");
    document.querySelector(`.navPage[data-page="${toGoPage}"]`).classList.add("activePage");
}
export { navigator, pageNavigation };

