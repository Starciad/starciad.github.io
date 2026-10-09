const toggleButton = document.getElementById('theme-toggle');

function toggleTheme()
{
    // Determine the current theme based on the HTML attribute
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = 'light';

    if (currentTheme === 'light')
    {
        newTheme = 'dark';
    }

    // Apply the new theme visually
    document.documentElement.setAttribute('data-theme', newTheme);

    // Update the button name to reflect the selected theme
    toggleButton.textContent = newTheme === 'dark' ? 'Tema Escuro' : 'Tema Claro';

    // Save the new choice in localStorage for future visits
    localStorage.setItem('theme', newTheme);
}

toggleButton.textContent = document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'Tema escuro'
    : 'Tema claro';

toggleButton.addEventListener('click', toggleTheme);
