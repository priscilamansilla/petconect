import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Rutas relativas en el build. Sin esto, el index.html compilado busca sus
  // archivos en /assets/... y, al abrir dist/index.html con doble clic desde
  // la computadora, esa barra inicial apunta a la raiz del disco y la pagina
  // queda en blanco. Va de la mano con el HashRouter de src/main.jsx.
  base: './',
})
