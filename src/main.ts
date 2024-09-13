import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '/@/App.vue'
import router from '/@/router'
import '@vuepic/vue-datepicker/dist/main.css'

import '/@/styles/global.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Font-awesome
import FontAwesomeIcon from './fontawesome-icons'
import { aliases, fa } from 'vuetify/iconsets/fa-svg'
const app = createApp(App)

// CUstom theme
const customLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#6200EE',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: { customLightTheme },
  },
})

app.config.globalProperties.nightNightSix = 996

// Register chart stuff
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  Colors,
  BarElement,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
ChartJS.register(
  CategoryScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  BarElement,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Filler,
  ChartDataLabels,
)

// Disable labels as default
ChartJS.defaults.set('plugins.datalabels', {
  display: false,
})

// Custom colour scheme
import autocolors from 'chartjs-plugin-autocolors'
import { BACKGROUND_COLOURS, BORDER_COLOURS } from '/@/utils/constants'
ChartJS.register(autocolors)

ChartJS.defaults.set('plugins.autocolors', {
  customize(_ctx: any) {
    return {
      background: BACKGROUND_COLOURS,
      border: BORDER_COLOURS,
    }
  },
})

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(router)
app.use(createPinia())
app.use(vuetify)
app.mount('#app')
