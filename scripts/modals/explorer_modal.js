import { closeModal } from "../modal_manager.js";
import { setCurrentSection } from "../pagination.js";

const chapterContainer = document.querySelector(".chapter-container");
const chapterTemplate = document.querySelector("#chapter-card-template");
const explorerCloseButton = document.querySelector("#explorer-modal-close-button");

// Close explorer modal on button click
explorerCloseButton.addEventListener("click", () => closeModal("explorer-modal"));

// Build all chapter cards in a DocumentFragment
const fragment = document.createDocumentFragment();

document.querySelectorAll(".app-section").forEach((section, idx) => {
    const { chapter_id: id } = section.dataset;
    const cardRoot = (chapterTemplate.content.firstElementChild.cloneNode(true));

    cardRoot.classList.add(`chapter-thumbnail-${id}`);
    cardRoot.dataset.chapterIndex = idx;
    cardRoot
        .querySelector(".chapter-card-name")
        .textContent = section
            .querySelector(".app-section-title")
            ?.textContent
            .trim() || `Chapter ${id}`;

    fragment.appendChild(cardRoot);
});

// Append all at once
chapterContainer.appendChild(fragment);

// Delegate clicks on chapter cards
chapterContainer.addEventListener("click", (event) => {
    const card = event.target.closest("[data-chapter-index]");
    if (!card) return;

    const index = Number(card.dataset.chapterIndex);
    closeModal("explorer-modal");
    setCurrentSection(index);

    // Smooth scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
});
