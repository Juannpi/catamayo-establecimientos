import { defineConfig } from 'vite';

export default defineConfig({
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