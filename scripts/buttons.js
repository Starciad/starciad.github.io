import { openModal } from "./modal_manager.js";
import { nextSection, previousSection } from "./pagination.js";

// Add interactivity to link buttons
document.querySelectorAll(".btn-link").forEach(element => {
    element.addEventListener('click', function () {
        window.open(element.dataset.url, '_blank');
    });
});

// Add interactivity to the pagination system
document.querySelector("#previous-section-pagination-button").addEventListener('click', function() {
    window.scrollTo(0, 0);
    previousSection();
});

document.querySelector("#explorer-pagination-button").addEventListener('click', function () {
    openModal("explorer-modal");
});

document.querySelector("#next-section-pagination-button").addEventListener('click', function() {
    window.scrollTo(0, 0);
    nextSection();
});