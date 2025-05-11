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
const timelineTab = document.getElementById("prints-timeline-tab");
const rankingTab = document.getElementById("ranking-tab");
const lilcoinsTab = document.getElementById("lilcoins-tab");
const printsTimelineWrapper = document.getElementById("prints-timeline-wrapper");
const rankingWrapper = document.getElementById("ranking-wrapper");
const lilcoinsWrapper = document.getElementById("lilcoins-wrapper");
const printsCountRankingTab = document.getElementById("prints-count-ranking-tab");
const lilcoinsCountRankingTab = document.getElementById("lilcoins-count-ranking-tab");
const upvotesRankingTab = document.getElementById("upvotes-ranking-tab");
const printsCountRankingContent = document.getElementById("prints-count-ranking-content");
const lilcoinsCountRankingContent = document.getElementById("lilcoins-count-ranking-content");
const upvotesRankingContent = document.getElementById("upvotes-ranking-content");


timelineTab.addEventListener("click", () => {
    timelineTab.classList.add("active");
    rankingTab.classList.remove("active");
    lilcoinsTab.classList.remove("active");
    printsTimelineWrapper.classList.add("active");
    rankingWrapper.classList.remove("active");
    lilcoinsWrapper.classList.remove("active");
})

rankingTab.addEventListener("click", () => {
    timelineTab.classList.remove("active");
    rankingTab.classList.add("active");
    lilcoinsTab.classList.remove("active");
    printsTimelineWrapper.classList.remove("active");
    rankingWrapper.classList.add("active");
    lilcoinsWrapper.classList.remove("active");

})

lilcoinsTab.addEventListener("click", () => {
    timelineTab.classList.remove("active");
    rankingTab.classList.remove("active");
    lilcoinsTab.classList.add("active");
    printsTimelineWrapper.classList.remove("active");
    rankingWrapper.classList.remove("active");
    lilcoinsWrapper.classList.add("active");
    fetchLilcoinsPage();
})

getRankings('prints_count')


printsCountRankingTab.addEventListener("click", () => {
    printsCountRankingTab.classList.add("active");
    lilcoinsCountRankingTab.classList.remove("active");
    upvotesRankingTab.classList.remove("active");
    printsCountRankingContent.classList.add("active");
    lilcoinsCountRankingContent.classList.remove("active");
    upvotesRankingContent.classList.remove("active");
    getRankings('prints_count')
})

lilcoinsCountRankingTab.addEventListener("click", () => {
    printsCountRankingTab.classList.remove("active");
    lilcoinsCountRankingTab.classList.add("active");
    upvotesRankingTab.classList.remove("active");
    printsCountRankingContent.classList.remove("active");
    lilcoinsCountRankingContent.classList.add("active");
    upvotesRankingContent.classList.remove("active");
    getRankings('lilcoins')
})

upvotesRankingTab.addEventListener("click", () => {
    printsCountRankingTab.classList.remove("active");
    lilcoinsCountRankingTab.classList.remove("active");
    upvotesRankingTab.classList.add("active");
    printsCountRankingContent.classList.remove("active");
    lilcoinsCountRankingContent.classList.remove("active");
    upvotesRankingContent.classList.add("active");
    getRankings('upvotes')
})


function getRankings(type = 'prints_count') {
    fetch("https://wokki20.nl/lilroby/api/v1/rankings?type=" + type + "", { // url parameter is only needed when you want to specify a user
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
        if (type === 'prints_count') {
            printsCountRankingContent.innerHTML = "";
            data.forEach(item => {
                printsCountRankingContent.innerHTML += `
                    <div class="topTenRankingItem">
                        <div class="newRankingItemNr">${item.rank}.</div>
                        <div class="newRankingItemUsername">${item.username}</div>
                        <div class="newRankingItemlilCoins">${item.prints_count} prints</div>
                    </div>
                `;
            })
        } else if (type === 'lilcoins') {
            lilcoinsCountRankingContent.innerHTML = "";
            data.forEach(item => {
                lilcoinsCountRankingContent.innerHTML += `
                    <div class="lilcoinsRankingItem">
                        <div class="newRankingItemNr">${item.rank}.</div>
                        <div class="newRankingItemUsername">${item.username}</div>
                        <div class="newRankingItemlilCoins">${item.lilcoins} lilCoins</div>
                    </div>
                `;
            })
        } else if (type === 'upvotes') {
            upvotesRankingContent.innerHTML = "";
            data.forEach(item => {
                upvotesRankingContent.innerHTML += `
                    <div class="topTenRankingItem">
                        <div class="newRankingItemNr">${item.rank}.</div>
                        <div class="newRankingItemUsername">${item.username}</div>
                        <div class="newRankingItemlilCoins">${item.upvotes} upvotes</div>
                    </div>
                `;
            })

        }
    })
    .catch(error => {
        console.error("Request failed", error);
    });
}



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
                            <div class="userModalTitle" id="modal-account-info-prints-count">prints: ${data.profile.prints}</div>
                            <button class="modalExtraDataExpandBtn" id="modal-account-info-prints-btn"><i class="material-symbols-rounded">expand_more</i></button>
                            </div>
                            <div class="userPrintItems hidden" id="modal-account-info-prints"></div>
                        </div>
                        <div class="modalAccountInfo" id="modal-account-info-upvotes">upvotes: ${data.profile.upvotes}</div>
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
            } else if (data.error === "Invalid or expired access token") {
                loggedIn = false;
                fetchTimeline();                
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

            document.querySelector('#print-title-input').value = "";
            document.querySelector('#print-txt-input').value = "";
            document.querySelector('#print-name-input').value = "";
            selectedCustomImg = null;

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

            const timelineContainer = document.getElementById("prints-timeline-items");
            let postsHtml = "";
            data.posts.forEach(post => {
                let postHtml = "";
                if (post.status === "under_review") {
                    postHtml = `
                    <div class="timelinePrintjobWrapper lil" id="${post.id}" style="color: #000;">
                        <div class="timelineUncheckedPrintjob"><div class="timelineUncheckedPrintjobTitle">#${post.id}</div><div class="timelineUncheckedPrintjobText">Under review</div><i class="material-symbols-rounded">policy</i></div>
                    </div>
                `;
                } else if (post.status === "denied") {
                    postHtml = `
                    <div class="timelinePrintjobWrapper lil" id="${post.id}" style="color: #000;">
                        <div class="timelineUncheckedPrintjob"><div class="timelineUncheckedPrintjobTitle">#${post.id}</div><div class="timelineUncheckedPrintjobText">denied!</div><i class="material-symbols-rounded">block</i></div>
                    </div>
                    `; 
                } else {
                    postHtml = `
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
                }
                
                postsHtml += postHtml;
            });
            timelineContainer.innerHTML += postsHtml;

            // Show or hide the "View More" button
            const viewMoreBtn = document.getElementById("newest-prints");
            if (data.posts.length < data.total_posts) {
                viewMoreBtn.style.display = "block";
                viewMoreBtn.addEventListener("click", () => {
                    fetchTimeline(offset + 25);
                    viewMoreBtn.style.display = "none"; // Hide the button after clicking
                });
            } else {
                viewMoreBtn.style.display = "none"; // Hide if no more posts
            }

            if (loggedIn) {
                document.querySelectorAll(".timelinePrintjobFooterUpvoteBtn").forEach(btn => {
                    btn.addEventListener("click", async () => {
                        const printId = btn.parentElement.parentElement.parentElement.id;
                        const accessToken = localStorage.getItem("access_token");
                        const formData = new FormData();
                        formData.append('post_id', printId);
                        const response = await fetch(`https://wokki20.nl/lilroby/api/v1/upvote`, {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${accessToken}`
                            },
                            body: formData
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

function fetchLilcoinsPage() {

    fetch("https://wokki20.nl/lilroby/api/v1/lilcoin_tasks", { // url parameter is only needed when you want to specify a user
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

            const tasks = data.tasks;
            const claimableHours = data.claimable_hours;

            let tasksHtmlOuter = `
            
                <div class="lilCoinsUserBalanceWrapper">
                    <div class="lilCoinsUserBalanceTxt">Balance:</div>
                    <div class="lilCoinsUserBalanceTxt lilCoinsUserBalanceDisplay" id="lil-coins-user-balance-display">0</div>
                    <img src="assets/branding/lilcoin-wb.png" style="width: 20px; height: 20px" alt="lil coin icon">
                </div>
                <div class="lilCoinsDescriptionWrapper">
                    <div class="lilCoinsDescription">
                    You can get lilCoins for free in many ways below, but if you have
                    some spare change and want to support the project you can also buy
                    some! Have fun!
                    </div>
                </div>
                <div class="lilCoinsShopWrapper" id="lilCoins-shop-wrapper">

                </div>
            
            `;

            let tasksHtml = "";

            let claimableHoursList = [];
            let claimablePrintsList = [];
            let claimedPrintsList = [];
            let claimeableUpvotesList = [];
            let claimedUpvotesList = [];

            claimableHours.forEach(hour => {
                let hourList = {
                    alias: hour.alias,
                    time_left: hour.time_left
                };
                claimableHoursList.push(hourList);
            })

            data.claimable_prints.forEach(print => {
                let printList = {
                    alias: print.alias,
                    needed: print.needed,
                    has: print.has
                };
                claimablePrintsList.push(printList);
            })

            data.claimed_prints.forEach(print => {
                let printList = {
                    alias: print.alias,
                    needed: print.needed,
                    has: print.has
                };
                claimedPrintsList.push(printList);
            })

            data.claimable_upvotes.forEach(upvote => {
                let upvoteList = {
                    alias: upvote.alias,
                    needed: upvote.needed,
                    has: upvote.has
                };
                claimeableUpvotesList.push(upvoteList);
            })

            data.claimed_upvotes.forEach(upvote => {
                let upvoteList = {
                    alias: upvote.alias,
                    needed: upvote.needed,
                    has: upvote.has
                };
                claimedUpvotesList.push(upvoteList);
            })

            Object.entries(tasks).forEach(([taskGroupName, taskGroup]) => {
                if (taskGroupName === "hours") {
                    taskGroup.forEach(task => {
                        let timeLeft = task.time_left;

                        // Override with current time from claimable list if exists
                        const matched = claimableHoursList.find(hour => hour.alias === task.alias);
                        if (matched) {
                            timeLeft = matched.time_left;
                        }

                        // Unique alias used as data attribute to select specific elements
                        tasksHtml += `
                            <div class="lilCoinsOfferWraper" data-alias="${task.alias}" data-type="hour">
                                <div class="lilCoinsOfferMain">
                                    <div class="lilCoinsOfferTitle">${task.name}:</div>
                                    <div class="lilCoinsOfferContent">
                                        <div class="lilCoinsOfferText">${task.price}</div>
                                        <img src="assets/branding/lilcoin-wb.png" style="width: 20px; height: 20px" alt="lil coin icon">
                                    </div>
                                    <div class="lilCoinsOfferTextWrapper oneHoursRewardTimer" data-alias="${task.alias}">
                                        ${formatTime(timeLeft)}
                                    </div>
                                    <button class="lilCoinsOfferBtn ${timeLeft === 0 ? "" : "inactive"}"
                                            data-alias="${task.alias}"
                                            onclick="claimReward('${task.alias}')">
                                        ${timeLeft === 0 ? "claim" : "wait"}
                                    </button>
                                </div>
                            </div>
                        `;

                        // Use a closure to keep the right timeLeft per task
                        setTimeout(() => {
                            const timerInterval = setInterval(() => {
                                if (timeLeft > 0) {
                                    timeLeft--;

                                    const timerEls = document.querySelectorAll(`.oneHoursRewardTimer[data-alias="${task.alias}"]`);
                                    timerEls.forEach(el => el.textContent = formatTime(timeLeft));

                                    // If time runs out, update button
                                    if (timeLeft === 0) {
                                        const btns = document.querySelectorAll(`.lilCoinsOfferBtn[data-alias="${task.alias}"]`);
                                        btns.forEach(btn => {
                                            btn.classList.remove("inactive");
                                            btn.textContent = "claim";
                                        });
                                    }
                                }
                            }, 1000);
                        }, 0);
                    });
                } else if (taskGroupName === "prints") {
                    taskGroup.forEach(task => {
                        let needed = task.needed;
                        let has = task.has;

                        // Override with current time from claimable list if exists
                        const matched = claimablePrintsList.find(print => print.alias === task.alias);
                        if (matched) {
                            needed = matched.needed;
                            has = matched.has;
                        }

                        const claimed = claimedPrintsList.find(print => print.alias === task.alias);
                        if (claimed) {
                            has = claimed.has;
                        }

                        // Unique alias used as data attribute to select specific elements
                        tasksHtml += `
                            <div class="lilCoinsOfferWraper" data-alias="${task.alias}" data-claimed="${claimed ? "true" : "false"}" data-type="print">
                                <div class="lilCoinsOfferMain">
                                    <div class="lilCoinsOfferTitle">${task.name}:</div>
                                    <div class="lilCoinsOfferContent">
                                        <div class="lilCoinsOfferText">${task.price}</div>
                                        <img src="assets/branding/lilcoin-wb.png" style="width: 20px; height: 20px" alt="lil coin icon">
                                    </div>
                                    <div class="lilCoinsOfferTextWrapper lilcoinsSocialWrapper">${has}/${needed} prints</div>
                                    <button class="lilCoinsOfferBtn ${has >= needed && !claimed ? "" : "inactive"}"
                                            data-alias="${task.alias}"
                                            onclick="claimReward('${task.alias}')">
                                        ${claimed ? "<i class='material-symbols-rounded'>check</i>" : has >= needed ? "claim" : "later"}
                                    </button>
                                </div>
                            </div>
                        `;
                        
                    });                    
                } else if (taskGroupName === "upvotes") {
                    taskGroup.forEach(task => {
                        let needed = task.needed;
                        let has = task.has;

                        // Override with current time from claimable list if exists
                        const matched = claimeableUpvotesList.find(upvote => upvote.alias === task.alias);
                        if (matched) {
                            needed = matched.needed;
                            has = matched.has;
                        }

                        const claimed = claimedUpvotesList.find(upvote => upvote.alias === task.alias);
                        if (claimed) {
                            has = claimed.has;
                        }

                        // Unique alias used as data attribute to select specific elements
                        tasksHtml += `
                            <div class="lilCoinsOfferWraper" data-alias="${task.alias}" data-claimed="${claimed ? "true" : "false"}" data-type="upvote">
                                <div class="lilCoinsOfferMain">
                                    <div class="lilCoinsOfferTitle">${task.name}:</div>
                                    <div class="lilCoinsOfferContent">
                                        <div class="lilCoinsOfferText">${task.price}</div>
                                        <img src="assets/branding/lilcoin-wb.png" style="width: 20px; height: 20px" alt="lil coin icon">
                                    </div>
                                    <div class="lilCoinsOfferTextWrapper lilcoinsSocialWrapper">${has}/${needed} upvotes</div>
                                    <button class="lilCoinsOfferBtn ${has >= needed && !claimed ? "" : "inactive"}"
                                            data-alias="${task.alias}"
                                            onclick="claimReward('${task.alias}')">
                                        ${claimed ? "<i class='material-symbols-rounded'>check</i>" : has >= needed ? "claim" : "later"}
                                    </button>
                                </div>
                            </div>
                        `;
                        
                    });         
                }
            });

            // Split the HTML into chunks, keeping the first part as the preamble
            const taskslist = tasksHtml.split('<div class="lilCoinsOfferWraper"');
            const preamble = taskslist.shift(); // non-task HTML before the first task

            // Sort and separate tasks
            const activeTasks = [];
            const completedTasks = [];

            taskslist.forEach(task => {
                const isClaimed = task.includes('data-claimed="true"');
                if (isClaimed) {
                    completedTasks.push(task);
                } else {
                    activeTasks.push(task);
                }
            });

            // Sort within each group (optional: by time)
            const sortByTimeTop = (a, b) => {
                const aHasTime = a.includes('data-type="hour"');
                const bHasTime = b.includes('data-type="hour"');
                return aHasTime ? -1 : (bHasTime ? 1 : 0);
            };

            activeTasks.sort(sortByTimeTop);
            completedTasks.sort(sortByTimeTop);

            // Rebuild the HTML
            const section = (title, tasks) => 
                tasks.length > 0 
                    ? `<div class="lilCoinsShopSectionTitle">${title}</div>` + 
                    tasks.map(html => '<div class="lilCoinsOfferWraper"' + html).join("")
                    : "";

            const finalHtml = preamble +
                section("- active -", activeTasks) +
                section("- completed -", completedTasks);

            // Update the DOM
            document.getElementById("lilCoins-shop-wrapper").innerHTML = finalHtml;



            document.getElementById("lil-coins-user-balance-display").textContent = lilcoins;

            document.getElementById("lilCoinsContentWrapper").innerHTML = tasksHtmlOuter;

        console.log(data);
        } else {
            console.error("Error:", data.error);
        }
    })
    .catch(error => {
        console.error("Request failed", error);
    });
                                        
}

function formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    if (time === 0 || time < 0) return 'claim now';

    let formattedTime = '';
    if (hours > 0) {
        formattedTime += `${hours}h `;
    }
    if (minutes > 0) {
        formattedTime += `${minutes}min `;
    }
    if (seconds > 0) {
        formattedTime += `${seconds}sec`;
    }

    return formattedTime.trim();
}

function claimReward(alias) {
    const formData = new FormData();
    formData.append("task", alias);

    fetch("https://wokki20.nl/lilroby/api/v1/lilcoin_tasks", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok, status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === "success") {
            console.log(data);
            
            const btns = document.querySelectorAll(`.lilCoinsOfferBtn[data-alias="${alias}"]`);
            btns.forEach(btn => {
                btn.classList.add("inactive");
                btn.textContent = "<i class='material-symbols-rounded'>check</i>";
            });
            
            if (alias === "hour1" || alias === "hour12" || alias === "hour24") {
                btns.forEach(btn => {
                    btn.classList.add("inactive");
                    btn.textContent = "wait";
                });

                let timeLeft = 3600;

                const timerEls = document.querySelectorAll(`.oneHoursRewardTimer[data-alias="${alias}"]`);
                timerEls.forEach(el => el.textContent = formatTime(timeLeft));
                setTimeout(() => {
                    const timerInterval = setInterval(() => {
                        if (timeLeft > 0) {
                            timeLeft--;

                            timerEls.forEach(el => el.textContent = formatTime(timeLeft));

                            // If time runs out, update button
                            if (timeLeft === 0) {
                                const btns = document.querySelectorAll(`.lilCoinsOfferBtn[data-alias="${alias}"]`);
                                btns.forEach(btn => {
                                    btn.classList.remove("inactive");
                                    btn.textContent = "claim";
                                });
                            }
                        }
                    }, 1000);
                }, 0);
                
            }

            const earns = data.earns;
            let newLilcoins = parseInt(lilcoins) + parseInt(earns);
            lilcoins = newLilcoins;
            document.getElementById("lil-coins-user-balance-display").textContent = lilcoins;
            document.getElementById("header-btn-lilcoins-count").textContent = lilcoins;
        } else {
            console.error("Error:", data.error);
        }
    })
    .catch(error => {
        console.error("Request failed", error);
    });

}