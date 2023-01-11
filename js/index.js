const developerCard = document.getElementById("developer");
const designerCard = document.getElementById("designer");
const mediaCard = document.getElementById("media");

// eventlistener if one of the cards is clicked
developerCard.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "developer.html";
  }, 500);
});

designerCard.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "designer.html";
  }, 500);
});

mediaCard.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "media.html";
  }, 500);
});