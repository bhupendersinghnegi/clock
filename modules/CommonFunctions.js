// This file will hold all the function that can be use globally throughout the application

// This function will show errors to the user
function errorModal({ value = "Something went wrong..." }) {
    const errorModal = document.querySelector(".errorModal");
    if (!errorModal) {
        console.error("Error modal is not available");
        return;
    }
    errorModal.querySelector('.textFiled').textContent = value;
    errorModal.classList.add("activeErrorModal");
    setInterval(() => {
        errorModal.classList.remove("activeErrorModal");
    }, 1000);
}

// Get the url after ? mark 
function getURLQuery() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
}
// This url is used to track of the last url user have visited
// If user have not visited any page goToHomePage function will send user to home page 
function urlWriting(URL) {
    const updateURL = URL.toLocaleLowerCase().replace(/\s+/g, " ").replaceAll(" ", "-").replace(/-+/g, '-');
    const setNewUrl = window.location.href.split('?')[0] + `${updateURL}`;
    window.history.pushState({ path: setNewUrl }, '', setNewUrl);
}

// This function is for getting the current time
function currentTime() {
    const currentTime = new Date();
    let hour = currentTime.getHours();
    const amOrPm = hour >= 12 ? 'PM' : 'AM';
    const minute = currentTime.getMinutes();
    const second = currentTime.getSeconds();
    hour = hour % 12 || 12;  // Adjust hours to 12-hour format
    return {
        hour, minute, second, amOrPm
    }
}

// This function is use to setup not allow user to inputs values that are not allowed for that input type
function validateInputHandler({ element }) {
    if (!element) {
        console.error("Please check you selected tag: " + element);
        return false;
    }
    const value = element.value;
    const inputType = element.dataset.type;
    if (inputType == "tel") {
        const regex = /^[0-9]*$/;
        if (!regex.test(value)) {
            // Replace any non-digit characters
            element.value = value.replace(/[^0-9]/g, '');
        }
    } 
}

// This function will add or remove the classes that are given
function toggleClassHandler({ action, element, className }) {
    if (!element) {
        console.error("Please check you selected tag: " + element);
        return false;
    }
    if (action) {
        element.classList.add(className);
    } else {
        element.classList?.remove(className);
    }
}


export { currentTime, errorModal, getURLQuery, toggleClassHandler, urlWriting, validateInputHandler };

