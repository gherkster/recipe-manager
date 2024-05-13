import visualizer from "rollup-plugin-visualizer";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    /*
      Force all routes to prerender.
      This fixes an issue with calls to /api/recipes/<id> working for a hard reload,
      but still being made on client side navigation
    */
    "/**": { prerender: true },
  },
  nitro: {
    prerender: {
      // Disable to prevent unnecessary trailing slash redirects
      // https://community.cloudflare.com/t/removing-trailing-slash-on-static-websites/583429/3
      autoSubfolderIndex: false,
    },
  },
  appConfig: {
    searchIndex: {
      hash: "",
    },
    externalBaseUrl: "", // Overridden by recipe module
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          /*
            Fix nuxt always generating a new entry filename based on the build ID,
            which subsequently means all other scripts will also be renamed and have their cache invalidated
            https://github.com/nuxt/nuxt/issues/25133
          */
          entryFileNames: "_nuxt/[name].js",
        },
      },
    },
    plugins: [
      visualizer({
        gzipSize: true,
      }),
      Icons({
        defaultStyle: "font-size: 24px",
        defaultClass: "icon",
        autoInstall: true,
        customCollections: {
          custom: FileSystemIconLoader("./assets/icons"),
        },
      }),
    ],
  },
  modules: ["unplugin-icons/nuxt", "@nuxt/fonts", "@nuxtjs/sitemap", "@vite-pwa/nuxt"],
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    baseUrl: "", // Overridden by .env NUXT_BASE_URL
    cfAccessClientId: "", // Overridden by .env NUXT_CF_ACCESS_CLIENT_ID
    cfAccessClientSecret: "", // Overridden by .env NUXT_CF_ACCESS_CLIENT_SECRET
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "My PWA",
      icons: [
        {
          src: "android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,json,png,svg,ico}"],
      dontCacheBustURLsMatching: /.*/i, // TODO: Match anything - may want to revisit
      runtimeCaching: [
        {
          // Match /recipes/*
          urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.match(/^\/(recipes)\/.*/i),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'site-cache',
            matchOptions: {
              ignoreSearch: true,
            },
          },
        },
      ],
    },
  },
  alias: {
    common: fileURLToPath(new URL("../common", import.meta.url)),
  },
  fonts: {
    defaults: {
      weights: [400],
    },
  },
  app: {
    head: {
      meta: [
        {
          name: "color-scheme",
          content: "light dark",
        },
      ],
      htmlAttrs: {
        lang: "en",
      },
    },
  },
});
