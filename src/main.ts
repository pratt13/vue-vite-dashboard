import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '/@/App.vue'
import router from '/@/router'
import '@vuepic/vue-datepicker/dist/main.css'

import '/@/styles/global.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Font-awesome
import FontAwesomeIcon from './fontawesome-icons'
import { aliases, fa } from 'vuetify/iconsets/fa-svg'

const app = createApp(App)

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
})

app.config.globalProperties.nightNightSix = 996

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(router)
app.use(createPinia())
app.use(vuetify)
app.mount('#app')
