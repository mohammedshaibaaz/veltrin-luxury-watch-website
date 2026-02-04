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
    // Wait for all images including background images
    const allImages = document.querySelectorAll('img');
    const allVideos = document.querySelectorAll('video');
    let loadedCount = 0;
    let totalCount = allImages.length + allVideos.length;
    let fakeProgress = 0;
    let allImagesLoaded = false;

    // Smooth fake progress animation
    const fakeProgressInterval = setInterval(() => {
      if (fakeProgress < 70) {
        fakeProgress += Math.random() * 3 + 1; // Smaller increments for smoother animation
        updateProgress(Math.min(fakeProgress, 70));
      }
    }, 150); // More frequent updates for smoother animation

    function updateProgress(percentage) {
      if (progressBar) {
        progressBar.style.setProperty('--progress', percentage + '%');
      }
    }

    function checkIfAllLoaded() {
      if (loadedCount >= totalCount && allImagesLoaded) {
        clearInterval(fakeProgressInterval);
        updateProgress(100);
        return true;
      }
      return false;
    }

    // Track image loads
    allImages.forEach((img) => {
      if (img.complete && img.naturalHeight !== 0) {
        loadedCount++;
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          const realProgress = (loadedCount / totalCount) * 95;
          updateProgress(Math.max(fakeProgress, realProgress));
          if (checkIfAllLoaded()) setTimeout(closeLoader, 1000);
        });
        img.addEventListener('error', () => {
          loadedCount++;
          if (checkIfAllLoaded()) setTimeout(closeLoader, 1000);
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
          const realProgress = (loadedCount / totalCount) * 95;
          updateProgress(Math.max(fakeProgress, realProgress));
          if (checkIfAllLoaded()) setTimeout(closeLoader, 1000);
        });
      }
    });

    // Wait for window.load event to ensure everything is ready
    window.addEventListener('load', () => {
      allImagesLoaded = true;
      if (checkIfAllLoaded()) {
        setTimeout(closeLoader, 1000);
      }
    });

    // Fallback timeout increased to 15 seconds for slower connections
    setTimeout(() => {
      if (loaderWrapper && loaderWrapper.style.display !== 'none') {
        allImagesLoaded = true;
        updateProgress(100);
        setTimeout(closeLoader, 500);
      }
    }, 15000);

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
