const cards = document.querySelectorAll(".card");
const topDistance = 50;
const wheelPos = document.getElementById("wheelPos");
const scrollPos = document.getElementById("scrollPos");
const internalScrollPos = document.getElementById("internalScrollPos");
const scrollDirectionDiv = document.getElementById("scrollDirection");
internalScrollPos.innerText = 0;

let scrollDirection = 0;
let lastScrollTop = 0;
let scrollTopBeforeScrollTo = 0;
let syntheticTopOffset = 0;
let animationInternalScroll = 0;
let prevScrollTop = 0;
let scrollDistance = 0;
let wheelDistance = 0;
let totalCardsHeight = 0;
let gap = 10;
let isProgrammaticScrollTo = false;
let correction1to2 = false;

function updateScrollPos() {
  scrollPos.innerText = scrollTop;
}

let animationGlobalStatus = 0;
// 0 - before animation start - scroll normal
// 1 - animation is happening - scroll is prevented
// 2 - animation is over - scroll normal

function updateStatus(ev) {
  scrollTop = Math.round(window.scrollY);
  const offsetTop =
    cards[0].getBoundingClientRect().top + document.documentElement.scrollTop;
  updateScrollPos();

  // detect scroll direction
  console.log("....", lastScrollTop, scrollTop);

  if (lastScrollTop !== scrollTop && animationGlobalStatus !== 1) {
    scrollDirectionDiv.innerText = lastScrollTop < scrollTop ? "down" : "up";
  }

  lastScrollTop = scrollTop;

  // completely control wheel events
  if (ev.type === "wheel") {
    ev.preventDefault();
  }

  if (scrollTop < offsetTop) {
    animationGlobalStatus = 0;
  }

  if (offsetTop <= window.scrollY) {
    animationGlobalStatus = 1;
  }

  if (scrollTop - offsetTop > 500) {
    animationGlobalStatus = 2;
    if (!correction1to2) {
      window.scrollTo(0, offsetTop);
      correction1to2 = true;
    }
  }

  if (animationGlobalStatus === 1) {
    isProgrammaticScrollTo = true;
    window.scrollTo(0, offsetTop);
    if (offsetTop !== scrollTop) {
      scrollDirectionDiv.innerText = offsetTop < scrollTop ? "down" : "up";
    }
  } else {
    // synthetically update scroll from wheel delta
    if (ev.type === "wheel") {
      window.scrollTo(0, window.scrollY + ev.deltaY);
    }
  }

  //isScrollTo = false;
}

window.addEventListener("wheel", updateStatus, { passive: false });
window.addEventListener("scroll", updateStatus);
window.addEventListener("mouseup", () => {
  setTimeout(() => {
    scrollDirectionDiv.innerText = "";
  }, 100);
});
