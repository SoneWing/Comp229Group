/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})*/
/*
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: "./src/main.jsx",
    },
  },
});
*/

import dotenv from 'dotenv';
dotenv.config();

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const { PORT = 3000 } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic' // Add this line
  }
)],
server: {
  proxy: {
    '/api': {
      target: `http://localhost:${PORT}`,
      changeOrigin: true,
    },
  },
},
build: {
  manifest: true,
  rollupOptions: {
    input: "./src/main.jsx",
  },
},
});
