const hiddenClass = "hidden";
const sections = document.querySelectorAll(".app-section");
const numberOfSections = sections.length;

let currentSectionIndex = 0;

export function previousSection() {
    let index = currentSectionIndex - 1;

    if (index < 0) {
        index = numberOfSections - 1;
    }

    setCurrentSection(index);
}

export function nextSection() {
    let index = currentSectionIndex + 1;

    if (index > numberOfSections - 1) {
        index = 0;
    }

    setCurrentSection(index);
}

function setCurrentSection(index) {
    hideAllSections();
    showSection(index);

    currentSectionIndex = index;
}

function hideAllSections() {
    for (let i = 0; i < numberOfSections; i++) {
        hideSection(i);
    }
}

function showSection(index) {
    sections[index].classList.remove(hiddenClass);
}

function hideSection(index) {
    sections[index].classList.add(hiddenClass);
}

// ================================ //

hideAllSections();
showSection(currentSectionIndex);