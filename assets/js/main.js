const mainTabsNavSection = document.querySelector(".mainTabsNavSection");


const hamburgerMenu = document.querySelector(".hamburgerMenu");
const sidebarMenuWrapper = document.querySelector(".sidebarMenuWrapper");
hamburgerMenu.addEventListener("click", () => {
  if (sidebarMenuWrapper.classList.contains("active")) {
    sidebarMenuWrapper.classList.remove("active");
  } else {
    sidebarMenuWrapper.classList.add("active");
  }
});
const sideMenuProfileBtn = document.getElementById("sidebar-menu-profile-btn");
const sideMenuPrintsBtn = document.getElementById("sidebar-menu-prints-btn");
const sideMenuLilcoinsBtn = document.getElementById(
  "sidebar-menu-lilcoins-btn"
);
const sideMenuDiscordBtn = document.getElementById("sidebar-menu-discord-btn");
const sideMenuTreesBtn = document.getElementById("sidebar-menu-trees-btn");

if (sideMenuProfileBtn) {
  sideMenuProfileBtn.addEventListener("click", () => {
    hamburgerMenu.click();
    document.getElementById("header-account-btn").click();
  });
}
sideMenuPrintsBtn.addEventListener("click", () => {
  mainTabsNavSection.scrollIntoView({ behavior: "smooth" });
  hamburgerMenu.click();
  printsSectionTab.click();
});
sideMenuLilcoinsBtn.addEventListener("click", () => {
  mainTabsNavSection.scrollIntoView({ behavior: "smooth" });
  hamburgerMenu.click();
  lilCoinsSectionTab.click();
});

const printInfoTrigger = document.getElementById("print-info-trigger");
const printInfoBackBtn = document.getElementById("print-info-back-btn");

const printInfoTxt = document.getElementById("print-info-msg");
const printSuccessTxt = document.getElementById("print-success-msg");

printInfoTrigger.addEventListener("click", () => {
  printDisplayCard.classList.add("rotate");
});
printInfoBackBtn.addEventListener("click", () => {
  printDisplayCard.classList.remove("rotate");
});

const printInteractionCustomImgBtn = document.querySelector(
  ".printInteractionCustomImgBtn"
);
const printInteractionCustomImgBtnTxt = document.querySelector(
  ".printInteractionCustomImgBtnTxt"
);
const hiddenPrintImgInput = document.getElementById(
  "hidden-print-interaction-img-input"
);
const printInteractionBtnImg = document.getElementById(
  "print-interaction-img-field"
);

printInteractionCustomImgBtn.addEventListener("click", () => {
  hiddenPrintImgInput.click();
});


function logout() {
    localStorage.clear();
    window.location.href = "/";
}