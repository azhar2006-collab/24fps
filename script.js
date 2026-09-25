/* ============================================================
   script.js — 24 FPS Netflix-Themed Cinematic Engine
   ============================================================ */

(function () {
  'use strict';

  /* ---- PRELOADER ---- */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 1900);
    }
  });
  document.body.style.overflow = 'hidden';

  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    if (follower) {
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
    }
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  function attachCursorHovers() {
    const hoverables = document.querySelectorAll('a, button, .srv-card, .why-card, .pillar, .cap-item, .srv-cta-btn, .deck-ch-btn, .fps-dial-btn, .deck-viewport, .film-frame');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('hovered');
        if (follower) follower.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('hovered');
        if (follower) follower.classList.remove('hovered');
      });
    });
  }
  attachCursorHovers();

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (navbar) {
      if (scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    if (backToTop) {
      if (scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- HAMBURGER ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ============================================================
     CINEMATIC AUDIO ENGINE (Web Audio API Synthesizer)
     ============================================================ */
  let audioCtx = null;
  let audioEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Synthesizes an epic, deep cinematic brand boom (Netflix "TUDUM" inspired)
  function playCinematicBoom() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    // Sub-bass oscillator
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    subOsc.connect(subGain);
    subGain.connect(audioCtx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.6);

    // Punch oscillator (mid thump)
    const midOsc = audioCtx.createOscillator();
    const midGain = audioCtx.createGain();
    midOsc.type = 'triangle';
    midOsc.frequency.setValueAtTime(280, now);
    midOsc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

    midGain.gain.setValueAtTime(0.3, now);
    midGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    midOsc.connect(midGain);
    midGain.connect(audioCtx.destination);
    midOsc.start(now);
    midOsc.stop(now + 0.6);

    // Shimmering chord overtone
    [440, 660, 880].forEach((freq, idx) => {
      const harmOsc = audioCtx.createOscillator();
      const harmGain = audioCtx.createGain();
      harmOsc.type = 'sine';
      harmOsc.frequency.setValueAtTime(freq, now);

      harmGain.gain.setValueAtTime(0.04 / (idx + 1), now);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      harmOsc.connect(harmGain);
      harmGain.connect(audioCtx.destination);
      harmOsc.start(now);
      harmOsc.stop(now + 1.8);
    });
  }

  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        audioToggleBtn.classList.add('active');
        if (audioIcon) audioIcon.className = 'fas fa-volume-high';
        if (audioLabel) audioLabel.textContent = 'CINEMA AUDIO: ON';
        playCinematicBoom();
      } else {
        audioToggleBtn.classList.remove('active');
        if (audioIcon) audioIcon.className = 'fas fa-volume-xmark';
        if (audioLabel) audioLabel.textContent = 'CINEMA AUDIO';
      }
    });
  }

  /* ============================================================
     ROLLING 24 FPS CAMERA TIMECODE
     ============================================================ */
  const hudTimecode = document.getElementById('hudTimecode');
  let tcHours = 0, tcMinutes = 0, tcSeconds = 24, tcFrames = 0;
  let activeFps = 24;

  setInterval(() => {
    tcFrames++;
    if (tcFrames >= activeFps) {
      tcFrames = 0;
      tcSeconds++;
      if (tcSeconds >= 60) {
        tcSeconds = 0;
        tcMinutes++;
        if (tcMinutes >= 60) {
          tcMinutes = 0;
          tcHours++;
        }
      }
    }
    if (hudTimecode) {
      const hh = String(tcHours).padStart(2, '0');
      const mm = String(tcMinutes).padStart(2, '0');
      const ss = String(tcSeconds).padStart(2, '0');
      const ff = String(tcFrames).padStart(2, '0');
      hudTimecode.textContent = `${hh}:${mm}:${ss}:${ff}`;
    }
  }, 1000 / 24);

  /* ============================================================
     ANAMORPHIC LENS FLARE MOUSE INTERACTION
     ============================================================ */
  const anamorphicFlare = document.getElementById('anamorphicFlare');
  const heroSection = document.getElementById('home');

  if (heroSection && anamorphicFlare) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const relY = ((e.clientY - rect.top) / rect.height) * 100;
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
      anamorphicFlare.style.top = `${relY}%`;
      anamorphicFlare.style.transform = `translateY(-50%) skewX(${relX * 0.15}deg)`;
    });
  }

  /* ============================================================
     FRAME-RATE DIAL CONTROLLER (24 / 60 / 120 FPS)
     ============================================================ */
  const fpsDialBtns = document.querySelectorAll('.fps-dial-btn');
  const hudFpsDisplay = document.getElementById('hudFpsDisplay');

  fpsDialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fpsDialBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFps = parseInt(btn.getAttribute('data-fps'), 10) || 24;

      if (hudFpsDisplay) {
        if (activeFps === 24) {
          hudFpsDisplay.textContent = '24.000 FPS SYNCED';
        } else if (activeFps === 60) {
          hudFpsDisplay.textContent = '60.000 FPS DYNAMIC';
        } else {
          hudFpsDisplay.textContent = '120.000 FPS WARP';
        }
      }

      if (audioEnabled) {
        playCinematicBoom();
      }
    });
  });

  /* ============================================================
     HERO PARTICLES ENGINE
     ============================================================ */
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    const count = 55;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 2.8 + 1;
      const isRed = Math.random() < 0.35;
      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${isRed ? 'rgba(229,9,20,' + (Math.random() * 0.6 + 0.3) + ')' : 'rgba(255,255,255,' + (Math.random() * 0.2 + 0.05) + ')'};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatParticle ${Math.random() * 8 + 6}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  /* ============================================================
     CINEMA DECK INTERACTIVE VIEWPORT CANVAS (8K Simulated Engine)
     ============================================================ */
  const canvas = document.getElementById('cinemaCanvas');
  let currentChannel = 0;

  const channelData = [
    {
      slug: '24FPS_SHOWCASE_REEL_01.MP4',
      cat: 'VISUAL PRODUCTION',
      pillar: 'VFX & 3D',
      title: 'CINEMATIC COMMERCIALS & BRAND FILMS',
      desc: 'Crafting high-octane visual storytelling, photo-real CGI, and boundary-pushing motion graphics.'
    },
    {
      slug: '24FPS_GROWTH_ENGINE_02.DAT',
      cat: 'DIGITAL MARKETING',
      pillar: 'META & GOOGLE',
      title: 'PERFORMANCE MARKETING & BRAND CAMPAIGNS',
      desc: 'High-converting ad funnels, performance optimization, and global digital presence scaling.'
    },
    {
      slug: '24FPS_TECH_PLATFORMS_03.SYS',
      cat: 'ENTERPRISE TECH',
      pillar: 'APPS & CRM',
      title: 'CUSTOM WEB APPS & BUSINESS SOLUTIONS',
      desc: 'Scalable cloud architectures, bespoke web platforms, automated invoicing, and integrated CRM systems.'
    }
  ];

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animFrameId;
    let angle = 0;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function renderCanvasScene() {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, w, h);

      const speedMult = activeFps === 120 ? 2.5 : (activeFps === 60 ? 1.5 : 1.0);
      angle += 0.015 * speedMult;

      if (currentChannel === 0) {
        // CHANNEL 0: 3D Wireframe Orbit & Particle Nebula (VFX & Films)
        const cx = w * 0.5;
        const cy = h * 0.45;
        const radius = Math.min(w, h) * 0.3;

        // Radial glow
        const radGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 1.5);
        radGrad.addColorStop(0, 'rgba(229, 9, 20, 0.35)');
        radGrad.addColorStop(0.5, 'rgba(229, 9, 20, 0.08)');
        radGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Rotating rings
        for (let r = 1; r <= 3; r++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle * (r % 2 === 0 ? 1 : -1) * (0.6 / r));
          ctx.beginPath();
          ctx.ellipse(0, 0, radius * (0.4 + r * 0.25), radius * 0.4, angle + r, 0, Math.PI * 2);
          ctx.strokeStyle = r === 2 ? 'rgba(229,9,20,0.8)' : 'rgba(255,255,255,0.2)';
          ctx.lineWidth = r === 2 ? 2 : 1;
          ctx.stroke();

          // Satellite nodes
          const nodeX = Math.cos(angle * 2 + r) * radius * (0.4 + r * 0.25);
          const nodeY = Math.sin(angle * 2 + r) * radius * 0.4;
          ctx.fillStyle = '#ff2a38';
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Center cinema core
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.floor(w * 0.045)}px 'Bebas Neue', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('24 FPS CINEMA', cx, cy + 6);

      } else if (currentChannel === 1) {
        // CHANNEL 1: Digital Growth & Performance Metrics Waveform
        const cx = w * 0.5;
        const cy = h * 0.48;

        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let y = 30; y < h; y += 30) {
          ctx.beginPath();
          ctx.moveTo(20, y);
          ctx.lineTo(w - 20, y);
          ctx.stroke();
        }

        // Animated graph line
        ctx.beginPath();
        const pts = 12;
        const step = (w - 60) / (pts - 1);
        for (let i = 0; i < pts; i++) {
          const x = 30 + i * step;
          const wave = Math.sin(angle * 2 + i * 0.5) * 35;
          const y = cy + wave - (i * (h * 0.02));
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#e50914';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#e50914';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Metric badge
        ctx.fillStyle = '#27c93f';
        ctx.font = `bold ${Math.floor(w * 0.035)}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText('▲ +384.2% ROAS · META CAMPAIGN', w - 40, 50);

      } else {
        // CHANNEL 2: Cyber Platform Architecture Matrix
        const cols = 8;
        const rows = 5;
        const colW = w / (cols + 1);
        const rowH = h / (rows + 1);

        ctx.strokeStyle = 'rgba(229, 9, 20, 0.2)';
        ctx.lineWidth = 1;

        for (let r = 1; r <= rows; r++) {
          for (let c = 1; c <= cols; c++) {
            const x = c * colW;
            const y = r * rowH;
            const dist = Math.sin(angle + (r + c) * 0.4);
            const size = Math.max(1, (dist + 1) * 3);

            ctx.fillStyle = dist > 0.5 ? '#e50914' : 'rgba(255,255,255,0.3)';
            ctx.fillRect(x - size / 2, y - size / 2, size, size);

            if (c < cols) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo((c + 1) * colW, y);
              ctx.stroke();
            }
          }
        }

        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.floor(w * 0.035)}px 'Space Grotesk', monospace`;
        ctx.textAlign = 'left';
        ctx.fillText('> ENTERPRISE CLOUD ARCHITECTURE [STABLE]', 35, 45);
      }

      animFrameId = requestAnimationFrame(renderCanvasScene);
    }
    renderCanvasScene();
  }

  // Channel tab switching
  const channelBtns = document.querySelectorAll('.deck-ch-btn');
  const deckSlugText = document.getElementById('deckSlugText');
  const deckCategoryTag = document.getElementById('deckCategoryTag');
  const deckPillarTag = document.getElementById('deckPillarTag');
  const deckMetaTitle = document.getElementById('deckMetaTitle');
  const deckMetaDesc = document.getElementById('deckMetaDesc');

  channelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      channelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const chIdx = parseInt(btn.getAttribute('data-channel'), 10) || 0;
      currentChannel = chIdx;

      const info = channelData[chIdx];
      if (info) {
        if (deckSlugText) deckSlugText.textContent = info.slug;
        if (deckCategoryTag) deckCategoryTag.textContent = info.cat;
        if (deckPillarTag) deckPillarTag.textContent = info.pillar;
        if (deckMetaTitle) deckMetaTitle.textContent = info.title;
        if (deckMetaDesc) deckMetaDesc.textContent = info.desc;
      }

      if (audioEnabled) {
        playCinematicBoom();
      }
    });
  });

  /* ============================================================
     AUDIO SPECTRUM WAVEFORM JUMPER
     ============================================================ */
  const waveformContainer = document.getElementById('waveformBars');
  if (waveformContainer) {
    const barCount = 26;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'wf-bar';
      waveformContainer.appendChild(bar);
    }

    const bars = waveformContainer.querySelectorAll('.wf-bar');
    setInterval(() => {
      bars.forEach((bar, idx) => {
        const height = Math.floor(Math.sin(Date.now() * 0.005 + idx * 0.4) * 8 + 9 + Math.random() * 5);
        bar.style.height = `${Math.max(3, height)}px`;
      });
    }, 80);
  }

  /* ============================================================
     35MM FILMSTRIP REEL GENERATOR
     ============================================================ */
  const filmstripTrack = document.getElementById('filmstripTrack');
  const filmTitles = [
    { tag: 'SCENE 01', title: 'BRAND FILMS & CINEMA' },
    { tag: 'SCENE 02', title: 'VFX & CGI COMPOSITING' },
    { tag: 'SCENE 03', title: 'META & GOOGLE ADS' },
    { tag: 'SCENE 04', title: '3D ASSET MODELLING' },
    { tag: 'SCENE 05', title: 'CUSTOM WEB PLATFORMS' },
    { tag: 'SCENE 06', title: 'CRM & AUTOMATION' },
    { tag: 'SCENE 07', title: 'TV COMMERCIALS' },
    { tag: 'SCENE 08', title: 'MOBILE APP DEVELOPMENT' }
  ];

  if (filmstripTrack) {
    // Generate double list for seamless loop
    const combined = [...filmTitles, ...filmTitles];
    filmstripTrack.innerHTML = '';
    combined.forEach(item => {
      const frame = document.createElement('div');
      frame.className = 'film-frame';
      frame.innerHTML = `
        <div class="sprocket-holes">
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
        </div>
        <div class="frame-content">
          <span class="frame-tag">${item.tag}</span>
          <span class="frame-title">${item.title}</span>
        </div>
        <div class="sprocket-holes">
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
          <span class="sprocket-hole"></span>
        </div>
      `;
      filmstripTrack.appendChild(frame);
    });
  }

  /* ============================================================
     CINEMATIC SHOWREEL MODAL
     ============================================================ */
  const reelModal = document.getElementById('reelModal');
  const openReelBtn = document.getElementById('openReelBtn');
  const deckPlayTrigger = document.getElementById('deckPlayTrigger');
  const closeReelBtn = document.getElementById('closeReelBtn');
  const reelModalBackdrop = document.getElementById('reelModalBackdrop');
  const modalCanvas = document.getElementById('modalCanvas');
  const modalLoader = document.getElementById('modalLoader');
  const modalProgressBar = document.getElementById('modalProgressBar');
  const modalPlayPauseBtn = document.getElementById('modalPlayPauseBtn');

  let modalAnimId = null;
  let modalPlaying = false;
  let modalProgress = 0;

  function openShowreel() {
    if (!reelModal) return;
    reelModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playCinematicBoom();

    if (modalLoader) {
      modalLoader.classList.remove('hidden');
      setTimeout(() => {
        modalLoader.classList.add('hidden');
        startModalPlayback();
      }, 1200);
    }
  }

  function closeShowreel() {
    if (!reelModal) return;
    reelModal.classList.remove('active');
    document.body.style.overflow = '';
    modalPlaying = false;
    if (modalAnimId) cancelAnimationFrame(modalAnimId);
  }

  if (openReelBtn) openReelBtn.addEventListener('click', openShowreel);
  if (deckPlayTrigger) deckPlayTrigger.addEventListener('click', openShowreel);
  if (closeReelBtn) closeReelBtn.addEventListener('click', closeShowreel);
  if (reelModalBackdrop) reelModalBackdrop.addEventListener('click', closeShowreel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reelModal && reelModal.classList.contains('active')) {
      closeShowreel();
    }
  });

  function startModalPlayback() {
    modalPlaying = true;
    modalProgress = 0;
    if (!modalCanvas) return;

    const ctx = modalCanvas.getContext('2d');
    let t = 0;

    function renderModalReel() {
      if (!modalPlaying) return;
      t += 0.02;
      modalProgress = (modalProgress + 0.12) % 100;
      if (modalProgressBar) modalProgressBar.style.width = `${modalProgress}%`;

      const w = modalCanvas.width;
      const h = modalCanvas.height;

      // Dark cinematic backdrop
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Expanding cinematic light burst
      const cx = w * 0.5;
      const cy = h * 0.5;
      const glow = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.5);
      glow.addColorStop(0, 'rgba(229, 9, 20, 0.45)');
      glow.addColorStop(0.4, 'rgba(229, 9, 20, 0.1)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Starburst rays
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.2);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 16; i++) {
        ctx.rotate(Math.PI / 8);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.6, 0);
        ctx.stroke();
      }
      ctx.restore();

      // Bold Brand Slate
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.floor(w * 0.07)}px 'Bebas Neue', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('24 FPS PRODUCTION SHOWREEL', cx, cy - 20);

      ctx.fillStyle = '#e50914';
      ctx.font = `600 ${Math.floor(w * 0.022)}px 'Space Grotesk', sans-serif`;
      ctx.fillText('DIGITAL · VISUAL · TECHNOLOGY', cx, cy + 30);

      // Timecode watermark
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `400 ${Math.floor(w * 0.018)}px 'Space Grotesk', monospace`;
      ctx.textAlign = 'right';
      ctx.fillText('4K DCI · 24.000 FPS · 8K RED RAW', w - 40, 50);

      modalAnimId = requestAnimationFrame(renderModalReel);
    }
    renderModalReel();
  }

  if (modalPlayPauseBtn) {
    modalPlayPauseBtn.addEventListener('click', () => {
      modalPlaying = !modalPlaying;
      modalPlayPauseBtn.innerHTML = modalPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
      if (modalPlaying) startModalPlayback();
    });
  }

  /* ============================================================
     3D PERSPECTIVE TILT ON CINEMA DECK
     ============================================================ */
  const cinemaDeck = document.getElementById('cinemaDeck');
  if (cinemaDeck) {
    cinemaDeck.addEventListener('mousemove', (e) => {
      const rect = cinemaDeck.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cinemaDeck.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    cinemaDeck.addEventListener('mouseleave', () => {
      cinemaDeck.style.transform = '';
    });
  }

  /* ============================================================
     STATS COUNTER ANIMATION
     ============================================================ */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (!target) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroStatsStrip = document.querySelector('.hero-stats-strip');
  if (heroStatsStrip) counterObserver.observe(heroStatsStrip);

  /* ============================================================
     SERVICES BENTO GRID INTERACTIONS & REVEALS
     ============================================================ */
  const srvCards = document.querySelectorAll('.srv-card');
  srvCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');

      const tiltX = (e.clientX - rect.left) / rect.width - 0.5;
      const tiltY = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-tiltY * 4}deg) rotateY(${tiltX * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  const srvBento = document.querySelector('.srv-bento');
  if (srvBento) {
    const bentoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          srvCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
          bentoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    bentoObserver.observe(srvBento);
  }

  const srvIntro = document.querySelector('.srv-intro');
  if (srvIntro) {
    srvIntro.style.opacity = '0';
    srvIntro.style.transform = 'translateY(30px)';
    srvIntro.style.transition = 'all 0.8s ease';
    const introObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          introObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    introObserver.observe(srvIntro);
  }

  /* ============================================================
     SECTIONS & WHY US REVEAL
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.why-card, .approach-step').forEach(el => {
    revealObserver.observe(el);
  });

  /* ============================================================
     CONTACT FORM
     ============================================================ */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-btn');
      if (btn) {
        const origText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Inquiry Received!';
        btn.style.background = '#27ae60';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });
  }

  /* ============================================================
     SMOOTH SCROLLING NAV LINKS
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================================
     FEATURED REELS CONTROLLER: HORIZONTAL SCROLL & MIC TOGGLE
     ============================================================ */
  window.toggleReelMic = function(videoId, btnEl) {
    const video = document.getElementById(videoId);
    if (!video) return;

    const isMuted = video.muted;
    if (isMuted) {
      // Unmute
      video.muted = false;
      video.volume = 1.0;
      if (btnEl) {
        btnEl.classList.add('mic-active');
        const micIcon = btnEl.querySelector('i');
        if (micIcon) micIcon.className = 'fas fa-microphone';
        const micText = btnEl.querySelector('.mic-text');
        if (micText) micText.textContent = 'MIC ON';
        const wave = btnEl.querySelector('.sound-wave');
        if (wave) wave.classList.add('active');
      }
    } else {
      // Mute
      video.muted = true;
      if (btnEl) {
        btnEl.classList.remove('mic-active');
        const micIcon = btnEl.querySelector('i');
        if (micIcon) micIcon.className = 'fas fa-microphone-slash';
        const micText = btnEl.querySelector('.mic-text');
        if (micText) micText.textContent = 'MIC OFF';
        const wave = btnEl.querySelector('.sound-wave');
        if (wave) wave.classList.remove('active');
      }
    }
  };

  window.toggleAllReelsMic = function() {
    const masterBtn = document.getElementById('masterMicBtn');
    const masterIcon = document.getElementById('masterMicIcon');
    const masterLabel = document.getElementById('masterMicLabel');
    const allVideos = document.querySelectorAll('.reel-video-player');
    const allMicBtns = document.querySelectorAll('.reel-mic-btn');

    let anyUnmuted = false;
    allVideos.forEach(v => {
      if (!v.muted) anyUnmuted = true;
    });

    const targetMuted = anyUnmuted;

    allVideos.forEach(v => {
      v.muted = targetMuted;
      if (!targetMuted) {
        v.volume = 1.0;
        v.play().catch(() => {});
      }
    });

    allMicBtns.forEach(btn => {
      const micIcon = btn.querySelector('i');
      const micText = btn.querySelector('.mic-text');
      const wave = btn.querySelector('.sound-wave');
      if (!targetMuted) {
        btn.classList.add('mic-active');
        if (micIcon) micIcon.className = 'fas fa-microphone';
        if (micText) micText.textContent = 'MIC ON';
        if (wave) wave.classList.add('active');
      } else {
        btn.classList.remove('mic-active');
        if (micIcon) micIcon.className = 'fas fa-microphone-slash';
        if (micText) micText.textContent = 'MIC OFF';
        if (wave) wave.classList.remove('active');
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

  window.togglePlayPause = function(videoId) {
    const video = document.getElementById(videoId);
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  window.toggleIframeSound = function(btnEl) {
    if (!btnEl) return;
    const isMuted = !btnEl.classList.contains('mic-active');
    if (isMuted) {
      btnEl.classList.add('mic-active');
      const micIcon = btnEl.querySelector('i');
      if (micIcon) micIcon.className = 'fas fa-microphone';
      const micText = btnEl.querySelector('.mic-text');
      if (micText) micText.textContent = 'MIC ON';
      const wave = btnEl.querySelector('.sound-wave');
      if (wave) wave.classList.add('active');
    } else {
      btnEl.classList.remove('mic-active');
      const micIcon = btnEl.querySelector('i');
      if (micIcon) micIcon.className = 'fas fa-microphone-slash';
      const micText = btnEl.querySelector('.mic-text');
      if (micText) micText.textContent = 'MIC OFF';
      const wave = btnEl.querySelector('.sound-wave');
      if (wave) wave.classList.remove('active');
    }
  };

  window.setReelsMode = function(mode) {
    const cards = document.querySelectorAll('.reel-card');
    const btnH = document.getElementById('btnModeHorizontal');
    const btnV = document.getElementById('btnModeVertical');

    if (mode === 'horizontal') {
      cards.forEach(c => {
        c.classList.remove('vertical-mode');
        c.classList.add('horizontal-mode');
      });
      if (btnH) btnH.classList.add('active');
      if (btnV) btnV.classList.remove('active');
    } else {
      cards.forEach(c => {
        c.classList.remove('horizontal-mode');
        c.classList.add('vertical-mode');
      });
      if (btnV) btnV.classList.add('active');
      if (btnH) btnH.classList.remove('active');
    }
  };

  window.scrollReels = function(direction) {
    const track = document.getElementById('reelsTrack');
    if (!track) return;
    const card = track.querySelector('.reel-card');
    const step = card ? card.offsetWidth + 32 : 450;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  window.scrollToReel = function(index) {
    const track = document.getElementById('reelsTrack');
    if (!track) return;
    const cards = track.querySelectorAll('.reel-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  // Sync scroll indicator dots
  const reelsTrackEl = document.getElementById('reelsTrack');
  const indicatorDots = document.querySelectorAll('.reels-indicator-bar .indicator-dot');
  if (reelsTrackEl && indicatorDots.length > 0) {
    reelsTrackEl.addEventListener('scroll', () => {
      const cards = reelsTrackEl.querySelectorAll('.reel-card');
      const trackCenter = reelsTrackEl.scrollLeft + reelsTrackEl.offsetWidth / 2;
      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        if (Math.abs(trackCenter - cardCenter) < card.offsetWidth / 2) {
          indicatorDots.forEach(d => d.classList.remove('active'));
          if (indicatorDots[idx]) indicatorDots[idx].classList.add('active');
        }
      });
    });
  }

})();

