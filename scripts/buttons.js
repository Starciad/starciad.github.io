document.querySelectorAll("#link-button").forEach(element => {
    element.addEventListener('click', function () {
        window.open(element.dataset.url, '_blank');
    });
});