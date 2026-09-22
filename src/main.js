import { supabase} from './supabase.js';

async function cargarPiscinas() {
    const {data, error} = await supabase
           .from('piscinas')
           .select('*');

    if (error){
        console.error('Error al cargar piscinas:', error);
        return;
    }

    console.log(data);

}


async function cargarRestaurantes() {
    const {data, error} = await supabase
           .from('restaurantes')
           .select('*');

    if (error){
        console.error('Error al cargar restaurantes:', error);
        return;
    }

    console.log(data);
}

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
        console.error('Error al cargar ranking:', error);
        return;
    }

    const listaRanking = document.getElementById('listaRanking');

    listaRanking.innerHTML = '';

    data.forEach((registro, posicion) => {

        const nombre =
            registro.piscinas?.nombre_pisci ||
            registro.restaurantes?.nombre_rest;

        const elemento = document.createElement('div');

        elemento.classList.add('ranking-item');

        elemento.innerHTML = `
            <span>${posicion + 1}. ${nombre}</span>
            <span class="likes">
                <svg class="icono-like" viewBox="0 0 24 24">
                    <path d="M7 10v12H3V10h4zm2 12V10l4-8c1.1 0 2 .9 2 2v4h4.7c1.3 0 2.3 1.2 2 2.5l-1.5 8c-.2 1-1 1.5-2 1.5H9z"/>
                </svg>

                ${registro.likes}
            </span>
        `;

        listaRanking.appendChild(elemento);
    });

}

cargarPiscinas();
cargarRestaurantes();
cargarRanking();