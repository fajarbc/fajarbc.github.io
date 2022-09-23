import { defineNuxtConfig } from 'nuxt'
import postcssConfig from './postcss.config'
const fullName = process.env.VITE_FULLNAME

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    meta: {
        title: fullName,
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: `${fullName} page` },
          { name: 'format-detection', content: 'telephone=no' },
        ],
        link: [{ rel: 'icon', href: '/assets/images/favicon.ico' }],
    },

    build: {
      postcss: {
        postcssOptions: postcssConfig,
      },
      transpile: ['@headlessui/vue'],
    },
    target: 'static',
    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
    colorMode: {
      preference: 'wireframe', // default theme
      dataValue: 'theme', // activate data-theme in <html> tag
    }
})
