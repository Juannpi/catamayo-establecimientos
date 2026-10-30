const theme = document.getElementById('themeToggle');


// Revisar si ya existe un tema guardado
const temaGuardado = localStorage.getItem('tema');


// Aplicar el tema guardado al cargar la página
if (temaGuardado === 'oscuro') {

    document.body.classList.add('dark');

    theme.innerHTML = 'Modo claro';

} else {

    document.body.classList.remove('dark');

    theme.innerHTML = 'Modo oscuro';
}


// Cambiar tema al hacer clic
theme.addEventListener('click', () => {

    document.body.classList.toggle('dark');


    if (document.body.classList.contains('dark')) {

        theme.innerHTML = 'Modo claro';

        localStorage.setItem(
            'tema',
            'oscuro'
        );

    } else {

        theme.innerHTML = 'Modo oscuro';

        localStorage.setItem(
            'tema',
            'claro'
        );
    }

});