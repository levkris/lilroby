const access_token = localStorage.getItem("access_token");
const refresh_token = localStorage.getItem("refresh_token");
const access_token_expires_at = localStorage.getItem("access_token_expires_at");
const refresh_token_expires_at = localStorage.getItem("refresh_token_expires_at");
const PRINT_WTXT_PRICE = 15;
const PRINT_BASE_PRICE = 10;
const printDisplayCard = document.getElementById("print-display-card");
const printInfoMsg = document.getElementById("print-info-msg");
const printSuccessMsg = document.getElementById("print-success-msg");
const printSuccessMsgTitle = document.getElementById("print-success-msg-title");
const introSectionPrintsCounter = document.getElementById("intro-section-prints-counter");
let lilcoins = 0;

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
        fetchTimeline();
    } else if (!accessTokenValid() && refreshTokenValid() && access_token !== null && refresh_token !== null) {
        console.log("Access token is not valid, but refresh token is");
        loggedIn = false;
        fetchTimeline();

    } else {
        loggedIn = false;
        fetchTimeline();
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
            let headerAccountBtn = document.getElementById("header-account-btn");
            headerAccountBtn.outerHTML = `
                <button class="headerAccountBtn" id="header-account-btn">
                    <div id="header-btn-lilcoins-count" class="headerBtnLilcoinsCount">${data.profile.lilcoins}</div>
                    <img src="assets/branding/lilcoin-wbr.png" style="width: 25px; height: 25px;">
                </button>
            `;

            // Get the new button since the old one was replaced
            headerAccountBtn = document.getElementById("header-account-btn");

            lilcoins = data.profile.lilcoins;

            headerAccountBtn.addEventListener("click", () => {
                let profilePopup = `
                <div class="modalUserStateWrapper">
                    <div class="modalAccount modalPopup" id="modal-account">
                        <div class="modalHeader">
                        <div class="modalTitle">Account</div>
                        <div class="modalAccountHeaderRight">
                            <button class="modalAccountLogoutBtn" onclick="logout()">Logout</button>
                            <button class="modalCloseBtn" id="modal-close-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.remove();">
                            <i class="material-symbols-rounded">close</i>
                            </button>
                        </div>
                        </div>
                        <div class="modalAccountInfoWrapper">
                        <div class="modalAccountUsernameEditInputErrorMsg" id="modal-account-username-edit-input-error-msg"></div>
                        <div class="modalAccountUsernameWrapper">
                            <div class="modalAccountInfo username active" id="modal-account-info-name">${data.profile.username}</div>

                            <div class="modalAccountUsernameEditInput" id="modal-account-username-edit-input-wrapper">
                            <div class="usernameInputWrapper">
                                <input type="text" id="modal-account-username-edit-input" autocomplete="off">
                            </div>
                            <div class="editUsernameBtnsWrapper">
                                <button class="editUsernameBtnN" id="edit-username-cancel-btn">
                                <i class="material-symbols-rounded">close</i>
                                </button>
                                <button class="editUsernameBtnN" id="edit-username-approve-btn">
                                <i class="material-symbols-rounded">check</i>
                                </button>
                            </div>
                            </div>
                        </div>
                        <div class="modalAccountInfo lilCoins">
                            <div class="lilCoinsUserBalanceTxt">balance:</div>
                            <div class="lilCoinsUserBalanceTxt" id="modal-account-info-lilcoins">${data.profile.lilcoins}</div>
                            <img src="assets/branding/lilcoin-bb.png" style="width: 25px; height: 25px" alt="lil coin icon">
                        </div>
                        <div class="modalAccountInfo" id="modal-account-info-creation-date">here since: ${data.profile.created_at}</div>

                        <div class="userPrintsWrapper">
                            <div class="userExtraDataIntro">
                            <div class="userModalTitle" id="modal-account-info-prints-count">prints: 0</div>
                            <button class="modalExtraDataExpandBtn" id="modal-account-info-prints-btn"><i class="material-symbols-rounded">expand_more</i></button>
                            </div>
                            <div class="userPrintItems hidden" id="modal-account-info-prints"></div>
                        </div>
                        <div class="modalAccountInfo" id="modal-account-info-upvotes">upvotes: 0</div>
                        <div class="modalAccountInfoEditWrapper">
                            <div class="modalAccountInfo" id="modal-account-info-email">${data.profile.email}</div>
                            
                            <div class="emailVerifiedWrapper">
                            <i class="material-symbols-rounded">verified</i>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                `;

                document.body.insertAdjacentHTML("beforeend", profilePopup);
            });

        } else {
            console.error("Error:", data.error);
            if (data.error === "User has to verify their email first.") {
                window.location.href = "verify.html";
            }
        }
    })
    .catch(error => {
        console.error("Request failed", error);
    });
                                        
}


let selectedCustomImg = null;
hiddenPrintImgInput.addEventListener("change", (event) => {
  if (event.target.files && event.target.files[0]) {
    selectedCustomImg = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      printInteractionCustomImgBtnTxt.classList.remove("active");
      printInteractionBtnImg.classList.add("active");
      printInteractionBtnImg.src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }
});

let printWithTxt = false;
let price = PRINT_BASE_PRICE;
const printTxtInput = document.getElementById("print-txt-input");
const printTxtInputWrapper = document.getElementById("print-txt-input-wrapper");
const printElementPricetag = document.getElementById("print-element-pricetag");
const printAddTxtFieldBtn = document.getElementById("print-add-txt-btn");
printAddTxtFieldBtn.addEventListener("click", () => {
  if (printWithTxt) {
    printAddTxtFieldBtn.innerText = "add text";
    printWithTxt = false;
    printTxtInputWrapper.classList.remove("active");
    printElementPricetag.innerText = PRINT_BASE_PRICE;
    price = PRINT_BASE_PRICE;
  } else {
    printAddTxtFieldBtn.innerText = "remove text";
    printWithTxt = true;
    printTxtInputWrapper.classList.add("active");
    printElementPricetag.innerText = PRINT_WTXT_PRICE;
    price = PRINT_WTXT_PRICE;
  }
});

let submittingForm = false;

const form = document.getElementById('new-print-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (selectedCustomImg === null) {
        return;
    }

    const formData = new FormData();
    formData.append('title', document.querySelector('#print-title-input').value);
    formData.append('message', document.querySelector('#print-txt-input').value);
    formData.append('name', document.querySelector('#print-name-input').value);
    formData.append('image', selectedCustomImg);

    submittingForm = true;

    const accessToken = localStorage.getItem('access_token');

    try {
        const response = await fetch('https://wokki20.nl/lilroby/api/v1/print', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: formData,
        });

        const result = await response.json();
        console.log(result);
        submittingForm = false;
        if (result.error) {
            printInfoMsg.innerHTML = result.error;
            printDisplayCard.classList.add("rotate");
            return;
        } else if (result.success) {
            printInfoMsg.classList.remove("active");
            printSuccessMsg.classList.add("active");
            printSuccessMsgTitle.innerHTML = "Print #" + result.print_id + " submitted successfully!";
            printDisplayCard.classList.add("rotate");
            let newLilcoins = parseInt(lilcoins) - parseInt(price);
            lilcoins = newLilcoins;
            document.getElementById("header-btn-lilcoins-count").textContent = lilcoins;
            
        }
        

    } catch (err) {
        console.error('Error submitting post:', err);
    }
});


function fetchTimeline(offset = 0) {
    const headers = loggedIn ? { 'Authorization': `Bearer ${access_token}` } : {};
    fetch(`https://wokki20.nl/lilroby/api/v1/timeline?offset=${offset}`, {
        method: "GET",
        headers: headers
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            introSectionPrintsCounter.innerHTML = data.total_posts;

            if (data.posts.length <= data.total_posts) {
                document.getElementById("newest-prints").remove();
            } else {
                document.getElementById("newest-prints").style.display = "block";
                document.getElementById("newest-prints").addEventListener("click", () => {
                    fetchTimeline(offset + 25);
                })
            }

            const timelineContainer = document.getElementById("prints-timeline-items");
            let postsHtml = "";
            data.posts.forEach(post => {
                let postHtml = `
                    <div class="timelinePrintjobWrapper" id="${post.id}" style="color: #000;">
                        <div class="timelinePrintjobContent">
                            <img
                            class="timelinePrintjobImg"
                            src="https://wokki20.nl/lilroby/api/v1/prints/${post.unique_image_id}.webp"
                            />
                            <div class="timelinePrintjobTitle">${post.title}</div>
                            <div class="timelinePrintjobText">${post.message || ""}</div>
                            <div class="timelinePrintjobName">${post.name}</div>
                            <div class="timelinePrintjobNr">Print #${post.id}</div>
                        </div>
                        <div class="timelinePrintjobFooterWrapper">
                            <div class="timelinePrintjobFooterLeft">#${post.id}</div>
                            <div class="timelinePrintjobFooterRight">
                            <div class="timelinePrintjobFooterUpvotesCount">${post.upvotes}</div>
                            <button class="timelinePrintjobFooterUpvoteBtn">
                                <img
                                src="assets/branding/upvote-${post.upvoted ? "true" : "false"}.png"
                                class="timelinePrintjobFooterUpvoteBtnIcon"
                                />
                            </button>
                            </div>
                        </div>
                    </div>
                `;
                postsHtml += postHtml;
            });
            timelineContainer.innerHTML += postsHtml;


            if (loggedIn) {
                document.querySelectorAll(".timelinePrintjobFooterUpvoteBtn").forEach(btn => {
                    btn.addEventListener("click", async () => {
                        const printId = btn.parentElement.parentElement.parentElement.id;
                        const accessToken = localStorage.getItem("access_token");
                        const response = await fetch(`https://wokki20.nl/lilroby/api/v1/prints/${printId}/upvote`, {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${accessToken}`
                            }
                        });
                        const result = await response.json();
                        if (result.success) {
                            if (result.upvoted) {
                                btn.querySelector(".timelinePrintjobFooterUpvoteBtnIcon").src = "assets/branding/upvote-true.png";
                                btn.parentElement.querySelector(".timelinePrintjobFooterUpvotesCount").innerHTML = result.upvotes;
                            } else {
                                btn.querySelector(".timelinePrintjobFooterUpvoteBtnIcon").src = "assets/branding/upvote-false.png";
                                btn.parentElement.querySelector(".timelinePrintjobFooterUpvotesCount").innerHTML = result.upvotes;
                            }
                        }
                    })
                })
            }
        }
    })
    .catch(error => {
        console.error("Request failed", error);
    });
}