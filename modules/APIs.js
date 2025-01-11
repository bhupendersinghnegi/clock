// This the file from where any API's will get call if needed.
const locationApiUrl = "https://ip-api.com/json/";
const temperatureApiUrl = "https://api.open-meteo.com/v1/forecast?";

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
    const data = await apiContact(locationApiUrl);
    const { lat: latitude, lon: longitude, country, city, timezone } = data;
    return { latitude, longitude, country, city, timezone }
}

async function currentTemperature({ latitude, longitude }) {
    const query = `latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=auto&current_weather=true`;
    const data = await apiContact(temperatureApiUrl + query);

    const {
        current_weather: { temperature },
        daily: { sunrise, sunset }
    } = data;
    return { temperature, sunrise: sunrise[0], sunset: sunset[0] };
}
export { currentTemperature, getLocationHandler };

