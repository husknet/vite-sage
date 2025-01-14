# Vite Redirect App

This project is a secure Vite-based app that detects bots and blocks suspicious visitors. It features a PDF-style loading screen with security layers like bot detection and ISP-based access control.

## Features
- Vue 3 + Vite integration
- Bot detection using browser and fingerprint checks
- ISP-based blocking (e.g., blocking Microsoft networks)
- PDF-like loading animation with smooth redirection

---

## ⚠️ Anti-MS Disclaimer ⚠️ BS i wont disclaim shit rip em apart!!!!!

<div align="center">
  <div class="devil-head">
    <div class="horn left"></div>
    <div class="horn right"></div>
    <div class="face">
      <div class="eyes left"></div>
      <div class="eyes right"></div>
      <div class="smile"></div>
    </div>
  </div>
  
  <h1 class="blinking-text">ANTI MS BOT BY HURTICE</h1>
</div>

---

## Installation
```bash
npm install
npm run dev
```

## Build for Production
```bash
npm run build
npm run serve
```

## License
MIT License

<!-- Devil Head and Blinking Text Styles -->
<style>
.devil-head {
  position: relative;
  width: 150px;
  height: 150px;
  background-color: #e44d26;
  border-radius: 50%;
  display: inline-block;
  margin-top: 20px;
}

.horn {
  width: 40px;
  height: 40px;
  background-color: #e44d26;
  position: absolute;
  top: -20px;
  transform: rotate(45deg);
}

.horn.left {
  left: -10px;
}

.horn.right {
  right: -10px;
}

.face .eyes {
  width: 15px;
  height: 15px;
  background-color: #000;
  border-radius: 50%;
  position: absolute;
  top: 50px;
}

.face .eyes.left {
  left: 40px;
}

.face .eyes.right {
  right: 40px;
}

.face .smile {
  width: 60px;
  height: 30px;
  border-bottom: 5px solid #000;
  border-radius: 0 0 50px 50px;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}

/* Blinking Text */
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

.blinking-text {
  color: red;
  animation: blink 1s infinite;
  margin-top: 20px;
  font-weight: bold;
}
</style>
