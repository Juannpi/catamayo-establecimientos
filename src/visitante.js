import zorroImg from './personajes/zorro.png';
import pandaImg from './personajes/panda.png';
import iguanaImg from './personajes/iguana.png';
import gatoImg from './personajes/gato.png';
import perroImg from './personajes/perro.png';

const codigoGuardado = localStorage.getItem('codigo_visitante');

if (!codigoGuardado) {
    mostrarSeleccionPersonaje();
}

function mostrarSeleccionPersonaje() {

    const ventana = document.createElement('div');
    ventana.classList.add('ventana-visitante');

    ventana.innerHTML = `
        <div class="seleccion-personaje">

            <h2>¡Bienvenido a Catamayo!</h2>

            <p>
                Elige a tu compañero de aventura para comenzar a explorar.
            </p>

            <div class="personajes">

                <button class="personaje" data-personaje="Zorro">
                    <img src="${zorroImg}" alt="Zorro">
                    <span>Zorro</span>
                </button>

                <button class="personaje" data-personaje="Panda">
                    <img src="${pandaImg}" alt="Panda">
                    <span>Panda</span>
                </button>

                <button class="personaje" data-personaje="Iguana">
                    <img src="${iguanaImg}" alt="Iguana">
                    <span>Iguana</span>
                </button>

                <button class="personaje" data-personaje="Gato">
                    <img src="${gatoImg}" alt="Gato">
                    <span>Gato</span>
                </button>

                <button class="personaje" data-personaje="Perro">
                    <img src="${perroImg}" alt="Perro">
                    <span>Perro</span>
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(ventana);

    const personajes = document.querySelectorAll('.personaje');

    personajes.forEach((boton) => {

        boton.addEventListener('click', () => {

            const personaje = boton.dataset.personaje;

            const serial = crypto.randomUUID()
                .slice(0, 6)
                .toUpperCase();

            const codigoVisitante = `${personaje}-${serial}`;

            localStorage.setItem('personaje', personaje);
            localStorage.setItem('codigo_visitante', codigoVisitante);

            ventana.remove();

            console.log('Visitante:', codigoVisitante);
        });
    });
}