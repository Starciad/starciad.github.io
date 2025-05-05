import { closeModal } from "../modal_manager.js";
import { setCurrentSection } from "../pagination.js";

const chapterContainer = document.querySelector(".chapter-container");
const chapterCardTemplate = document.querySelector("#chapter-card-template");
const appSections = document.querySelectorAll(".app-section");

document.querySelector("#explorer-modal-close-button").addEventListener('click', function () {
    closeModal("explorer-modal");
});

let index = 0;

appSections.forEach(appSection => {
    const chapterId = appSection.dataset.chapter_id;
    const chapterCardElement = chapterCardTemplate.content.cloneNode(true).firstElementChild;

    chapterCardElement.classList.add(`chapter-thumbnail-${chapterId}`);
    chapterCardElement.dataset.chapter_index = index;
    chapterCardElement.querySelector(".chapter-card-name").innerHTML = appSection.querySelector(".app-section-title").innerHTML;

    chapterContainer.append(chapterCardElement);

    chapterCardElement.addEventListener('click', function() {
        closeModal("explorer-modal");
        setCurrentSection(chapterCardElement.dataset.chapter_index);
        window.scrollTo(0, 0);
    });

    index++;
});

