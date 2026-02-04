// Masterpiece Loader with Image Loading Tracking
document.addEventListener('DOMContentLoaded', function() {
  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline();

  // Sequential Reveal: V and N first, then inner letters
  const letters = document.querySelectorAll('.letter');
  const v = letters[0];
  const n = letters[6];
  const inner = Array.from(letters).slice(1, 6);

  // Track all images and videos for loading
  const allImages = document.querySelectorAll('img');
  const allVideos = document.querySelectorAll('video');
  let loadedCount = 0;
  let totalCount = allImages.length + allVideos.length;

  function updateProgress() {
    const progressPercent = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = progressPercent + '%';
    }
  }

  function checkAllLoaded() {
    return loadedCount >= totalCount;
  }

  // Track image loads
  allImages.forEach((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      loadedCount++;
    } else {
      img.addEventListener('load', () => {
        loadedCount++;
        updateProgress();
        if (checkAllLoaded()) {
          setTimeout(triggerLoaderExit, 800);
        }
      });
      img.addEventListener('error', () => {
        loadedCount++;
        updateProgress();
        if (checkAllLoaded()) {
          setTimeout(triggerLoaderExit, 800);
        }
      });
    }
  });

  // Track video loads
  allVideos.forEach((video) => {
    if (video.readyState >= 3) {
      loadedCount++;
    } else {
      video.addEventListener('loadeddata', () => {
        loadedCount++;
        updateProgress();
        if (checkAllLoaded()) {
          setTimeout(triggerLoaderExit, 800);
        }
      });
    }
  });

  updateProgress();

  // Beautiful Animation Sequence
  // Phase 1: VELTRIN brand fades in elegantly FIRST (0-2.5s)
  tl.to("#logo", {
    opacity: 1,
    duration: 2.5,
    ease: "power1.inOut"
  }, 0)

  // Phase 2: V and N catch the light (2.5-4s) - starts AFTER brand is visible
  .to([v, n], { 
    opacity: 1, 
    y: 0, 
    duration: 1.2, 
    ease: "power2.inOut"
  }, 2.5)

  // Phase 3: Middle letters follow smoothly (3-5s)
  .to(inner, { 
    opacity: 1, 
    y: 0, 
    duration: 1.2, 
    stagger: 0.08, 
    ease: "power2.inOut" 
  }, 3)

  // Phase 4: Light sweep across text (3.5-6s)
  .to("#logo", {
    backgroundPositionX: "-200%",
    duration: 2.5,
    ease: "power1.inOut"
  }, 3.5)

  // Phase 5: Gold dot pulses (4-6.5s)
  .to("#dot", { scale: 1.5, repeat: 2, yoyo: true, duration: 0.7, ease: "sine.inOut" }, 4);


  function triggerLoaderExit() {
    const closeTl = gsap.timeline();
    closeTl
      // Fade everything out smoothly
      .to("#logo, #dot, #loading-text, .progress-container", { 
        opacity: 0, 
        filter: "blur(8px)", 
        duration: 0.8,
        ease: "power1.inOut"
      }, 0)
      // Shutters slide open dramatically
      .to(".shutter.left", { 
        xPercent: -101, 
        duration: 1.2, 
        ease: "expo.inOut" 
      }, 0.2)
      .to(".shutter.right", { 
        xPercent: 101, 
        duration: 1.2, 
        ease: "expo.inOut" 
      }, 0.2)
      // Hide loader
      .set("#loader-wrapper", { display: "none" }, "-=0.5")
      // Show navbar and unlock scroll
      .call(() => {
        document.body.style.overflow = 'auto';
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.style.opacity = '1';
        if (navbar) navbar.style.pointerEvents = 'auto';
      }, null, 0);
  }

  // Fallback timeout (12 seconds)
  setTimeout(() => {
    const loader = document.getElementById('loader-wrapper');
    if (loader && loader.style.display !== 'none') {
      triggerLoaderExit();
    }
  }, 12000);

  // Ensure exit after window load
  window.addEventListener('load', () => {
    if (checkAllLoaded()) {
      setTimeout(triggerLoaderExit, 800);
    }
  });
});




