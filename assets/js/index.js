const access_token = localStorage.getItem("access_token");
const refresh_token = localStorage.getItem("refresh_token");
const access_token_expires_at = localStorage.getItem("access_token_expires_at");
const refresh_token_expires_at = localStorage.getItem("refresh_token_expires_at");

let loggedIn = false;

function getAmsterdamTime() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
}

function accessTokenValid() {
    const expiresAtStr = localStorage.getItem("access_token_expires_at");
    const expiresAt = new Date(expiresAtStr).getTime();
    const now = getAmsterdamTime().getTime();
    return now < expiresAt;
}

function refreshTokenValid() {
    const expiresAtStr = localStorage.getItem("refresh_token_expires_at");
    const expiresAt = new Date(expiresAtStr).getTime();
    const now = getAmsterdamTime().getTime();
    return now < expiresAt;
}


function doCorrespondingAction() {
    if (accessTokenValid() && refreshTokenValid()) {
        console.log("Access token and refresh token are valid");
        loggedIn = true;
    } else if (!accessTokenValid() && refreshTokenValid() && access_token !== null && refresh_token !== null) {
        console.log("Access token is not valid, but refresh token is");

    } else {
        console.log("Access token and refresh token are not valid");
        loggedIn = false;
    }
}

doCorrespondingAction();