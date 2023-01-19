import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

document.body.addEventListener('drop', (_e) => {
    
    (window as any).hasEventSomewhere = true
})