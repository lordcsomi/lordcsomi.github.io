const brandCard = document.getElementById("branding");

const why = document.getElementById("why");
const arrow1 = document.getElementById("arrow-down1");
const whyItems = document.getElementById("why_li");

const expectations = document.getElementById("expectations");
const arrow2 = document.getElementById("arrow-down2");
const expectationsItems = document.getElementById("expectations_li");

const apply = document.getElementById("apply");
const arrow3 = document.getElementById("arrow-down3");
const applyItems = document.getElementById("apply_li");



// event listeners check if the user clicks on the brand than the user will be sent to main page
brandCard.addEventListener("click", () => {
  window.location.href = "../";
});

// event listeners check if the user clicks on the why than add the class open to the whyItems and rotate arrow 180 degrees
why.addEventListener("click", () => {
  whyItems.classList.toggle("open");
  arrow1.classList.toggle("rotate");
});

// event listeners check if the user clicks on the expectations than add the class open to the expectationsItems and rotate arrow 180 degrees
expectations.addEventListener("click", () => {
    expectationsItems.classList.toggle("open");
    arrow2.classList.toggle("rotate");
});

// event listeners check if the user clicks on the apply than add the class open to the applyItems and rotate arrow 180 degrees
apply.addEventListener("click", () => {
    applyItems.classList.toggle("open");
    arrow3.classList.toggle("rotate");
});