// Set the initial theme
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');

    // If the user has previously made a manual choice, use it
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        return;
    }

    // If there is no manual choice, check the operating system's preference (CSS)
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (userPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        return;
    }

    document.documentElement.setAttribute('data-theme', 'light');
}

setInitialTheme();
