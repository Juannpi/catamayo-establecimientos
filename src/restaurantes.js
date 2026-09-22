import { supabase } from './supabase.js';

async function cargarRestaurantes() {

    // 1. Obtener los restaurantes
    const { data: restaurantes, error: errorRestaurantes } = await supabase
        .from('restaurantes')
        .select('*')
        .order('id_rest', { ascending: true });

    if (errorRestaurantes) {
        console.error('Error al cargar restaurantes:', errorRestaurantes);
        return;
    }


    // 2. Obtener los registros del ranking
    const { data: ranking, error: errorRanking } = await supabase
        .from('ranking')
        .select('id_ranking, id_rest, likes');

    if (errorRanking) {
        console.error('Error al cargar ranking:', errorRanking);
        return;
    }


    // 3. Obtener el contenedor del HTML
    const listaRestaurantes =
        document.getElementById('listaRestaurantes');

    listaRestaurantes.innerHTML = '';


    // 4. Crear una tarjeta por cada restaurante
    restaurantes.forEach((restaurante) => {

        const registroRanking = ranking.find(
            (item) => item.id_rest === restaurante.id_rest
        );


        const tarjeta = document.createElement('article');

        tarjeta.classList.add('tarjeta-establecimiento');


        tarjeta.innerHTML = `
            <img
                src="${restaurante.imagen_url}"
                alt="${restaurante.nombre_rest}"
                class="imagen-establecimiento"
            >

            <div class="informacion-establecimiento">

                <h2>${restaurante.nombre_rest}</h2>

                <p>
                    <strong>Horario:</strong>
                    ${restaurante.horarios}
                </p>

                <a
                    href="${restaurante.ubicacion_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="boton-ubicacion"
                >
                    Ver ubicación
                </a>

                <button
                    class="boton-like"
                    data-ranking="${registroRanking.id_ranking}"
                >

                    <svg
                        class="icono-like"
                        viewBox="0 0 24 24"
                    >
                        <path d="M7 10v12H3V10h4zm2 12V10l4-8c1.1 0 2 .9 2 2v4h4.7c1.3 0 2.3 1.2 2 2.5l-1.5 8c-.2 1-1 1.5-2 1.5H9z"/>
                    </svg>

                    <span class="contador-like">
                        ${registroRanking.likes}
                    </span>

                </button>

            </div>
        `;


        listaRestaurantes.appendChild(tarjeta);
    });


    // 5. Buscar todos los botones de like
    const botonesLike =
        document.querySelectorAll('.boton-like');


    // 6. Agregar el evento click a cada botón
    botonesLike.forEach((boton) => {

        boton.addEventListener('click', async () => {

            const idRanking =
                boton.dataset.ranking;

            const contador =
                boton.querySelector('.contador-like');

            const likesActuales =
                Number(contador.textContent);

            const nuevosLikes =
                likesActuales + 1;


            // 7. Actualizar el contador en Supabase
            const { error } = await supabase
                .from('ranking')
                .update({
                    likes: nuevosLikes
                })
                .eq('id_ranking', idRanking);


            if (error) {
                console.error(
                    'Error al registrar like:',
                    error
                );

                return;
            }


            // 8. Actualizar el número en pantalla
            contador.textContent =
                nuevosLikes;
        });

    });

}


// Ejecutar la función al cargar la página
cargarRestaurantes();