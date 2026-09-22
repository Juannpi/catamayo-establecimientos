import { supabase } from './supabase.js';

async function cargarPiscinas() {

    // 1. Obtener las piscinas
    const { data: piscinas, error: errorPiscinas } = await supabase
        .from('piscinas')
        .select('*')
        .order('id_pisci', { ascending: true });

    if (errorPiscinas) {
        console.error(
            'Error al cargar piscinas:',
            errorPiscinas
        );

        return;
    }


    // 2. Obtener registros del ranking
    const { data: ranking, error: errorRanking } = await supabase
        .from('ranking')
        .select('id_ranking, id_pisci, likes');

    if (errorRanking) {
        console.error(
            'Error al cargar ranking:',
            errorRanking
        );

        return;
    }


    // 3. Obtener el contenedor HTML
    const listaPiscinas =
        document.getElementById('listaPiscinas');

    listaPiscinas.innerHTML = '';


    // 4. Crear las tarjetas
    piscinas.forEach((piscina) => {

        const registroRanking = ranking.find(
            (item) => item.id_pisci === piscina.id_pisci
        );


        const tarjeta =
            document.createElement('article');

        tarjeta.classList.add(
            'tarjeta-establecimiento'
        );


        tarjeta.innerHTML = `
            <img
                src="${piscina.imagen_url}"
                alt="${piscina.nombre_pisci}"
                class="imagen-establecimiento"
            >

            <div class="informacion-establecimiento">

                <h2>
                    ${piscina.nombre_pisci}
                </h2>

                <p>
                    <strong>Horario:</strong>
                    ${piscina.horarios}
                </p>

                <p>
                    <strong>Precio:</strong>
                    $${piscina.precio}
                </p>

                <a
                    href="${piscina.ubicacion_url}"
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


        listaPiscinas.appendChild(tarjeta);

    });


    // 5. Buscar botones de like
    const botonesLike =
        document.querySelectorAll('.boton-like');


    // 6. Agregar evento click
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


            // 7. Actualizar Supabase
            const { error } = await supabase
                .from('ranking')
                .update({
                    likes: nuevosLikes
                })
                .eq(
                    'id_ranking',
                    idRanking
                );


            if (error) {

                console.error(
                    'Error al registrar like:',
                    error
                );

                return;
            }


            // 8. Actualizar pantalla
            contador.textContent =
                nuevosLikes;

        });

    });

}


cargarPiscinas();