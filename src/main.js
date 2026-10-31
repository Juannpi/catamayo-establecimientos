import { supabase } from './supabase.js';

const base = import.meta.env.BASE_URL;


/* =========================
   GALERÍA / CARRUSEL
========================= */

function cargarCarrusel() {

    const imagenesGaleria = [

        // =====================
        // PISCINAS
        // =====================

        'img/establecimientos/piscinas/elparaiso.png',
        'img/establecimientos/piscinas/elparaiso2.png',
        'img/establecimientos/piscinas/elparaiso3.png',
        'img/establecimientos/piscinas/elparaiso4.png',

        'img/establecimientos/piscinas/elvapor.png',
        'img/establecimientos/piscinas/elvapor2.png',
        'img/establecimientos/piscinas/elvapor3.png',

        'img/establecimientos/piscinas/labendita.png',
        'img/establecimientos/piscinas/labendita2.png',
        'img/establecimientos/piscinas/labendita3.png',
        'img/establecimientos/piscinas/labendita4.png',

        'img/establecimientos/piscinas/lalibertad.png',
        'img/establecimientos/piscinas/lalibertad2.png',
        'img/establecimientos/piscinas/lalibertad3.png',
        'img/establecimientos/piscinas/lalibertad4.png',

        'img/establecimientos/piscinas/lastorres.png',
        'img/establecimientos/piscinas/lastorres2.png',

        'img/establecimientos/piscinas/playaescondida.png',
        'img/establecimientos/piscinas/playaescondida2.png',
        'img/establecimientos/piscinas/playaescondida3.png',
        'img/establecimientos/piscinas/playaescondida4.png',


        // =====================
        // RESTAURANTES
        // =====================

        'img/establecimientos/restaurantes/botellagrill.png',
        'img/establecimientos/restaurantes/botellagrill2.png',
        'img/establecimientos/restaurantes/botellagrill3.png',
        'img/establecimientos/restaurantes/botellagrill4.png',

        'img/establecimientos/restaurantes/jonshous.png',
        'img/establecimientos/restaurantes/jonshous2.png',

        'img/establecimientos/restaurantes/pinchos.png',

        'img/establecimientos/restaurantes/moreno.png',
        'img/establecimientos/restaurantes/moreno 1.png',
        'img/establecimientos/restaurantes/moreno 2.png',

        'img/establecimientos/restaurantes/lamagdalena.png',
        'img/establecimientos/restaurantes/lamagdalena2.png',
        'img/establecimientos/restaurantes/lamagdalena3.png',
        'img/establecimientos/restaurantes/lamagdalena4.png',

        'img/establecimientos/restaurantes/parrilladaslojanito.png',
        'img/establecimientos/restaurantes/parrilladaslojanito2.png',
        'img/establecimientos/restaurantes/parrilladaslojanito3.png',
        'img/establecimientos/restaurantes/parrilladaslojanito4.png'

    ];


    const carruselLista =
        document.getElementById('carruselLista');

    const botonAnterior =
        document.getElementById('carruselAnterior');

    const botonSiguiente =
        document.getElementById('carruselSiguiente');


    carruselLista.innerHTML = '';


    /* =========================
       CREAR LAS IMÁGENES
    ========================= */

    imagenesGaleria.forEach((imagen) => {

        const elemento =
            document.createElement('div');

        elemento.classList.add(
            'carrusel-imagen'
        );

        elemento.innerHTML = `
            <img
                src="${base}${imagen}"
                alt="Galería de establecimientos de Catamayo"
            >
        `;

        carruselLista.appendChild(
            elemento
        );

    });


    /* =========================
       BOTÓN ANTERIOR
    ========================= */

    botonAnterior.addEventListener('click', () => {

        carruselLista.scrollBy({
            left: -320,
            behavior: 'smooth'
        });

    });


    /* =========================
       BOTÓN SIGUIENTE
    ========================= */

    botonSiguiente.addEventListener('click', () => {

        carruselLista.scrollBy({
            left: 320,
            behavior: 'smooth'
        });

    });


    /* =========================
       CARRUSEL AUTOMÁTICO
    ========================= */

    function iniciarCarruselAutomatico() {

        return setInterval(() => {

            const llegoAlFinal =
                carruselLista.scrollLeft +
                carruselLista.clientWidth
                >=
                carruselLista.scrollWidth - 5;


            if (llegoAlFinal) {

                carruselLista.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });

            } else {

                carruselLista.scrollBy({
                    left: 320,
                    behavior: 'smooth'
                });

            }

        }, 3000);

    }


    let carruselAutomatico =
        iniciarCarruselAutomatico();


    /* =========================
       PAUSAR AL PONER EL MOUSE
    ========================= */

    carruselLista.addEventListener(
        'mouseenter',
        () => {

            clearInterval(
                carruselAutomatico
            );

        }
    );


    /* =========================
       CONTINUAR AL QUITAR MOUSE
    ========================= */

    carruselLista.addEventListener(
        'mouseleave',
        () => {

            carruselAutomatico =
                iniciarCarruselAutomatico();

        }
    );

}


/* =========================
   RANKING
========================= */

async function cargarRanking() {

    const { data, error } = await supabase
        .from('ranking')
        .select(`
            id_ranking,
            likes,
            tipo_establecimiento,
            piscinas (nombre_pisci),
            restaurantes (nombre_rest)
        `)
        .order('likes', { ascending: false })
        .limit(5);


    if (error) {

        console.error(
            'Error al cargar ranking:',
            error
        );

        return;
    }


    const listaRanking =
        document.getElementById(
            'listaRanking'
        );


    listaRanking.innerHTML = '';


    data.forEach((registro, posicion) => {

        const nombre =
            registro.piscinas?.nombre_pisci ||
            registro.restaurantes?.nombre_rest;


        const elemento =
            document.createElement('div');


        elemento.classList.add(
            'ranking-item'
        );


        elemento.innerHTML = `
            <span>
                ${posicion + 1}. ${nombre}
            </span>

            <span class="likes">

                <svg
                    class="icono-like"
                    viewBox="0 0 24 24"
                >
                    <path d="M7 10v12H3V10h4zm2 12V10l4-8c1.1 0 2 .9 2 2v4h4.7c1.3 0 2.3 1.2 2 2.5l-1.5 8c-.2 1-1 1.5-2 1.5H9z"/>
                </svg>

                ${registro.likes}

            </span>
        `;


        listaRanking.appendChild(
            elemento
        );

    });

}


/* =========================
   EJECUTAR FUNCIONES
========================= */

cargarRanking();
cargarCarrusel();