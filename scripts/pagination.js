const HIDDEN_CLASS = "hidden";

function getSections() {
    return Array.from(document.querySelectorAll(".app-section"));
}

function isValidIndex(index, length) {
    return Number.isInteger(index) && index >= 0 && index < length;
}

function hideAllSections() {
    const sections = getSections();
    sections.forEach(section => section.classList.add(HIDDEN_CLASS));
}

function showSection(index) {
    const sections = getSections();

    if (!isValidIndex(index, sections.length)) {
        console.warn(`showSection: index ${index} is out of range (0–${sections.length - 1}).`);
        return;
    }

    sections[index].classList.remove(HIDDEN_CLASS);
}

export function setCurrentSection(targetIndex) {
    const sections = getSections();
    const total = sections.length;

    if (total === 0) {
        console.warn("setCurrentSection: no sections found in DOM.");
        return;
    }

    // Wrap around
    let index = ((targetIndex % total) + total) % total;

    hideAllSections();
    showSection(index);
    currentSectionIndex = index;
}

let currentSectionIndex = 0;

export function nextSection() {
    setCurrentSection(currentSectionIndex + 1);
}

export function previousSection() {
    setCurrentSection(currentSectionIndex - 1);
}

setCurrentSection(currentSectionIndex);
