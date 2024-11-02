import { defineConfig } from 'vite'
import type { UserConfigExport, ConfigEnv } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import dotenv from 'dotenv' // Dotenv is a zero-dependency module that extracts the variables in the env variable from the '.env*' file

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vuetify from 'vite-plugin-vuetify'

interface ENV {
  [K: string]: string
}

const getEnv = (mode: string) => {
  const envFileName = `.env.${mode}`
  const envObject = Object.create(null) as ENV

  try {
    const envConfig = dotenv.parse(fs.readFileSync(envFileName))
    for (const k in envConfig) Object.assign(envObject, { [k]: envConfig[k] })
    return envObject
  } catch (error) {
    console.error(error)
    return envObject
  }
}

/**
 * https://vitejs.dev/config/
 */
const baseConfig: UserConfigExport = {
  plugins: [
    vue(),
    // Vuetify Loader
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
    vuetify({
      autoImport: true,
      // styles: { configFile: 'src/styles/settings.scss' },
    }),
    vueJsx({
      /**
       * options are passed on to @vue/babel-plugin-jsx
       * https://github.com/vuejs/jsx-next/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md
       */
      optimize: true,
      enableObjectSlots: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: '/@',
        replacement: resolve(__dirname, './src'),
      },
    ],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  optimizeDeps: {},
}

export default ({ command, mode }: ConfigEnv) => {
  /**
   * Such as:
   * import.meta.env.MODE: {string}       The mode of the app runtime.
   * import.meta.env.BASE_URL: {string}   The base URL for deploying the app. This is determined by the base configuration entry.
   * import.meta.env.PROD: {boolean}      Whether the app is runtime in the production environment.
   * import.meta.env.DEV: {boolean}       Whether app runtime is in the development environment (always the opposite of import.meta.env.PROD).
   */

  const { VITE_APP_NODE_ENV, VITE_APP_TITLE } = getEnv(mode)

  setTimeout(() => {
    console.log()
    console.log('\x1b[33m%s\x1b[0m', `🏭--NODE ENV (VITE_APP_NODE_ENV): ${VITE_APP_NODE_ENV}`)
    console.log('\x1b[36m%s\x1b[0m', `🏠--APP TITLE (VITE_APP_TITLE): ${VITE_APP_TITLE}`)
    console.log()
  }, 66)

  if (command === 'serve') {
    return defineConfig({ ...baseConfig })
  } else {
    return defineConfig({ ...baseConfig })
  }
}
