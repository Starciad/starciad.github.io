import { nextSection, previousSection } from "./pagination.js";

// KEYBOARD SHORTCUTS

function scrollToUp(){
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "ArrowLeft":
            scrollToUp();
            previousSection();
            break;

        case "ArrowRight":
            scrollToUp();
            nextSection();
            break;

        default:
            break;
    }
});