/* ============================================================
   24 FPS — NETFLIX INDIA INTERACTIVE ENGINE
   ============================================================ */

(function () {
  'use strict';

  /* ---- GLOBAL AUDIO & MODAL STATE ---- */
  let currentModalVideo = null;
  let isModalMuted = false;

  /* ---- CAROUSEL SCROLLER ---- */
  window.scrollTrending = function (direction) {
    const track = document.getElementById('trendingTrack');
    if (!track) return;
    const scrollAmount = 450 * direction;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  /* ---- FAQ ACCORDION TOGGLE ---- */
  window.toggleFaq = function (btnEl) {
    const item = btnEl.closest('.faq-item');
    if (!item) return;

    const isActive = item.classList.contains('active');

    // Close all other FAQ items (authentic Netflix behavior)
    document.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('active');
    });

    if (!isActive) {
      item.classList.add('active');
    }
  };

  /* ---- EMAIL SUBMISSION FEEDBACK ---- */
  window.handleEmailSubmit = function (e, inputId) {
    e.preventDefault();
    const input = document.getElementById(inputId);
    if (!input || !input.value) return;

    const successId = inputId === 'heroEmail' ? 'heroSuccessMsg' : 'faqSuccessMsg';
    const successEl = document.getElementById(successId);
    if (successEl) {
      successEl.classList.add('show');
      input.value = '';
      setTimeout(() => {
        successEl.classList.remove('show');
      }, 5000);
    }
  };

  /* ---- SIGN IN MODAL ---- */
  const signInModal = document.getElementById('signInModal');
  const navSignInBtn = document.getElementById('navSignInBtn');

  if (navSignInBtn) {
    navSignInBtn.addEventListener('click', () => {
      openSignInModal();
    });
  }

  window.openSignInModal = function () {
    if (signInModal) {
      signInModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeSignInModal = function () {
    if (signInModal) {
      signInModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.handleSignInSubmit = function (e) {
    e.preventDefault();
    alert('Welcome to 24FPS PRODUCTION Member Portal! Your session is verified.');
    closeSignInModal();
  };

  /* ---- VIDEO PREVIEW MODAL ---- */
  const videoModal = document.getElementById('videoModal');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const modalIframePlayer = document.getElementById('modalIframePlayer');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalIgLink = document.getElementById('modalIgLink');
  const modalMicBtn = document.getElementById('modalMicBtn');
  const modalMicIcon = document.getElementById('modalMicIcon');
  const modalMicText = document.getElementById('modalMicText');

  window.openVideoModal = function (videoId, title, desc, category, videoSrc, igLink) {
    if (!videoModal) return;

    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = category;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalIgLink) modalIgLink.href = igLink || 'https://www.instagram.com/24fpsproduction.in';

    // Show native video player, hide iframe
    if (modalIframePlayer) {
      modalIframePlayer.classList.remove('active');
      modalIframePlayer.src = '';
    }

    if (modalVideoPlayer) {
      modalVideoPlayer.classList.add('active');
      modalVideoPlayer.src = videoSrc;
      modalVideoPlayer.muted = false; // Start unmuted in modal with live sound!
      modalVideoPlayer.volume = 1.0;
      isModalMuted = false;
      currentModalVideo = modalVideoPlayer;
      modalVideoPlayer.play().catch(() => {
        // If browser blocks autoplay with sound, mute and play
        modalVideoPlayer.muted = true;
        isModalMuted = true;
        modalVideoPlayer.play().catch(() => {});
      });

      updateModalMicButton();
    }

    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.openIframeModal = function (iframeSrc, title, desc, category, igLink) {
    if (!videoModal) return;

    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = category;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalIgLink) modalIgLink.href = igLink || 'https://www.instagram.com/24fpsproduction.in';

    // Hide native video player, show iframe
    if (modalVideoPlayer) {
      modalVideoPlayer.pause();
      modalVideoPlayer.classList.remove('active');
      modalVideoPlayer.src = '';
    }

    if (modalIframePlayer) {
      modalIframePlayer.classList.add('active');
      modalIframePlayer.src = iframeSrc;
    }

    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeVideoModal = function () {
    if (videoModal) {
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (modalVideoPlayer) {
      modalVideoPlayer.pause();
      modalVideoPlayer.src = '';
    }
    if (modalIframePlayer) {
      modalIframePlayer.src = '';
    }
  };

  window.toggleModalMic = function () {
    if (!currentModalVideo) return;
    isModalMuted = !isModalMuted;
    currentModalVideo.muted = isModalMuted;
    updateModalMicButton();
  };

  function updateModalMicButton() {
    if (!modalMicBtn || !modalMicIcon || !modalMicText) return;
    if (!isModalMuted) {
      modalMicIcon.className = 'fas fa-microphone';
      modalMicText.textContent = 'MIC ON';
      modalMicBtn.style.background = '#10b981';
      modalMicBtn.style.color = '#000';
    } else {
      modalMicIcon.className = 'fas fa-microphone-slash';
      modalMicText.textContent = 'MIC OFF';
      modalMicBtn.style.background = 'rgba(0,0,0,0.85)';
      modalMicBtn.style.color = '#fff';
    }
  }

  /* ---- PER-REEL MIC ON/OFF CONTROLS (FEATURED SECTION) ---- */
  window.toggleReelMic = function (videoId, btnEl) {
    const video = document.getElementById(videoId);
    if (!video) return;

    const isMuted = video.muted;
    if (isMuted) {
      // Unmute & Play Sound
      video.muted = false;
      video.volume = 1.0;
      if (btnEl) {
        btnEl.classList.add('mic-active');
        const icon = btnEl.querySelector('i');
        if (icon) icon.className = 'fas fa-microphone';
        const label = btnEl.querySelector('.mic-label');
        if (label) label.textContent = 'MIC ON';
        const bars = btnEl.querySelector('.audio-bars');
        if (bars) bars.classList.add('active');
      }
    } else {
      // Mute
      video.muted = true;
      if (btnEl) {
        btnEl.classList.remove('mic-active');
        const icon = btnEl.querySelector('i');
        if (icon) icon.className = 'fas fa-microphone-slash';
        const label = btnEl.querySelector('.mic-label');
        if (label) label.textContent = 'MIC OFF';
        const bars = btnEl.querySelector('.audio-bars');
        if (bars) bars.classList.remove('active');
      }
    }
  };

  /* ---- MASTER AUDIO TOGGLE ---- */
  window.toggleAllReelsMic = function () {
    const masterBtn = document.getElementById('masterMicBtn');
    const masterIcon = document.getElementById('masterMicIcon');
    const masterLabel = document.getElementById('masterMicLabel');
    const allVideos = document.querySelectorAll('.hcard-video');
    const allMicBtns = document.querySelectorAll('.netflix-mic-toggle');

    let anyUnmuted = false;
    allVideos.forEach(v => {
      if (!v.muted) anyUnmuted = true;
    });

    const targetMuted = anyUnmuted; // If any unmuted, mute all; else unmute all

    allVideos.forEach(v => {
      v.muted = targetMuted;
      if (!targetMuted) {
        v.volume = 1.0;
        v.play().catch(() => {});
      }
    });

    allMicBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('.mic-label');
      const bars = btn.querySelector('.audio-bars');
      if (!targetMuted) {
        btn.classList.add('mic-active');
        if (icon) icon.className = 'fas fa-microphone';
        if (label) label.textContent = 'MIC ON';
        if (bars) bars.classList.add('active');
      } else {
        btn.classList.remove('mic-active');
        if (icon) icon.className = 'fas fa-microphone-slash';
        if (label) label.textContent = 'MIC OFF';
        if (bars) bars.classList.remove('active');
      }
    });

    if (masterBtn && masterIcon && masterLabel) {
      if (!targetMuted) {
        masterBtn.classList.add('active');
        masterIcon.className = 'fas fa-microphone';
        masterLabel.textContent = 'ALL MICS: LIVE';
      } else {
        masterBtn.classList.remove('active');
        masterIcon.className = 'fas fa-microphone-slash';
        masterLabel.textContent = 'ALL MICS: MUTED';
      }
    }
  };

  /* ---- PLAY/PAUSE TOGGLE ---- */
  window.togglePlayPause = function (videoId) {
    const video = document.getElementById(videoId);
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  /* ---- IFRAME SOUND TOGGLE (VISUAL FEEDBACK) ---- */
  window.toggleIframeSound = function (btnEl) {
    if (!btnEl) return;
    const isActive = btnEl.classList.contains('mic-active');
    const icon = btnEl.querySelector('i');
    const label = btnEl.querySelector('.mic-label');
    const bars = btnEl.querySelector('.audio-bars');

    if (!isActive) {
      btnEl.classList.add('mic-active');
      if (icon) icon.className = 'fas fa-microphone';
      if (label) label.textContent = 'MIC ON';
      if (bars) bars.classList.add('active');
    } else {
      btnEl.classList.remove('mic-active');
      if (icon) icon.className = 'fas fa-microphone-slash';
      if (label) label.textContent = 'MIC OFF';
      if (bars) bars.classList.remove('active');
    }
  };

  /* ---- LANGUAGE PICKER INTERACTION ---- */
  const langSelect = document.getElementById('langSelect');
  const footerLangSelect = document.getElementById('footerLangSelect');

  function syncLanguage(val) {
    if (langSelect) langSelect.value = val;
    if (footerLangSelect) footerLangSelect.value = val;
    if (val === 'hi') {
      const heroTitle = document.querySelector('.netflix-hero-title');
      const heroSubtitle = document.querySelector('.netflix-hero-subtitle');
      const heroPrompt = document.querySelector('.netflix-hero-prompt');
      if (heroTitle) heroTitle.textContent = 'अनलिमिटेड फिल्में, शोज़ और बहुत कुछ';
      if (heroSubtitle) heroSubtitle.textContent = 'शुरुआत ₹149 से। कभी भी कैंसल करें।';
      if (heroPrompt) heroPrompt.textContent = 'देखने के लिए तैयार हैं? अपनी मेंबरशिप बनाने के लिए अपना ईमेल डालें।';
    } else {
      const heroTitle = document.querySelector('.netflix-hero-title');
      const heroSubtitle = document.querySelector('.netflix-hero-subtitle');
      const heroPrompt = document.querySelector('.netflix-hero-prompt');
      if (heroTitle) heroTitle.textContent = 'Unlimited movies, shows, and more';
      if (heroSubtitle) heroSubtitle.textContent = 'Starts at ₹149. Cancel anytime.';
      if (heroPrompt) heroPrompt.textContent = 'Ready to watch? Enter your email to create or restart your membership.';
    }
  }

  if (langSelect) {
    langSelect.addEventListener('change', (e) => syncLanguage(e.target.value));
  }
  if (footerLangSelect) {
    footerLangSelect.addEventListener('change', (e) => syncLanguage(e.target.value));
  }

  /* ---- ESCAPE KEY TO CLOSE MODALS ---- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
      closeSignInModal();
    }
  });

})();
