import svgLoader from 'vite-svg-loader';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_URL,
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Loka Store Admin',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap',
        },
      ],
    },
  },

  modules: ['@pinia/nuxt', '@nuxt/devtools'],

  css: ['@/assets/style/tailwind.css'],

  vite: {
    plugins: [svgLoader(), tailwindcss()],
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
    resolve: {},
  },

  nitro: {},

  devtools: {
    enabled: true,
  },

  devServer: {
    port: 8080,
    host: 'localhost',
  },

  compatibilityDate: '2024-12-05',
});
