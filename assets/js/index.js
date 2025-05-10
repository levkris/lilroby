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
        loggedIn = true;
        getProfile();
    } else if (!accessTokenValid() && refreshTokenValid() && access_token !== null && refresh_token !== null) {
        console.log("Access token is not valid, but refresh token is");

    } else {
        loggedIn = false;
    }
}

doCorrespondingAction();


function getProfile() {
    fetch("https://wokki20.nl/lilroby/api/v1/profile", { // url parameter is only needed when you want to specify a user
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok, status: ' + response.status);
        }
        return response.json();  // Parse JSON if the response is OK
    })
    .then(data => {
        if (data.status === "success") {
            const headerAccountBtn = document.getElementById("header-account-btn");
            headerAccountBtn.outerHTML = `
                <button class="headerAccountBtn"><div id="header-btn-lilcoins-count" class="headerBtnLilcoinsCount">${data.profile.lilcoins}</div><img src="assets/branding/lilcoin-wbr.png" style="width: 25px; height: 25px;"></button>
            `;
        } else {
            console.error("Error:", data.error);
        }
    })
    .catch(error => {
        console.error("Request failed", error);
    });
                                        
}