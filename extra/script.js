prompt for videos: 
UPDATE my existing code to integrate GSAP video controls exactly like Nagara Webflow site (nagara-daretoshare.webflow.io) for ALL background videos:

Replace all background video controls with HTML5 <video autoplay muted loop playsinline>

Add GSAP + ScrollTrigger CDN if missing

Implement ScrollTrigger scrub: gsap.to(video, {currentTime: scrollProgress, scrollTrigger: {trigger: ".hero", scrub: true}})

Add parallax scale/shift: Video scales 1.0 → 1.1 and y: 0 → -20px on scroll

GSAP on-load fade: Video + text stagger from opacity 0

Use Cinzel/Bodoni Moda for "VELTRIN MONOLITH" style text overlays

Show ONLY the MODIFIED sections (HTML video tags, new GSAP scripts, CSS classes added). Keep my existing layout/structure unchanged. No full page rewrite—just the GSAP video integration updates like Nagara







<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>VELTRIN</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Pangaia:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Neue+Montreal+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap" rel="stylesheet">

<!-- GSAP -->
<script src="https://unpkg.com/gsap@3/dist/gsap.min.js"></script>
<script src="https://unpkg.com/gsap@3/dist/ScrollTrigger.min.js"></script>

<style>
/* ---------------- RESET ---------------- */
* { margin:0; padding:0; box-sizing:border-box; }

body {
  background: #0b0b0b;
  color: #e6e2d8;
  font-family: 'Neue Montreal Mono', monospace;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

/* ---------------- NAVIGATION ---------------- */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: transparent;
  z-index: 1000;
  padding: 20px 8vw;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* UPDATED: slightly reduce visual weight of nav brand so it doesn't compete with headline */
.nav-brand {
  font-size: 1.1rem; /* reduced from 1.2rem */
  font-weight: 700;
  letter-spacing: 0.28em;
  font-family: 'Cinzel', serif;
  color: rgba(230,226,216,0.92); /* subtly softened */
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 40px;
}

.nav-menu a {
  color: #e6e2d8;
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  transition: color 0.3s ease;
}

.nav-menu a:hover {
  color: #c9a24d;
}

.brand {
  font-family: 'Cinzel', serif;
  font-weight: 700;
}

/* ---------------- BRAND INTRODUCTION ---------------- */
.brand-intro {
  padding: 120px 8vw 80px;
  background: #000;
}

.intro-content {
  max-width: 650px;
  margin: 0 auto;
  text-align: left;
  color: #8c857a;
  font-family: 'Pangaia', serif;
  font-weight: 400;
  line-height: 1.6;
  opacity: 0;
}

.intro-content p {
  margin-bottom: 1.5em;
}

/* ---------------- HERO ---------------- */
.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  
  background: #0b0b0b url('nc.png') center/cover no-repeat;
  
}

/* SUBTLE MICRO-ADJUSTMENTS (position + tone + tracking)
   - vertical nudge to avoid perfect centering
   - brand tone softened
   - headline tracking slightly increased
   - supporting line quieter (size + leading + opacity)
*/
.hero-text {
  position: relative;
  z-index: 2;
  max-width: 36%;
  padding-left: 8vw;

  /* slight upward nudge for editorial balance */
  transform: translateY(-3vh);
}

/* hero brand tone reduced slightly so it does not compete with headline */
.hero-text .brand {
  font-size: 0.9rem;
  letter-spacing: 0.5em;
  opacity: 0; /* initial state; GSAP animates to a softer final opacity */
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  color: rgba(230,226,216,0.90); /* softer final tone */
}

/* hero headline: very subtle increase in letter-spacing for air and elegance */
.hero-text .headline {
  margin-top: 14px;
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 500;
  letter-spacing: 0.045em; /* micro-step increase */
  opacity: 0; /* initial state; GSAP animates to a quieter final opacity */
  font-family: 'Inter', sans-serif;
}

/* UPDATED: supporting line beneath headline made quieter with slightly smaller size and looser leading */
.hero-support {
  margin-top: 10px;
  color: #8c857a;
  font-family: 'Pangaia', serif;
  font-size: 0.9375rem; /* ~15px, slightly reduced */
  line-height: 1.8;     /* increased for softer editorial feel */
  opacity: 0.68;        /* quieter but legible */
}

/* ---------------- HERO CTAS (micro-adjustments: quieter, slightly smaller) ---------------- */
/* make action links feel invitational rather than promotional (reduced size + opacity) */
.hero-ctas {
  margin-top: 1.25rem; /* generous breathing space */
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.hero-ctas .cta {
  color: rgba(230,226,216,0.94);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;            /* slightly reduced from 0.9rem */
  letter-spacing: 0.12em;
  padding: 0.42rem 0.85rem;      /* slight padding tweak to balance smaller text */
  border: 1px solid rgba(201,162,77,0.12); /* very subtle metallic suggestion */
  background: transparent;
  line-height: 1;
  text-transform: uppercase;
  opacity: 0.82;                 /* quieter primary */
  transition: color .18s ease, opacity .18s ease, transform .12s ease;
}

.hero-ctas .cta:hover {
  color: #c9a24d;
  opacity: 1;
  transform: translateY(-1px);
}

/* ghost variant even quieter */
.hero-ctas .cta-ghost {
  font-size: 0.85rem;
  opacity: 0.72;                 /* quieter ghost */
  border-color: rgba(230,226,216,0.05);
  color: rgba(230,226,216,0.82);
}

/* mobile CTA sizing micro-adjust */
@media (max-width:900px) {
  .hero-ctas .cta,
  .hero-ctas .cta-ghost {
    font-size: 0.78rem;
  }
}

/* ---------------- SECTIONS ---------------- */
section {
  padding: 120px 8vw;
  scroll-margin-top: 100px;
}

.section-text {
  max-width: 680px;
  color: #8c857a;
  font-size: 1rem;
}

/* ---------------- MEDIA SCROLL ---------------- */
.media {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.media img,
.media video {
  width: 100%;
  height: 520px;
  object-fit: cover;
  box-shadow: 0 1.875rem 5rem rgba(0,0,0,0.6);
  border: 1px solid rgba(201, 162, 77, 0.35);
}

/* ---------------- COLLECTION ---------------- */
.collection {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 1.2s ease;
}

.collection-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 60px;
  align-items: center;
}

.collection img {
  width: 360px;
  height: 520px;
  object-fit: cover;
  opacity: 0;
  box-shadow: 0 1.875rem 5rem rgba(0,0,0,0.6);
  border: 1px solid rgba(201, 162, 77, 0.35);
}

.model-name {
  font-size: 1.4rem;
  letter-spacing: 0.22em;
  opacity: 0;
  font-family: 'Pangaia', serif;
}

/* ---------------- FOOTER ---------------- */
.footer-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-section video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.footer-content {
  text-align: center;
  color: #e6e2d8;
}

.footer-links {
  margin-bottom: 40px;
}

.footer-links a {
  color: #e6e2d8;
  text-decoration: none;
  margin: 0 20px;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #c9a24d;
}

.footer-content img {
  width: 200px;
  margin: 20px 0;
}

.patent {
  font-size: 0.8rem;
  color: #8c857a;
  margin: 10px 0;
}

.emotional-message {
  font-size: 1.2rem;
  font-family: 'Pangaia', serif;
  margin-top: 20px;
}

/* ---------------- MOBILE ---------------- */
@media (max-width: 900px) {
  .hero-text {
    max-width: 90%;
    position: absolute;
    top: 20%;
    left: 8vw;
  }

  .media {
    grid-template-columns: 1fr;
  }

  .media img,
  .media video {
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.6);
  }

  .collection-inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .collection img {
    width: 90%;
    height: 420px;
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.6);
  }

  .nav-menu {
    gap: 20px;
  }

  .nav-menu a {
    font-size: 0.8rem;
  }

  .footer-links a {
    margin: 0 10px;
    font-size: 0.8rem;
  }

  .footer-content img {
    width: 150px;
  }

  .emotional-message {
    font-size: 1rem;
  }

  .brand-intro {
    padding: 80px 8vw 60px;
  }

  .intro-content {
    text-align: center;
    max-width: 100%;
  }
}
</style>
</head>

<body>

<!-- NAVIGATION -->
<nav class="navbar" aria-label="Main navigation">
  <div class="nav-container">
    <div class="nav-brand">VELTRIN</div>
    <ul class="nav-menu">
      <li><a href="#home">Home</a></li>
      <li><a href="#collection">Collection</a></li>
      <li><a href="#engineering">Engineering</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
</nav>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-text">
    <div class="brand">VELTRIN</div>
    <div class="headline">Precision, refined.</div>

    <!-- editorial CTAs (left-aligned, quiet) -->
    <div class="hero-ctas" aria-hidden="false">
      <a href="#collection" class="cta">Explore Collection</a>
      <a href="#contact" class="cta cta-ghost">Enquire</a>
    </div>

    <p class="hero-support">Timeless design guided by measured restraint — crafted to endure.</p>
  </div>
</section>

<!-- BRAND INTRODUCTION -->
<section class="brand-intro">
  <div class="intro-content">
    <p>VELTRIN is defined by precision, restraint, and intention.</p>
    <p>Each timepiece is designed with a singular focus — to express time with clarity and enduring character.</p>
    <p>In a world of excess, VELTRIN stands apart through discipline of form and purpose.</p>
    <p>Our watches are created not to follow moments, but to outlast them.</p>
  </div>
</section>

<!-- MEDIA -->
<section class="media">
  <img class="fade-media" src="watch-detail.jpg" alt="Watch detail close-up" width="1200" height="520" loading="lazy" />
  <video class="fade-media" src="movement.mp4" poster="movement-poster.jpg" autoplay muted loop playsinline preload="metadata"></video>
</section>

<!-- COLLECTION -->
<section class="collection" id="collection">
  <div class="collection-inner">
    <!-- Provide initial src/alt/size to avoid empty layout until JS runs -->
    <img id="leftImg" src="origin-left.jpg" alt="Origin model left view" width="360" height="520" loading="lazy" />
    <div class="model-name" id="modelName">ORIGIN</div>
    <img id="rightImg" src="origin-right.jpg" alt="Origin model right view" width="360" height="520" loading="lazy" />
  </div>
</section>

<!-- ENGINEERING -->
<section class="fade-section" id="engineering">
  <p class="section-text">
    Precision engineering meets timeless design. Every VELTRIN watch is crafted with Swiss movement technology and innovative materials for unparalleled accuracy and durability.
  </p>
</section>

<section id="contact" class="footer-section">
  <video src="footer-video.mp4" poster="footer-poster.jpg" autoplay muted loop playsinline preload="metadata"></video>
  <div class="footer-content">
    <div class="footer-links">
      <a href="#">Instagram</a>
      <a href="#">Facebook</a>
      <a href="#">LinkedIn</a>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
    </div>
    <img src="footer-image.jpg" alt="VELTRIN logo" width="200" />
    <p class="patent">Patent Pending</p>
    <p class="emotional-message">Designed to endure. Built to remain.</p>
  </div>
</section>

<script>
gsap.registerPlugin(ScrollTrigger);

const isMobile = window.innerWidth < 900;

/* ---------------- HERO TEXT ---------------- */
/* Animate to slightly reduced opacity targets and subtle letter-spacing.
   Motion itself is unchanged; only final values are softened. */
gsap.to(".brand", {
  opacity: isMobile ? 0.90 : 0.92,
  delay: isMobile ? 0.5 : 0.8,
  duration: isMobile ? 1.0 : 1.2,
  ease: "power2.out"
});

gsap.to(".headline", {
  opacity: isMobile ? 0.90 : 0.92,
  letterSpacing: isMobile ? "0.03em" : "0.045em",
  delay: isMobile ? 1.5 : 2,
  duration: isMobile ? 1.2 : 1.4,
  ease: "power2.out"
});

/* ---------------- FADE SECTIONS ---------------- */
gsap.utils.toArray(".fade-section").forEach(section => {
  gsap.fromTo(section,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: true
      }
    }
  );
});

/* ---------------- BRAND INTRODUCTION ---------------- */
gsap.fromTo(".intro-content",
  { opacity: 0, y: 10 },
  {
    opacity: 1,
    y: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".brand-intro",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true
    }
  }
);

/* ---------------- MEDIA REVEAL ---------------- */
gsap.utils.toArray(".fade-media").forEach(media => {
  gsap.fromTo(media,
    { opacity: 0, scale: 0.96 },
    {
      opacity: 1,
      scale: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: media,
        start: "top 85%",
        end: "top 40%",
        scrub: true
      }
    }
  );
});

/* ---------------- COLLECTION MODELS ---------------- */
const models = [
  {
    name: "ORIGIN",
    bg: "#050505",
    left: "origin-left.jpg",
    right: "origin-right.jpg"
  },
  {
    name: "AXIS",
    bg: "#0a0a0a",
    left: "axis-left.jpg",
    right: "axis-right.jpg"
  },
  {
    name: "NOIR",
    bg: "#000000",
    left: "noir-left.jpg",
    right: "noir-right.jpg"
  }
];

const leftImg = document.getElementById("leftImg");
const rightImg = document.getElementById("rightImg");
const modelName = document.getElementById("modelName");
const collection = document.querySelector(".collection");

let index = 0;

function showModel(i) {
  const m = models[i];
  if (!m || !leftImg || !rightImg || !modelName || !collection) return;

  gsap.to([leftImg, rightImg, modelName], { opacity: 0, duration: 0.6 });

  setTimeout(() => {
    // swap sources and text
    leftImg.src = m.left;
    rightImg.src = m.right;
    leftImg.alt = m.name + " left view";
    rightImg.alt = m.name + " right view";
    modelName.textContent = m.name;
    collection.style.background = m.bg;

    gsap.to([leftImg, rightImg], { opacity: 1, duration: 1 });
    gsap.to(modelName, { opacity: 1, duration: 1, delay: 0.2 });
  }, 600);
}

/* Scroll-linked model change */
/* Fix: ensure index calculation never exceeds last array index */
ScrollTrigger.create({
  trigger: ".collection",
  start: "top center",
  end: "bottom center",
  scrub: true,
  onUpdate: self => {
    // floor(self.progress * models.length) could equal models.length when progress === 1
    const raw = Math.floor(self.progress * models.length);
    const newIndex = Math.min(models.length - 1, Math.max(0, raw));
    if (newIndex !== index && models[newIndex]) {
      index = newIndex;
      showModel(index);
    }
  }
});

/* Initial model (ensure initial DOM images reflect first model) */
showModel(0);

/* ---------------- SMOOTH SCROLL ---------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ---------------- FOOTER FADE ---------------- */
gsap.fromTo(".footer-section",
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".footer-section",
      start: "top 90%",
      end: "top 60%",
      scrub: true
    }
  }
);
</script>

</body>
</html>