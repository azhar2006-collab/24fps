/**
 * 24FPS PRODUCTION — Premium Lifestyle & Fitness Digital Marketing Agency
 * Vanilla JavaScript (ES6+) — Zero Frameworks, Production Quality
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. NAVIGATION SCROLL & ACTIVE STATE
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Scrollspy: Highlight nav items on scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });

  /* --------------------------------------------------------------------------
     2. MOBILE DRAWER NAVIGATION
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-drawer-footer a');

  const openMobileNav = () => {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('open');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  /* --------------------------------------------------------------------------
     3. HERO VIDEO & SOUND (MIC ON / OFF)
     -------------------------------------------------------------------------- */
  const heroVideo = document.getElementById('heroVideo');
  const heroAudioToggle = document.getElementById('heroAudioToggle');
  const heroAudioLabel = document.getElementById('heroAudioLabel');

  if (heroVideo && heroAudioToggle) {
    heroAudioToggle.addEventListener('click', () => {
      // Toggle muted
      if (heroVideo.muted) {
        heroVideo.muted = false;
        heroAudioToggle.classList.add('active');
        if (heroAudioLabel) heroAudioLabel.textContent = 'Mute Sound';
        
        // Mute any other playing case studies
        muteAllOtherVideos(heroVideo);
      } else {
        heroVideo.muted = true;
        heroAudioToggle.classList.remove('active');
        if (heroAudioLabel) heroAudioLabel.textContent = 'Unmute Sound';
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. CASE STUDY VIDEO PLAYERS & MIC SOUND TOGGLES
     (Requirement: "make vidoes with mic on and off sound and the videos should be horizontal")
     -------------------------------------------------------------------------- */
  const playPauseBtns = document.querySelectorAll('.play-pause-btn');
  const micToggleBtns = document.querySelectorAll('.mic-toggle-btn');
  const caseVideos = document.querySelectorAll('.case-video');

  const muteAllOtherVideos = (currentActiveVideo) => {
    // If hero video is unmuted and current isn't hero, mute hero
    if (heroVideo && heroVideo !== currentActiveVideo && !heroVideo.muted) {
      heroVideo.muted = true;
      if (heroAudioToggle) heroAudioToggle.classList.remove('active');
      if (heroAudioLabel) heroAudioLabel.textContent = 'Unmute Sound';
    }

    // Mute all other case study videos
    caseVideos.forEach(v => {
      if (v !== currentActiveVideo) {
        v.muted = true;
        const parentCard = v.closest('.case-card');
        if (parentCard) {
          const micBtn = parentCard.querySelector('.mic-toggle-btn');
          const micLabel = parentCard.querySelector('.mic-status-label');
          if (micBtn) micBtn.classList.remove('live');
          if (micLabel) micLabel.textContent = 'Mic: Off';
        }
      }
    });
  };

  // Set default case videos to muted
  caseVideos.forEach(video => {
    video.muted = true;

    // Toggle on video surface click
    video.addEventListener('click', () => {
      togglePlayVideo(video);
    });

    video.addEventListener('play', () => {
      const parentCard = video.closest('.case-card');
      if (parentCard) {
        const btn = parentCard.querySelector('.play-pause-btn');
        if (btn) btn.classList.add('playing');
      }
    });

    video.addEventListener('pause', () => {
      const parentCard = video.closest('.case-card');
      if (parentCard) {
        const btn = parentCard.querySelector('.play-pause-btn');
        if (btn) btn.classList.remove('playing');
      }
    });
  });

  const togglePlayVideo = (video) => {
    if (video.paused) {
      video.play().catch(err => {
        console.warn('Playback restricted or prevented:', err);
      });
    } else {
      video.pause();
    }
  };

  // Play / Pause Buttons
  playPauseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      const video = document.getElementById(targetId);
      if (video) {
        togglePlayVideo(video);
      }
    });
  });

  // Mic (Sound On/Off) Buttons
  micToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      const video = document.getElementById(targetId);
      const label = btn.querySelector('.mic-status-label');

      if (video) {
        if (video.muted) {
          // Unmute sound
          video.muted = false;
          btn.classList.add('live');
          if (label) label.textContent = 'Mic: Live';

          // If the video was paused, start playback so user hears sound
          if (video.paused) {
            video.play().catch(err => console.warn(err));
          }

          // Mute other videos so sounds don't overlap
          muteAllOtherVideos(video);
        } else {
          // Mute sound
          video.muted = true;
          btn.classList.remove('live');
          if (label) label.textContent = 'Mic: Off';
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver isn't supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* --------------------------------------------------------------------------
     6. GROWTH ENQUIRY FORM VALIDATION & HANDLING
     -------------------------------------------------------------------------- */
  const growthForm = document.getElementById('growthContactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (growthForm) {
    const fields = {
      fullName: {
        el: document.getElementById('fullName'),
        errorEl: document.getElementById('fullNameError'),
        validate: (val) => val.trim().length >= 2 ? '' : 'Please enter your full name.'
      },
      email: {
        el: document.getElementById('email'),
        errorEl: document.getElementById('emailError'),
        validate: (val) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(val.trim()) ? '' : 'Please enter a valid work email address.';
        }
      },
      brandName: {
        el: document.getElementById('brandName'),
        errorEl: document.getElementById('brandNameError'),
        validate: (val) => val.trim().length >= 2 ? '' : 'Please enter your brand or company name.'
      },
      serviceNeeded: {
        el: document.getElementById('serviceNeeded'),
        errorEl: document.getElementById('serviceNeededError'),
        validate: (val) => val ? '' : 'Please select a primary service.'
      },
      projectDetails: {
        el: document.getElementById('projectDetails'),
        errorEl: document.getElementById('projectDetailsError'),
        validate: (val) => val.trim().length >= 10 ? '' : 'Please provide at least a brief summary of your project (min 10 characters).'
      }
    };

    // Live validation listener on input
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field.el) {
        field.el.addEventListener('input', () => {
          field.el.classList.remove('has-error');
          if (field.errorEl) field.errorEl.textContent = '';
          if (formFeedback) {
            formFeedback.className = 'form-feedback-msg';
            formFeedback.textContent = '';
          }
        });
      }
    });

    growthForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      // Validate required fields
      Object.keys(fields).forEach(key => {
        const field = fields[key];
        const error = field.validate(field.el.value);
        if (error) {
          hasError = true;
          field.el.classList.add('has-error');
          if (field.errorEl) field.errorEl.textContent = error;
        } else {
          field.el.classList.remove('has-error');
          if (field.errorEl) field.errorEl.textContent = '';
        }
      });

      if (hasError) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback-msg error';
          formFeedback.textContent = 'Please fill out all required fields correctly before submitting.';
        }
        return;
      }

      // Simulate submission & provide genuine response
      if (submitBtn) submitBtn.classList.add('loading');

      setTimeout(() => {
        if (submitBtn) submitBtn.classList.remove('loading');

        const clientName = fields.fullName.el.value.trim();
        const clientBrand = fields.brandName.el.value.trim();

        if (formFeedback) {
          formFeedback.className = 'form-feedback-msg success';
          formFeedback.innerHTML = `
            <strong>Thank you, ${clientName}!</strong><br>
            Your growth brief for <strong>${clientBrand}</strong> has been received by the 24FPS PRODUCTION strategy team. We will review your project and get in touch within 24 hours. For urgent requirements, feel free to DM us directly on Instagram <a href="https://www.instagram.com/24fpsproduction.in" target="_blank" rel="noopener noreferrer" style="color: #4ade80; text-decoration: underline;">@24fpsproduction.in</a>.
          `;
        }

        growthForm.reset();
      }, 900);
    });
  }

  /* --------------------------------------------------------------------------
     7. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
