import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import main_app from './app.js'

const vuetify = createVuetify()

const app = createApp(main_app)

app.use(vuetify)
app.mount('#app')