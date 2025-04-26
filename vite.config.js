import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',  // Plus léger que Terser
    target: 'es2015',   // Cible des navigateurs plus anciens
    cssCodeSplit: false, // Réduit le nombre de fichiers CSS
    assetsInlineLimit: 4096, // Limite l'inlining des assets
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: undefined, // Désactive le chunking automatique
        inlineDynamicImports: true // Réduit le nombre de fichiers générés
      },
      treeshake: 'safest' // Mode de treeshaking moins intensif
    }
  }
})