import { defineNuxtConfig } from 'nuxt'
import postcssConfig from './postcss.config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    head: {
        title: 'fajarbc.github.io',
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: '' },
          { name: 'format-detection', content: 'telephone=no' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },

    build: {
      postcss: {
        postcssOptions: postcssConfig,
      },
    },
    modules: ['@nuxtjs/color-mode'],
    colorMode: {
      preference: 'wireframe', // default theme
      dataValue: 'theme', // activate data-theme in <html> tag
    },
})
