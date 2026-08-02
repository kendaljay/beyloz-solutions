// ============ Beyloz Solutions — shared interactivity ============

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky nav background on scroll ---- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
  }

  /* ---- Dark mode ---- */
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const stored = localStorage.getItem('beyloz-theme');
  if (stored) root.setAttribute('data-theme', stored);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.setAttribute('data-theme', 'dark');

  const syncIcon = () => {
    if (!toggle) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    toggle.innerHTML = isDark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round"><path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2Z"/></svg>';
  };
  syncIcon();
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('beyloz-theme', next);
      syncIcon();
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---- Chat widget ---- */
  const chatFab = document.querySelector('.fab-chat');
  const chatWindow = document.querySelector('.chat-window');
  const chatClose = document.querySelector('.chat-close');
  const chatForm = document.querySelector('.chat-input-row');
  const chatBody = document.querySelector('.chat-body');

  if (chatFab && chatWindow) {
    chatFab.addEventListener('click', () => chatWindow.classList.toggle('open'));
  }
  if (chatClose && chatWindow) {
    chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));
  }
  if (chatForm && chatBody) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = chatForm.querySelector('input');
      const val = input.value.trim();
      if (!val) return;
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.style.alignSelf = 'flex-end';
      userBubble.style.background = 'var(--accent)';
      userBubble.style.color = '#fff';
      userBubble.textContent = val;
      chatBody.appendChild(userBubble);
      input.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(() => {
        const bot = document.createElement('div');
        bot.className = 'chat-bubble bot';
        bot.textContent = 'Danke für Ihre Nachricht! Ein Berater von Beyloz Solutions meldet sich in Kürze bei Ihnen. Für eine schnellere Antwort erreichen Sie uns auch telefonisch.';
        chatBody.appendChild(bot);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 700);
    });
  }

  /* ---- Contact form (Formspree) ---- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Wird gesendet …';
      btn.disabled = true;
      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then((response) => {
          btn.textContent = response.ok ? 'Nachricht gesendet ✓' : 'Fehler — bitte erneut versuchen';
          if (response.ok) contactForm.reset();
        })
        .catch(() => { btn.textContent = 'Fehler — bitte erneut versuchen'; })
        .finally(() => {
          setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2600);
        });
    });
  }

  /* ---- Newsletter form (Brevo, submits to hidden iframe) ---- */
  const newsletterForm = document.querySelector('#newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', () => {
      const btn = newsletterForm.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Angemeldet ✓';
      btn.disabled = true;
      setTimeout(() => {
        newsletterForm.reset();
        btn.textContent = original;
        btn.disabled = false;
      }, 2600);
    });
  }

});
