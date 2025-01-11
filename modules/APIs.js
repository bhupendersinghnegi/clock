// This the file from where any API's will get call if needed.
const IPADDRESS = "https://api.ipify.org/?format=json";
const LOCATIONAPIURL = "https://ipapi.co/";
const TEMPERATUREAPIURL = "https://api.open-meteo.com/v1/forecast?";

async function apiContact(apiUrl) {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch location: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data === undefined) {
            throw new Error(`Return data is undefined`);
        }
        return data;

    } catch (error) {
        console.error("Error in apiContact:", error.message);
        return null;
    }
}
async function getLocationHandler() {
    try {
        const { ip } = await apiContact(IPADDRESS);
        const data = await apiContact(LOCATIONAPIURL + ip + "/json/");
        const { latitude, longitude, country_name:country, city, timezone } = data;
        return { latitude, longitude, country, city, timezone }
    } catch (error) {
        console.error("Error in apiContact:", error.message);
    }
}

async function currentTemperature({ latitude, longitude }) {
    try {
        const query = `latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=auto&current_weather=true`;
        const data = await apiContact(TEMPERATUREAPIURL + query);

        const {
            current_weather: { temperature },
            daily: { sunrise, sunset }
        } = data;
        return { temperature, sunrise: sunrise[0], sunset: sunset[0] };
    } catch (error) {
        console.error("Error in apiContact:", error.message);
    }
}
export { currentTemperature, getLocationHandler };

