import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/subliarte_sistema/', // Nome do seu repositório
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',  // Certifique-se de que o caminho está correto
  },
});
