// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Vue3EasyDataTable from 'vue3-easy-data-table'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import VueDatePicker from '@vuepic/vue-datepicker'
import vSelect from 'vue-select'

import './index.css'
import 'vue3-easy-data-table/dist/style.css'
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-select/dist/vue-select.css'

const app = createApp(App)

app.use(router)
app.component('EasyDataTable', Vue3EasyDataTable)
app.component('VueDatePicker', VueDatePicker)
app.component('v-select', vSelect)
app.component('apex-chart', VueApexCharts)
app.mount('#app')
