import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: mode === 'production' ? '/fajarbc.github.io/' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.IS_AVAILABLE_FOR_HIRE': JSON.stringify(env.IS_AVAILABLE_FOR_HIRE),
        'process.env.CONTACT_EMAIL': JSON.stringify(env.CONTACT_EMAIL),
        'process.env.GITHUB_URL': JSON.stringify(env.GITHUB_URL),
        'process.env.LINKEDIN_URL': JSON.stringify(env.LINKEDIN_URL),
        'process.env.PHONE_NUMBER': JSON.stringify(env.PHONE_NUMBER),
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
