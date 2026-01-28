import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.IS_AVAILABLE_FOR_HIRE': JSON.stringify(env.IS_AVAILABLE_FOR_HIRE),
        'process.env.CONTACT_EMAIL': JSON.stringify(env.CONTACT_EMAIL),
        'process.env.URL_GITHUB': JSON.stringify(env.URL_GITHUB),
        'process.env.LINKEDIN_URL': JSON.stringify(env.LINKEDIN_URL),
        'process.env.FULL_NAME': JSON.stringify(env.FULL_NAME),
        'process.env.JOB_TITLE': JSON.stringify(env.JOB_TITLE),
        'process.env.CAREER_START_DATE': JSON.stringify(env.CAREER_START_DATE)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
