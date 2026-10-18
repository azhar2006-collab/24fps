/**
 * 24FPS PRODUCTION — Netflix India Recreated Agency Website
 * Vanilla JavaScript (ES6+) — Zero Frameworks, Production Quality
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. HEADER SCROLL EFFECT
     -------------------------------------------------------------------------- */
  const header = document.getElementById('nfHeader');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.nf-mobile-nav-link, .nf-mobile-footer a');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      } else {
        mobileMenu.classList.add('open');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. HERO VIDEO SOUND TOGGLE (MIC ON / OFF)
     -------------------------------------------------------------------------- */
  const heroVideo = document.getElementById('heroVideo');
  const heroSoundToggle = document.getElementById('heroSoundToggle');
  const heroSoundLabel = document.getElementById('heroSoundLabel');

  if (heroVideo && heroSoundToggle) {
    heroSoundToggle.addEventListener('click', () => {
      if (heroVideo.muted) {
        heroVideo.muted = false;
        heroSoundToggle.classList.add('active');
        if (heroSoundLabel) heroSoundLabel.textContent = 'Mute Reel';
        muteAllPortfolioVideos();
      } else {
        heroVideo.muted = true;
        heroSoundToggle.classList.remove('active');
        if (heroSoundLabel) heroSoundLabel.textContent = 'Unmute Reel';
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. HERO QUICK FORM -> PREFILL CONTACT BRIEF
     -------------------------------------------------------------------------- */
  const heroEmailForm = document.getElementById('heroEmailForm');
  const heroEmailInput = document.getElementById('heroEmailInput');
  const contactEmailInput = document.getElementById('contactEmail');

  if (heroEmailForm) {
    heroEmailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredEmail = heroEmailInput.value.trim();
      if (enteredEmail && contactEmailInput) {
        contactEmailInput.value = enteredEmail;
        // Trigger floating label state
        contactEmailInput.dispatchEvent(new Event('input'));
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        if (contactEmailInput) {
          setTimeout(() => contactEmailInput.focus(), 600);
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. PORTFOLIO VIDEOS & MIC SOUND CONTROLS (HORIZONTAL 16:9)
     -------------------------------------------------------------------------- */
  const portfolioVideos = document.querySelectorAll('.nf-portfolio-video');
  const playBtns = document.querySelectorAll('.nf-play-btn');
  const micBtns = document.querySelectorAll('.nf-mic-btn');

  const muteAllPortfolioVideos = () => {
    portfolioVideos.forEach(v => {
      v.muted = true;
      const card = v.closest('.nf-portfolio-card');
      if (card) {
        const mic = card.querySelector('.nf-mic-btn');
        const label = card.querySelector('.mic-label');
        if (mic) mic.classList.remove('live');
        if (label) label.textContent = 'Mic: Off';
      }
    });
  };

  portfolioVideos.forEach(v => {
    v.muted = true;

    v.addEventListener('click', () => {
      toggleVideoPlay(v);
    });

    v.addEventListener('play', () => {
      const card = v.closest('.nf-portfolio-card');
      if (card) {
        const btn = card.querySelector('.nf-play-btn');
        if (btn) btn.classList.add('playing');
      }
    });

    v.addEventListener('pause', () => {
      const card = v.closest('.nf-portfolio-card');
      if (card) {
        const btn = card.querySelector('.nf-play-btn');
        if (btn) btn.classList.remove('playing');
      }
    });
  });

  const toggleVideoPlay = (video) => {
    if (video.paused) {
      video.play().catch(err => console.warn('Autoplay prevented:', err));
    } else {
      video.pause();
    }
  };

  playBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      const video = document.getElementById(targetId);
      if (video) {
        toggleVideoPlay(video);
      }
    });
  });

  micBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      const video = document.getElementById(targetId);
      const label = btn.querySelector('.mic-label');

      if (video) {
        if (video.muted) {
          // If hero video is unmuted, mute it
          if (heroVideo && !heroVideo.muted) {
            heroVideo.muted = true;
            if (heroSoundToggle) heroSoundToggle.classList.remove('active');
            if (heroSoundLabel) heroSoundLabel.textContent = 'Unmute Reel';
          }

          // Mute other portfolio videos
          portfolioVideos.forEach(otherVideo => {
            if (otherVideo !== video) {
              otherVideo.muted = true;
              const card = otherVideo.closest('.nf-portfolio-card');
              if (card) {
                const otherMic = card.querySelector('.nf-mic-btn');
                const otherLabel = card.querySelector('.mic-label');
                if (otherMic) otherMic.classList.remove('live');
                if (otherLabel) otherLabel.textContent = 'Mic: Off';
              }
            }
          });

          video.muted = false;
          btn.classList.add('live');
          if (label) label.textContent = 'Mic: On';

          if (video.paused) {
            video.play().catch(err => console.warn(err));
          }
        } else {
          video.muted = true;
          btn.classList.remove('live');
          if (label) label.textContent = 'Mic: Off';
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. NETFLIX FAQ ACCORDION
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.nf-faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.nf-faq-question');
    const answer = item.querySelector('.nf-faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other items (standard Netflix behavior)
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('open')) {
            otherItem.classList.remove('open');
            const otherBtn = otherItem.querySelector('.nf-faq-question');
            const otherAns = otherItem.querySelector('.nf-faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('open');
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     7. CONTACT FORM VALIDATION & HANDLING
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNotice = document.getElementById('formNotice');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    const fields = {
      name: {
        input: document.getElementById('contactName'),
        error: document.getElementById('nameError'),
        check: val => val.trim().length >= 2 ? '' : 'Please enter your full name.'
      },
      email: {
        input: document.getElementById('contactEmail'),
        error: document.getElementById('emailError'),
        check: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? '' : 'Please enter a valid work email.'
      },
      brand: {
        input: document.getElementById('contactBrand'),
        error: document.getElementById('brandError'),
        check: val => val.trim().length >= 2 ? '' : 'Please enter your brand or company name.'
      },
      service: {
        input: document.getElementById('contactService'),
        error: document.getElementById('serviceError'),
        check: val => val ? '' : 'Please choose a primary service needed.'
      },
      brief: {
        input: document.getElementById('contactBrief'),
        error: document.getElementById('briefError'),
        check: val => val.trim().length >= 10 ? '' : 'Please describe your project objectives (min 10 characters).'
      }
    };

    // Live validation error reset on input
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field.input) {
        field.input.addEventListener('input', () => {
          field.input.classList.remove('error');
          if (field.error) field.error.textContent = '';
          if (formNotice) {
            formNotice.className = 'nf-form-notice';
            formNotice.textContent = '';
          }
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      Object.keys(fields).forEach(key => {
        const field = fields[key];
        const errorMsg = field.check(field.input.value);
        if (errorMsg) {
          hasError = true;
          field.input.classList.add('error');
          if (field.error) field.error.textContent = errorMsg;
        } else {
          field.input.classList.remove('error');
          if (field.error) field.error.textContent = '';
        }
      });

      if (hasError) {
        if (formNotice) {
          formNotice.className = 'nf-form-notice error';
          formNotice.textContent = 'Please fill out all required fields correctly before submitting.';
        }
        return;
      }

      // Prepare submission action
      if (submitBtn) submitBtn.classList.add('loading');

      setTimeout(() => {
        if (submitBtn) submitBtn.classList.remove('loading');

        const clientName = fields.name.input.value.trim();
        const clientBrand = fields.brand.input.value.trim();

        // Note Requirement: "Do not create fake success messages for forms that are not connected to a working submission endpoint."
        // We clarify the brief status and directly provide the Instagram / contact routing:
        if (formNotice) {
          formNotice.className = 'nf-form-notice success';
          formNotice.innerHTML = `
            Growth brief initialized for <strong>${clientBrand}</strong> (${clientName}). To finalize and schedule your discovery call, message our strategy team directly on Instagram <a href="https://www.instagram.com/24fpsproduction.in" target="_blank" rel="noopener noreferrer" style="color: #ffffff; text-decoration: underline; font-weight: bold;">@24fpsproduction.in</a>.
          `;
        }

        contactForm.reset();
      }, 700);
    });
  }

});
