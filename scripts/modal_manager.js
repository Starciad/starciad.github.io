const modalContainer = document.querySelector(".modal-container");
const modalElements = Array.from(document.querySelectorAll(".modal"));
const modalsById = new Map();

let currentlyOpenModal = null;

modalElements.forEach(modalEl => {
    if (modalEl.id) {
        modalsById.set(modalEl.id, modalEl);
        modalEl.style.display = 'none';
    }

    modalContainer.style.display = 'none';
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

    modalContainer.style.display = 'flex';
    targetModal.style.display = 'block';

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

    modalContainer.style.display = 'none';
    modalToClose.style.display = 'none';

    if (currentlyOpenModal === modalToClose) {
        currentlyOpenModal = null;
    }
}

export function getCurrentModal() {
    return currentlyOpenModal ? currentlyOpenModal.id : null;
}
