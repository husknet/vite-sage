import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ Maps '@' to 'src' folder
    },
  },
  base: '/', // Ensures correct asset paths on Vercel
});
