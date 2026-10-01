import { supabase } from './supabase.js';


function mostrarAviso(mensaje) {

    const aviso = document.createElement('div');

    aviso.classList.add('aviso-fondo');

    aviso.innerHTML = `
        <div class="aviso">
            <h3>El sistema te informa</h3>

            <p>${mensaje}</p>

            <button class="cerrar-aviso">
                Aceptar
            </button>
        </div>
    `;

    document.body.appendChild(aviso);

    const botonCerrar =
        aviso.querySelector('.cerrar-aviso');

    botonCerrar.addEventListener('click', () => {
        aviso.remove();
    });
}


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


    // 2. Obtener los registros del ranking
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


    // 3. Obtener el contenedor del HTML
    const listaPiscinas =
        document.getElementById('listaPiscinas');


    listaPiscinas.innerHTML = '';


    // 4. Crear una tarjeta por cada piscina
    piscinas.forEach((piscina) => {

        const registroRanking = ranking.find(
            (item) => item.id_pisci === piscina.id_pisci
        );


        // Si no existe un registro en ranking
        if (!registroRanking) {

            console.error(
                'No existe ranking para:',
                piscina.nombre_pisci
            );

            return;
        }


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


    // 5. Buscar todos los botones de like
    const botonesLike =
        document.querySelectorAll('.boton-like');


    // 6. Agregar evento click a cada botón
    botonesLike.forEach((boton) => {

        boton.addEventListener(
            'click',
            async () => {

                const idRanking =
                    boton.dataset.ranking;


                const contador =
                    boton.querySelector(
                        '.contador-like'
                    );


                // Obtener el visitante actual
                const codigoVisitante =
                    localStorage.getItem(
                        'codigo_visitante'
                    );


                if (!codigoVisitante) {

                    mostrarAviso(
                        'Primero debes elegir tu personaje.'
                    );

                    return;
                }


                // 7. Intentar registrar el voto
                const { error } = await supabase
                    .from('votos')
                    .insert({
                        codigo_visitante: codigoVisitante,
                        id_ranking: idRanking
                    });


                // 8. Comprobar si hubo error
                if (error) {

                    if (error.code === '23505') {

                        mostrarAviso(
                            'Ya votaste por este establecimiento.'
                        );

                    } else {

                        console.error(
                            'Error al registrar voto:',
                            error
                        );
                    }

                    return;
                }


                // 9. Actualizar visualmente el contador
                const likesActuales =
                    Number(
                        contador.textContent
                    );


                contador.textContent =
                    likesActuales + 1;

            }
        );

    });

}


// 10. Ejecutar al cargar la página
cargarPiscinas();