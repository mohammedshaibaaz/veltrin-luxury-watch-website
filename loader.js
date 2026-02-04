// Image Loading Detector & Loader Animation
(function() {
  const loaderWrapper = document.getElementById('loader-wrapper');
  const progressBar = document.getElementById('progress-bar');
  const loadingText = document.getElementById('loading-text');
  
  // Prevent scrolling during loader
  document.body.style.overflow = 'hidden';
  
  if (!loaderWrapper) return;

  // Track all images
  function initializeLoader() {
    const allImages = document.querySelectorAll('img, video');
    let loadedCount = 0;
    let totalCount = allImages.length || 1;
    let fakeProgress = 0;

    // Simulate fake progress while waiting for real loading
    const fakeProgressInterval = setInterval(() => {
      if (fakeProgress < 85) {
        fakeProgress += Math.random() * 25;
        updateProgress(Math.min(fakeProgress, 85));
      }
    }, 400);

    function updateProgress(percentage) {
      if (progressBar) {
        progressBar.style.setProperty('--progress', percentage + '%');
      }
    }

    function checkIfAllLoaded() {
      if (loadedCount >= totalCount) {
        clearInterval(fakeProgressInterval);
        updateProgress(100);
        return true;
      }
      return false;
    }

    // Track image loads
    allImages.forEach((img) => {
      if (img.tagName === 'IMG') {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener('load', () => {
            loadedCount++;
            const realProgress = (loadedCount / totalCount) * 85;
            updateProgress(Math.max(fakeProgress, realProgress));
            if (checkIfAllLoaded()) setTimeout(closeLoader, 500);
          });
          img.addEventListener('error', () => {
            loadedCount++;
            if (checkIfAllLoaded()) setTimeout(closeLoader, 500);
          });
        }
      } else if (img.tagName === 'VIDEO') {
        img.addEventListener('loadeddata', () => {
          loadedCount++;
          const realProgress = (loadedCount / totalCount) * 85;
          updateProgress(Math.max(fakeProgress, realProgress));
          if (checkIfAllLoaded()) setTimeout(closeLoader, 500);
        });
      }
    });

    // If no images, close after minimum time
    if (totalCount === 0) {
      setTimeout(closeLoader, 2000);
    }

    // Fallback timeout (max 6 seconds)
    setTimeout(() => {
      if (loaderWrapper && loaderWrapper.style.display !== 'none') {
        updateProgress(100);
        setTimeout(closeLoader, 300);
      }
    }, 6000);

    // GSAP Animation Timeline
    const tl = gsap.timeline();
    const letters = document.querySelectorAll('.letter');
    const v = letters[0];
    const n = letters[6];
    const inner = Array.from(letters).slice(1, 6);

    // Sequential Reveal: V and N first, then inner letters
    tl.to([v, n], {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.inOut",
      delay: 0.2
    })
    .to(inner, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.08,
      ease: "power2.inOut"
    }, "-=0.7")
    .to("#logo", {
      backgroundPositionX: "-200%",
      duration: 2.2,
      ease: "power1.inOut"
    }, "-=0.9")
    .to("#loading-text", { opacity: 1, duration: 0.7 }, "-=1.2")
    .to("#progress-bar", { opacity: 1, duration: 0.5 }, "-=0.5");

    function closeLoader() {
      if (!loaderWrapper) return;

      const closeTl = gsap.timeline();
      closeTl
        .to("#logo, #loading-text, #progress-bar", { opacity: 0, filter: "blur(10px)", duration: 0.8 })
        .to(".shutter.left", { xPercent: -105, duration: 1.2, ease: "expo.inOut" }, "-=0.3")
        .to(".shutter.right", { xPercent: 105, duration: 1.2, ease: "expo.inOut" }, "<")
        .set("#loader-wrapper", { display: "none", pointerEvents: "none" })
        .call(() => {
          document.body.style.overflow = 'auto';
        });
    }
  }

  // Start loader when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLoader);
  } else {
    initializeLoader();
  }
})();
