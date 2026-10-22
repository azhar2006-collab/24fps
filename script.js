/**
 * 24FPS PRODUCTION — Netflix-Inspired Premium Agency Website
 * Vanilla JavaScript (ES6+) — Zero Frameworks, Production Quality
 *
 * Features:
 * 1. Header scroll effect
 * 2. Mobile menu toggle
 * 3. Hero video sound toggle
 * 4. Hero quick form -> prefill contact
 * 5. Portfolio videos & mic sound controls
 * 6. Netflix FAQ accordion
 * 7. Contact form validation
 * 8. Netflix-style horizontal video carousel (arrows + touch swipe)
 * 9. Client logo carousel (arrows + touch swipe)
 * 10. Video modal/lightbox with video preview on card hover
 * 11. Scroll-reveal IntersectionObserver
 * 12. Card preview video hover play
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
     3. HERO VIDEO SOUND & FULLSCREEN CONTROLS
     -------------------------------------------------------------------------- */
  const heroVideo = document.getElementById('heroVideo');
  const heroSoundToggle = document.getElementById('heroSoundToggle');
  const heroSoundLabel = document.getElementById('heroSoundLabel');
  const heroFullscreenToggle = document.getElementById('heroFullscreenToggle');

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

  if (heroVideo && heroFullscreenToggle) {
    heroFullscreenToggle.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (heroVideo.requestFullscreen) {
          heroVideo.requestFullscreen();
        } else if (heroVideo.webkitRequestFullscreen) {
          heroVideo.webkitRequestFullscreen();
        } else if (heroVideo.msRequestFullscreen) {
          heroVideo.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
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
     5. PORTFOLIO VIDEOS & MIC SOUND CONTROLS (HORIZONTAL 16:9 GRID)
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

      if (submitBtn) submitBtn.classList.add('loading');

      setTimeout(() => {
        if (submitBtn) submitBtn.classList.remove('loading');

        const clientName = fields.name.input.value.trim();
        const clientBrand = fields.brand.input.value.trim();

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

  /* --------------------------------------------------------------------------
     8. NETFLIX-STYLE HORIZONTAL VIDEO CAROUSEL
     -------------------------------------------------------------------------- */
  const videoCarousel = document.getElementById('videoCarousel');
  const videoPrev = document.getElementById('videoPrev');
  const videoNext = document.getElementById('videoNext');

  if (videoCarousel) {
    const getVideoScrollAmount = () => {
      const card = videoCarousel.querySelector('.nf-video-card');
      return card ? card.offsetWidth + 20 : 340;
    };

    if (videoPrev) {
      videoPrev.addEventListener('click', () => {
        videoCarousel.scrollBy({ left: -getVideoScrollAmount(), behavior: 'smooth' });
      });
    }
    if (videoNext) {
      videoNext.addEventListener('click', () => {
        videoCarousel.scrollBy({ left: getVideoScrollAmount(), behavior: 'smooth' });
      });
    }

    // Touch swipe for video carousel
    setupTouchSwipe(videoCarousel);

    // Arrow visibility based on scroll position
    const updateVideoArrows = () => {
      if (!videoPrev || !videoNext) return;
      videoPrev.style.opacity = videoCarousel.scrollLeft <= 10 ? '0.4' : '1';
      videoNext.style.opacity =
        videoCarousel.scrollLeft + videoCarousel.clientWidth >= videoCarousel.scrollWidth - 10
          ? '0.4' : '1';
    };
    videoCarousel.addEventListener('scroll', updateVideoArrows, { passive: true });
    updateVideoArrows();

    // Keyboard navigation on cards
    videoCarousel.querySelectorAll('.nf-video-card').forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          videoCarousel.scrollBy({ left: getVideoScrollAmount(), behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
          videoCarousel.scrollBy({ left: -getVideoScrollAmount(), behavior: 'smooth' });
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. CLIENT LOGO CAROUSEL
     -------------------------------------------------------------------------- */
  const logoCarousel = document.getElementById('logoCarousel');
  const logoPrev = document.getElementById('logoPrev');
  const logoNext = document.getElementById('logoNext');

  if (logoCarousel) {
    const getLogoScrollAmount = () => {
      const card = logoCarousel.querySelector('.nf-logo-card');
      return card ? (card.offsetWidth + 20) * 2 : 460;
    };

    if (logoPrev) {
      logoPrev.addEventListener('click', () => {
        logoCarousel.scrollBy({ left: -getLogoScrollAmount(), behavior: 'smooth' });
      });
    }
    if (logoNext) {
      logoNext.addEventListener('click', () => {
        logoCarousel.scrollBy({ left: getLogoScrollAmount(), behavior: 'smooth' });
      });
    }

    // Touch swipe for logo carousel
    setupTouchSwipe(logoCarousel);

    // Arrow visibility
    const updateLogoArrows = () => {
      if (!logoPrev || !logoNext) return;
      logoPrev.style.opacity = logoCarousel.scrollLeft <= 10 ? '0.4' : '1';
      logoNext.style.opacity =
        logoCarousel.scrollLeft + logoCarousel.clientWidth >= logoCarousel.scrollWidth - 10
          ? '0.4' : '1';
    };
    logoCarousel.addEventListener('scroll', updateLogoArrows, { passive: true });
    updateLogoArrows();
  }

  /* --------------------------------------------------------------------------
     TOUCH SWIPE HELPER (shared for both carousels)
     -------------------------------------------------------------------------- */
  function setupTouchSwipe(track) {
    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      scrollStart = track.scrollLeft;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const delta = startX - e.touches[0].clientX;
      track.scrollLeft = scrollStart + delta;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Mouse drag support for desktop
    track.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      scrollStart = track.scrollLeft;
      isDragging = true;
      track.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        track.style.cursor = '';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const delta = startX - e.clientX;
      track.scrollLeft = scrollStart + delta;
    });
  }

  /* --------------------------------------------------------------------------
     10. VIDEO MODAL LIGHTBOX
     -------------------------------------------------------------------------- */
  const videoModal = document.getElementById('videoModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalTags = document.getElementById('modalTags');
  const modalVideoWrap = document.getElementById('modalVideoWrap');

  // Stop all preview videos playing in carousel
  const stopAllPreviewVideos = () => {
    document.querySelectorAll('.nf-card-preview-video').forEach(v => {
      v.pause();
    });
  };

  const openModal = (card) => {
    if (!videoModal) return;

    const videoSrc = card.dataset.videoSrc;
    const instaSrc = card.dataset.instagramSrc;
    const title = card.dataset.title || '';
    const subtitle = card.dataset.subtitle || '';
    const tags = card.dataset.tags || '';

    // Populate header
    if (modalTitle) modalTitle.textContent = title;
    if (modalSubtitle) modalSubtitle.textContent = subtitle;
    if (modalTags) modalTags.textContent = tags;

    // Populate video area
    if (modalVideoWrap) {
      modalVideoWrap.innerHTML = '';

      if (videoSrc) {
        const vid = document.createElement('video');
        vid.src = videoSrc;
        vid.controls = true;
        vid.autoplay = true;
        vid.playsInline = true;
        vid.style.width = '100%';
        vid.style.height = '100%';
        vid.style.objectFit = 'contain';
        vid.style.background = '#000';
        modalVideoWrap.appendChild(vid);
      } else if (instaSrc) {
        const iframe = document.createElement('iframe');
        iframe.src = instaSrc;
        iframe.title = title;
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        modalVideoWrap.appendChild(iframe);
      }
    }

    // Show modal
    videoModal.removeAttribute('hidden');
    // Trigger open animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        videoModal.classList.add('nf-modal-open');
      });
    });
    document.body.style.overflow = 'hidden';

    // Stop any preview videos
    stopAllPreviewVideos();
    // Stop portfolio section videos
    document.querySelectorAll('.nf-portfolio-video').forEach(v => v.pause());
  };

  const closeModal = () => {
    if (!videoModal) return;
    videoModal.classList.remove('nf-modal-open');

    // Wait for transition then hide
    setTimeout(() => {
      videoModal.setAttribute('hidden', '');
      if (modalVideoWrap) modalVideoWrap.innerHTML = '';
      document.body.style.overflow = '';
    }, 320);
  };

  // Attach open to video cards
  document.querySelectorAll('.nf-video-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open if user was dragging
      openModal(card);
    });

    // Play preview on hover
    const previewVideo = card.querySelector('.nf-card-preview-video');
    if (previewVideo) {
      card.addEventListener('mouseenter', () => {
        previewVideo.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        previewVideo.pause();
        previewVideo.currentTime = 0;
      });
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && !videoModal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  /* --------------------------------------------------------------------------
     11. SCROLL-REVEAL (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-hero');

    // Apply staggered delay from data-delay attribute
    revealElements.forEach(el => {
      const delay = el.dataset.delay;
      if (delay) {
        el.style.transitionDelay = delay + 's';
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // Hero content: trigger immediately on load
    const heroContent = document.querySelector('.reveal-hero');
    if (heroContent) {
      setTimeout(() => heroContent.classList.add('is-visible'), 300);
    }
  } else {
    // If reduced motion or no IntersectionObserver: show everything
    document.querySelectorAll('.reveal-up, .reveal-hero').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  /* --------------------------------------------------------------------------
     12. SERVICES COMPACT INTERACTIVE CAROUSEL & FILTER
     -------------------------------------------------------------------------- */
  const servicesCarousel = document.getElementById('servicesCarousel');
  const servicesPrev = document.getElementById('servicesPrev');
  const servicesNext = document.getElementById('servicesNext');
  const servicesDots = document.getElementById('servicesDots');
  const servicePills = document.querySelectorAll('.nf-filter-pill');

  if (servicesCarousel) {
    const getServiceScrollAmount = () => {
      const slide = servicesCarousel.querySelector('.nf-service-slide:not(.is-hidden)');
      return slide ? slide.offsetWidth + 20 : 340;
    };

    if (servicesPrev) {
      servicesPrev.addEventListener('click', () => {
        servicesCarousel.scrollBy({ left: -getServiceScrollAmount(), behavior: 'smooth' });
      });
    }

    if (servicesNext) {
      servicesNext.addEventListener('click', () => {
        servicesCarousel.scrollBy({ left: getServiceScrollAmount(), behavior: 'smooth' });
      });
    }

    // Connect touch swipe & mouse drag helper
    setupTouchSwipe(servicesCarousel);

    // Update dots and arrows on scroll
    const updateServicesUI = () => {
      const visibleSlides = servicesCarousel.querySelectorAll('.nf-service-slide:not(.is-hidden)');
      if (servicesPrev) {
        servicesPrev.style.opacity = servicesCarousel.scrollLeft <= 10 ? '0.35' : '1';
        servicesPrev.style.pointerEvents = servicesCarousel.scrollLeft <= 10 ? 'none' : 'auto';
      }
      if (servicesNext) {
        const atEnd = servicesCarousel.scrollLeft + servicesCarousel.clientWidth >= servicesCarousel.scrollWidth - 15;
        servicesNext.style.opacity = atEnd ? '0.35' : '1';
        servicesNext.style.pointerEvents = atEnd ? 'none' : 'auto';
      }

      // Update active dot index
      if (servicesDots && visibleSlides.length > 0) {
        const scrollIndex = Math.round(servicesCarousel.scrollLeft / getServiceScrollAmount());
        const dots = servicesDots.querySelectorAll('.nf-services-dot');
        dots.forEach((dot, idx) => {
          if (idx === Math.min(scrollIndex, dots.length - 1)) {
            dot.classList.add('is-active');
          } else {
            dot.classList.remove('is-active');
          }
        });
      }
    };

    // Build pagination dots dynamically based on visible slides
    const buildDots = () => {
      if (!servicesDots) return;
      servicesDots.innerHTML = '';
      const visibleSlides = servicesCarousel.querySelectorAll('.nf-service-slide:not(.is-hidden)');
      visibleSlides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'nf-services-dot' + (idx === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          servicesCarousel.scrollTo({ left: idx * getServiceScrollAmount(), behavior: 'smooth' });
        });
        servicesDots.appendChild(dot);
      });
    };

    buildDots();
    updateServicesUI();
    servicesCarousel.addEventListener('scroll', updateServicesUI, { passive: true });

    // Category Filter Buttons
    servicePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-filter');

        servicePills.forEach(p => {
          p.classList.remove('is-active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('is-active');
        pill.setAttribute('aria-selected', 'true');

        const slides = servicesCarousel.querySelectorAll('.nf-service-slide');
        slides.forEach(slide => {
          const category = slide.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            slide.classList.remove('is-hidden');
          } else {
            slide.classList.add('is-hidden');
          }
        });

        // Reset scroll position and rebuild dots for filtered set
        servicesCarousel.scrollTo({ left: 0, behavior: 'smooth' });
        setTimeout(() => {
          buildDots();
          updateServicesUI();
        }, 120);
      });
    });
  }

});
