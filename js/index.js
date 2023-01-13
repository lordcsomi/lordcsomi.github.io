const brandCard = document.getElementById("branding");
const developerCard = document.getElementById("developer");
const designerCard = document.getElementById("designer");
const mediaCard = document.getElementById("media");
const writerCard = document.getElementById("writer");
const creativeCard = document.getElementById("creative");

// eventlistener if one of the cards is clicked wait 500ms and then redirect to the correct page what is in an other directory
developerCard.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "developer/";
    }, 500);
});
designerCard.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "designer/";
    }, 500);
});
mediaCard.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "media/";
    }, 500);
});
brandCard.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
});
writerCard.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "writer/";
    }, 500);
});
creativeCard.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "creative/";
    }, 500);
});