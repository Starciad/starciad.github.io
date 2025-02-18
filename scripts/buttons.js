import { nextSection, previousSection } from "./pagination.js";

// Add interactivity to link buttons
document.querySelectorAll("#link-button").forEach(element => {
    element.addEventListener('click', function () {
        window.open(element.dataset.url, '_blank');
    });
});

// Add interactivity to the pagination system
document.querySelector("#previous-section-pagination-button").addEventListener('click', function() {
    previousSection();
});

document.querySelector("#next-section-pagination-button").addEventListener('click', function () {
    nextSection();
});