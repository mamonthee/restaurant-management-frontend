import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import $ from 'jquery';
import '@/style.css';
import axios from 'axios';

window.$ = $;
window.jQuery = $;

// Function to load the configuration file
async function loadConfig() {
  try {
    const response = await fetch('/config/config.json'); // Load config.json
    const config = await response.json();

    // Set axios base URL from the config file
    if (config.VUE_APP_API_BASE_URL) {
      axios.defaults.baseURL = config.VUE_APP_API_BASE_URL;
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

// Load config and start Vue app after loading
loadConfig().then(() => {
  // Initialize Vue app only after the config has been loaded
  createApp(App).use(router).mount('#app');
});
