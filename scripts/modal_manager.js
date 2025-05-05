const modalContainer = document.querySelector(".modal-container");
const modalElements = Array.from(document.querySelectorAll(".modal"));
const modalsById = new Map();

let currentlyOpenModal = null;

modalElements.forEach(modalEl => {
    if (modalEl.id) {
        modalsById.set(modalEl.id, modalEl);
        modalEl.classList.add("modal-hidden");
    }

    modalContainer.classList.add("modal-hidden");
});

export function openModal(modalId) {
    const targetModal = modalsById.get(modalId);

    if (!targetModal) {
        console.warn(`Modal with ID "${modalId}" not found.`);
        return;
    }

    if (currentlyOpenModal && currentlyOpenModal !== targetModal) {
        closeModal(currentlyOpenModal.id);
    }

    modalContainer.classList.remove("modal-hidden");
    targetModal.classList.remove("modal-hidden");

    currentlyOpenModal = targetModal;
}

export function closeModal(modalId = null) {
    const idToClose = modalId || (currentlyOpenModal && currentlyOpenModal.id);

    if (!idToClose) {
        return;
    }

    const modalToClose = modalsById.get(idToClose);
    if (!modalToClose) {
        console.warn(`Modal with ID "${idToClose}" not found.`);
        return;
    }

    modalContainer.classList.add("modal-hidden");
    modalToClose.classList.add("modal-hidden");

    if (currentlyOpenModal === modalToClose) {
        currentlyOpenModal = null;
    }
}

export function getCurrentModal() {
    return currentlyOpenModal ? currentlyOpenModal.id : null;
}
