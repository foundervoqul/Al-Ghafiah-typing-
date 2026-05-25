/* ═══════════════════════════════════════════════
   AL GHAFIAH — Shared JavaScript (app.js)
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── AMBIENT PARTICLES ── */
  (function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particles';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H, pts = [], animId;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 45; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.2,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.28 - 0.06,
        a: Math.random() * 0.35 + 0.08,
        pulse: Math.random() * Math.PI * 2
      });
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.pulse += 0.018;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216,169,63,${alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        if (p.x < -6) p.x = W + 6;
        if (p.x > W + 6) p.x = -6;
      });
      animId = requestAnimationFrame(loop);
    }
    loop();
  })();

  /* ── NAV TOGGLE (mobile) ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close nav when a link is tapped
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── SCROLL ANIMATIONS ── */
  const animEls = document.querySelectorAll('.animate-fade-up');
  if (animEls.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
      },
      { threshold: 0.12 }
    );
    animEls.forEach(el => observer.observe(el));
  }

  /* ── CHATBOT ── */
  const orb   = document.getElementById('chat-orb');
  const panel = document.getElementById('chat-panel');

  if (!orb || !panel) return;

  const msgsEl   = panel.querySelector('.chat-messages');
  const quickEl  = panel.querySelector('.chat-quick');
  const inputEl  = panel.querySelector('.chat-input');
  const sendBtn  = panel.querySelector('.chat-send');
  const closeBtn = panel.querySelector('.chat-close');

  // Initial greeting
  if (msgsEl && msgsEl.children.length === 0) {
    addMsg('Welcome to AL GHAFIAH! How can I assist you today? Ask about our services, location, or book an appointment.', 'bot');
  }

  // Quick chips
  const chips = [
    { label: 'Services',   msg: 'What services do you offer?' },
    { label: 'Location',   msg: 'Where are you located?' },
    { label: 'Gate Pass',  msg: 'How do I book a Gate Pass?' },
    { label: 'Hours',      msg: 'What are your working hours?' }
  ];
  if (quickEl && quickEl.children.length === 0) {
    chips.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'quick-chip';
      btn.textContent = c.label;
      btn.addEventListener('click', () => {
        addMsg(c.msg, 'user');
        setTimeout(() => addMsg(getReply(c.msg), 'bot'), 500);
      });
      quickEl.appendChild(btn);
    });
  }

  const responses = {
    'services':     'We offer 19 professional services including Sharjah Ports Gate Pass Typing, Arabic/English/Urdu/Hindi translation, Emirates ID, Immigration Applications, Trade License, and more. Visit our Services page for the full list!',
    'location':     'We are located in Rolla, Sharjah, UAE — conveniently situated for all your document needs. 📍',
    'gate pass':    'Gate Pass Typing is our most popular service! We handle all Sharjah Ports Gate Pass applications with precision and speed. WhatsApp us at 055-5533183 to get started.',
    'hours':        'Please contact us via WhatsApp (055-5533183) or call 055-4526063 for our current working hours. We operate 6 days a week.',
    'book':         'You can book online via our Contact page, WhatsApp us at 055-5533183, or call 055-4526063.',
    'contact':      'WhatsApp: 055-5533183 | Office: 055-4526063 | Email: mrfazmi@gmail.com',
    'translation':  'We provide professional translation in Arabic, English, Urdu, and Hindi. Certified and accurate every time.',
    'emirates id':  'We assist with Emirates ID applications and renewals. Fast, accurate, and hassle-free.',
    'trade license':'We handle Trade License applications for new businesses and renewals in Sharjah, including MOA and LLC agreements.',
    'immigration':  'We assist with typing immigration applications, residence visa forms, and related documents.',
    'attestation':  'We assist with preparing Indian certificates for the attestation process.',
    'rubber stamp': 'We produce custom rubber stamps for businesses and individuals. Contact us for pricing and turnaround times.',
    'email':        'You can reach us at mrfazmi@gmail.com (main) or easyway850@gmail.com (support).',
    'whatsapp':     'Our WhatsApp number is 055-5533183. Message us for the fastest response!'
  };

  function getReply(text) {
    text = text.toLowerCase();
    for (const [key, val] of Object.entries(responses)) {
      if (text.includes(key)) return val;
    }
    return "Thank you for reaching out to AL GHAFIAH! For immediate assistance, please WhatsApp us at 055-5533183 or visit our Services page. We're here to help!";
  }

  function addMsg(text, type) {
    if (!msgsEl) return;
    const div = document.createElement('div');
    div.className = `msg msg-${type}`;
    div.textContent = text;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function sendMessage() {
    if (!inputEl) return;
    const text = inputEl.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    inputEl.value = '';
    setTimeout(() => addMsg(getReply(text), 'bot'), 600);
  }

  orb.addEventListener('click', () => panel.classList.toggle('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('open'));
  if (sendBtn)  sendBtn.addEventListener('click', sendMessage);
  if (inputEl)  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  /* ── CONTACT FORM (email mailto fallback) ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this));
      const subject = encodeURIComponent(`Booking Request — ${data.service || 'Service'}`);
      const body = encodeURIComponent(
        `Name: ${data.name || ''}\nPhone: ${data.phone || ''}\nEmail: ${data.email || ''}\nService: ${data.service || ''}\n\nMessage:\n${data.message || ''}`
      );
      window.location.href = `mailto:mrfazmi@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ── FEEDBACK FORM ── */
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this));
      const subject = encodeURIComponent(`Customer Feedback — ${data.rating || ''} Stars`);
      const body = encodeURIComponent(
        `Name: ${data.name || ''}\nRating: ${data.rating || ''}/5\n\nFeedback:\n${data.message || ''}`
      );
      window.location.href = `mailto:mrfazmi@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ── SERVICE BOOKING HELPERS (services.html) ── */
  window.bookService = function (service) {
    const subject = encodeURIComponent(`Booking Request — ${service}`);
    const body    = encodeURIComponent(`Hello AL GHAFIAH,\n\nI would like to book the following service:\n${service}\n\nPlease contact me to confirm.`);
    window.location.href = `mailto:mrfazmi@gmail.com?subject=${subject}&body=${body}`;
  };

  window.bookWhatsApp = function (service) {
    const msg = encodeURIComponent(`Hello AL GHAFIAH, I would like to book: ${service}`);
    window.open(`https://wa.me/971555533183?text=${msg}`, '_blank');
  };

  window.waBookSelected = function () {
    const sel = document.getElementById('wa-service');
    const service = (sel && sel.value) ? sel.value : 'a service';
    const msg = encodeURIComponent(`Hello AL GHAFIAH, I would like to book: ${service}`);
    window.open(`https://wa.me/971555533183?text=${msg}`, '_blank');
  };

})();
