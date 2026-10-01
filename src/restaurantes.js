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
async function cargarRestaurantes() {

    // 1. Obtener los restaurantes
    const { data: restaurantes, error: errorRestaurantes } = await supabase
        .from('restaurantes')
        .select('*')
        .order('id_rest', { ascending: true });


    if (errorRestaurantes) {
        console.error(
            'Error al cargar restaurantes:',
            errorRestaurantes
        );

        return;
    }


    // 2. Obtener los registros del ranking
    const { data: ranking, error: errorRanking } = await supabase
        .from('ranking')
        .select('id_ranking, id_rest, likes');


    if (errorRanking) {
        console.error(
            'Error al cargar ranking:',
            errorRanking
        );

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


        // Si no existe un registro en ranking, no crear la tarjeta
        if (!registroRanking) {
            console.error(
                'No existe ranking para:',
                restaurante.nombre_rest
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
                src="${restaurante.imagen_url}"
                alt="${restaurante.nombre_rest}"
                class="imagen-establecimiento"
            >

            <div class="informacion-establecimiento">

                <h2>
                    ${restaurante.nombre_rest}
                </h2>

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


                // Obtener el identificador del visitante
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

                    // Código PostgreSQL para UNIQUE repetido
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


                // 9. Actualizar el contador en pantalla
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
cargarRestaurantes();