import { closeModal } from "../modal_manager.js";
import { setCurrentSection } from "../pagination.js";

const chapterContainer = document.querySelector(".chapter-container");
const chapterCardTemplate = document.querySelector("#chapter-card-template");
const appSections = document.querySelectorAll(".app-section");

let index = 0;

appSections.forEach(appSection => {
    const chapterId = appSection.dataset.chapter_id;
    const chapterCard = chapterCardTemplate.content.cloneNode(true).firstElementChild;

    chapterCard.classList.add(`chapter-thumbnail-${chapterId}`);
    chapterCard.dataset.chapter_index = index;

    chapterContainer.append(chapterCard);

    chapterCard.addEventListener('click', function() {
        closeModal("explorer-modal");
        setCurrentSection(chapterCard.dataset.chapter_index);
        window.scrollTo(0, 0);
    });

    index++;
});

