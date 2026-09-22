const theme = document.getElementById('themeToggle');

theme.addEventListener('click', () => {

    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {

        theme.innerHTML = 'Modo claro';

    } else {

        theme.innerHTML = 'Modo oscuro';

    }

});