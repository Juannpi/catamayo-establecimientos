import { defineConfig } from 'vite';

export default defineConfig({
    base: '/catamayo-establecimientos/',

    build: {
        rollupOptions: {
            input: {
                inicio: 'index.html',
                restaurantes: 'restaurantes.html',
                piscinas: 'piscinas.html'
            }
        }
    }
});