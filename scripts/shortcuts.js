import { nextSection, previousSection } from "./pagination.js";

// KEYBOARD SHORTCUTS

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case "ArrowLeft":
            previousSection();
            break;

        case "ArrowRight":
            nextSection();
            break;

        default:
            break;
    }
});