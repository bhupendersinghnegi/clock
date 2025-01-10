import { currentTemperature, getLocationHandler } from "./APIs.js";
import { currentTime } from "./CommonFunctions.js";
import { pageNavigation } from "./Navigator.js";
import { startRightHandler } from "./SetUpAlarm.js";

// This is the function which will take sunrise and sunset and give the what time is it
// Sunrise || Sunset
// Based on this app ui will be changed
function sunStatusHandler({ sunrise, sunset, currentTime }) {
    const sunriseTime = +(new Date(sunrise));
    const sunsetTime = +(new Date(sunset));
    currentTime = +(new Date(sunset));
    let sun = currentTime > sunriseTime && currentTime < sunsetTime ? "Sunrise" : "Sunset";

    return {
        sun,
        status: sun == "Sunrise" ? true : false
    }
}

// Every clock has some other information(Location, Day, temperature)
async function clockInformationHandler({
    getHour, getMinute, getSecond, currentTime
}) {
    console.log(currentTime)
    const { latitude, longitude, country, city, timezone } = await getLocationHandler();
    const { temperature, sunrise, sunset } = await currentTemperature({ latitude, longitude });
    const { sun, status } = sunStatusHandler({ sunrise, sunset, currentTime })

    // Setup UI as per the sun status
    document.body.dataset.day = status


    const options = { weekday: 'long' }; // 'long' will return the full name of the weekday
    const dayName = currentTime.toLocaleDateString('en-US', options);

    console.log(getHour)
    return ` <div class="clockLocation">
                <div class="clockTemperature">${Math.round(temperature)}</div>
                <div class="location">
                    <span>${city}, ${country}</span>
                    <span>${sun} time, ${dayName}</span>
                </div>
            </div>
            <button type="button" class="btn btn-light createAlarm">Set Alarm</button>`;
}

// If the given time is undefined then just use the current time
async function getLocalTime({ hour, minute, second, tag }) {
    const containerTag = document.querySelector(tag);
    if (!containerTag) {
        throw new Error("The tag is not available in the DOM element");
    }

    // If the time is undefined, get the current time
    const getHour = hour ? hour : new Date().getHours();
    const getMinute = minute ? minute : new Date().getMinutes();
    const getSecond = second ? second : new Date().getSeconds();

    let currentTime = new Date();
    currentTime.setHours(getHour, getMinute, getSecond, 0);



    const clockInformation = await clockInformationHandler({ getHour, getMinute, getSecond, currentTime });
    const HTML = `
        <div class="clockInfoContainer">
            <div class="clockContainer">
                <div class="clockOptions">
                    <div class="clockMins timer"></div>
                    <div class="clockHours timer"></div>
                    <div class="clockSeconds timer"></div>
                    <div class="clockCenter timer"></div>
                </div>
            </div>
            ${clockInformation}           
        </div>`;

    containerTag.insertAdjacentHTML("beforeend", HTML);
    const currentTag = containerTag.querySelector("div:last-child");

    let formattedTime = "";
    const currentClock = setInterval(() => {
        // Increment the time by one second
        currentTime.setSeconds(currentTime.getSeconds() + 1);
        // Format the time as HH:MM:SS
        const getHour = currentTime.getHours().toString();
        const getMinute = currentTime.getMinutes().toString();
        const getSecond = currentTime.getSeconds().toString();
        if (getSecond == 0) { 
            startRightHandler();
        }
        formattedTime = `${getHour.padStart(2, '0')}:${getMinute.padStart(2, '0')}:${getSecond.padStart(2, '0')}`;
        createClockHandler({
            tag: currentTag,
            getHour, getMinute, getSecond, currentClock, formattedTime
        });
    }, 1000);
}

function getClockRotations({ getHour, getMinute, getSecond }) {
    // Normalize hours for 12-hour format
    const normalizedHours = getHour % 12;

    // Calculate the rotation values
    // Each second is 6(360/60) degrees
    const secondRotation = getSecond * 6;
    const minuteRotation = getMinute * 6 + getSecond * 0.1; // Each minute is 6 degrees + adjustment for seconds
    const hourRotation = normalizedHours * 30 + getMinute * 0.5; // Each hour is 30 degrees + adjustment for minutes

    return {
        secondRotation,
        minuteRotation,
        hourRotation
    };
}

// Create clock by giving time HH:MM:SS
function createClockHandler({
    getHour, getMinute, getSecond, currentClock, formattedTime, tag
}) {
    const { secondRotation, minuteRotation, hourRotation } = getClockRotations({ getHour, getMinute, getSecond });

    // Update the clock
    tag.querySelector(".clockSeconds").style.rotate = secondRotation + "deg";
    tag.querySelector(".clockHours").style.rotate = hourRotation + "deg";
    tag.querySelector(".clockMins").style.rotate = minuteRotation + "deg";
}



// This will start the first clock asper the user location
async function starterClockHandler() {
    const { hour, minute, second } = currentTime();
    // This function will create the clock on start to the process
    await getLocalTime({
        hour, minute, second,
        tag: ".clockMainContainer"
    });


    // Once the page is ready to show just go to the page
    pageNavigation();
}

export { getLocalTime, starterClockHandler };

