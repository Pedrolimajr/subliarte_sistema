import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/subliarte_sistema/', // Nome do seu repositório
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',  // Certifique-se de que o caminho está correto
  },
  build: {
    chunkSizeWarningLimit: 600, // Ajuste para o valor desejado, em kB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.split('node_modules/')[1].split('/')[0].toString(); // Divide os módulos de node_modules em seus próprios chunks
          }
        }
      }
    }
  }
});
