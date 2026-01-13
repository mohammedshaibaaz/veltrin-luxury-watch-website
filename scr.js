(function () {
  // ------------------ Image Loading Optimization ------------------
  // Add smooth fade-in effect for lazy loaded images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.complete) {
            img.classList.add('loaded');
          } else {
            img.addEventListener('load', () => {
              img.classList.add('loaded');
            });
          }
        }
      });
    }, { rootMargin: '100px' });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.addEventListener('load', () => img.classList.add('loaded'));
    });
  }

  // ------------------ GSAP animation micro-targets ------------------
  // Guard GSAP-specific code so it doesn't abort the rest of the script when GSAP is absent.
  if (typeof gsap !== 'undefined') {
    try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* ignore if plugin not present */ }

    var isMobile = window.innerWidth < 900;

    // Brand animation
    gsap.to(".brand", {
  opacity: isMobile ? 0.9 : 0.92,
  delay: isMobile ? 0.4 : 0.6,
  duration: isMobile ? 0.9 : 1.1,
  ease: "power2.out"
});

    // Headline line 1
    gsap.to(".headline .headline-1", {
  opacity: isMobile ? 0.9 : 0.92,
  letterSpacing: isMobile ? "0.04em" : "0.06em",
  delay: isMobile ? 1.3 : 1.6,
  duration: isMobile ? 1.0 : 1.2,
  ease: "power2.out"
});

    // Headline line 2
    gsap.to(".headline .headline-2", {
  opacity: isMobile ? 0.9 : 0.92,
  letterSpacing: isMobile ? "0.04em" : "0.06em",
  delay: isMobile ? 1.9 : 2.3,
  duration: isMobile ? 1.0 : 1.2,
  ease: "power2.out"
});

    // Supporting text
    gsap.to(".hero-support", {
  opacity: isMobile ? 0.65 : 0.72,
  delay: isMobile ? 2.8 : 3.3,
  duration: isMobile ? 2.2 : 2.8,
  ease: "power1.out"
});


    // Intro content reveal
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

    // Craftsmanship text reveal
    gsap.fromTo(
  ".craftsmanship-text",
  { opacity: 0.92 },
  {
    opacity: 1,
    duration: 1.2,
    ease: "power1.out",
    scrollTrigger: {
      trigger: ".craftsmanship-section.text-stage",
      start: "top 60%",
      once: true
    }
  }
);





  } // end GSAP guard

  // ------------------ Collection-only logic (runs regardless of GSAP) ------------------
  (function () {
    function onReady(fn) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
      } else {
        fn();
      }
    }

    onReady(function () {
      var section = document.querySelector(".collection-section");
      if (!section) return;

      var items = section.querySelectorAll(".collection-item");
      if (!items || items.length === 0) return;

      var activeIndex = 0;
      var fgIndex = 0;
      var fgInterval = null;

      function activateForegroundImages() {
        var activeItem = items[activeIndex];
        if (!activeItem) return;
        var imgs = activeItem.querySelectorAll('.image-stack img');
        if (!imgs || imgs.length === 0) return;

        fgIndex = fgIndex % imgs.length;
        imgs.forEach(function (img, i) {
          img.classList.toggle('active', i === fgIndex);
        });
      }

      function startFgInterval() {
        stopFgInterval();
        fgInterval = setInterval(function () {
          var activeItem = items[activeIndex];
          if (!activeItem) return;
          var imgs = activeItem.querySelectorAll('.image-stack img');
          if (!imgs || imgs.length === 0) return;
          fgIndex = (fgIndex + 1) % imgs.length;
          activateForegroundImages();
        }, 3500);
      }

      function stopFgInterval() {
        if (fgInterval) {
          clearInterval(fgInterval);
          fgInterval = null;
        }
      }

      function setActiveIndex(newIndex) {
        newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
        if (newIndex === activeIndex) return;

        items[activeIndex].classList.remove('active');
        items[newIndex].classList.add('active');

        activeIndex = newIndex;
        fgIndex = 0;
        activateForegroundImages();

        var bg = items[newIndex].dataset && items[newIndex].dataset.bg ? items[newIndex].dataset.bg : '';
        section.style.backgroundImage = bg ? 'url(' + bg + ')' : '';
      }

      // rAF-throttled scroll handler
      var ticking = false;
      function updateCollectionOnScroll() {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        var scrollY = window.scrollY || window.pageYOffset;
        var progress = Math.min(Math.max((scrollY - sectionTop) / sectionHeight, 0), 1);
        var idx = Math.min(Math.floor(progress * items.length), items.length - 1);
        if (idx !== activeIndex) setActiveIndex(idx);
      }

      function onScroll() {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            updateCollectionOnScroll();
            ticking = false;
          });
          ticking = true;
        }
      }

      // init
      items.forEach(function (it, i) { it.classList.toggle('active', i === 0); });
      var initialBg = items[0] && items[0].dataset && items[0].dataset.bg ? items[0].dataset.bg : '';
      section.style.backgroundImage = initialBg ? 'url(' + initialBg + ')' : '';
      activateForegroundImages();
      startFgInterval();
      updateCollectionOnScroll();

      // events
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () { setTimeout(updateCollectionOnScroll, 120); });
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stopFgInterval(); else startFgInterval();
      });
    });
  })();

})();



// Craftsmanship 3-stage reveal
// Craftsmanship DEBUG VERSION
// Craftsmanship video autoplay
document.addEventListener('DOMContentLoaded', function() {
    var video = document.querySelector('.craftsmanship-video');
    if (video) {
        video.play();
    }
});


// Smooth scroll for nav links - FIXED for collection
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const navbarHeight = 80;
      // Use getBoundingClientRect for accurate positioning
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    body.classList.toggle('menu-open', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
      body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
      body.style.overflow = '';
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      body.classList.remove('menu-open');
      body.style.overflow = '';
    }
  });
});

// ===================== FORM VALIDATION & SUBMISSION =====================
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    // Don't prevent default - let Netlify Forms handle submission
    // e.preventDefault(); // Removed for Netlify Forms
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const watch = document.getElementById('watch');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const watchError = document.getElementById('watch-error');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error-message');
    
    // Reset messages
    if (nameError) nameError.textContent = '';
    emailError.textContent = '';
    watchError.textContent = '';
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';
    
    // Validate
    let isValid = true;
    
    if (name && !name.value.trim()) {
      nameError.textContent = 'Please enter your name';
      isValid = false;
    }
    
    if (!email.value || !email.value.includes('@')) {
      emailError.textContent = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!watch.value) {
      watchError.textContent = 'Please select a watch model';
      isValid = false;
    }
    
    if (!isValid) {
      e.preventDefault();
      errorMsg.style.display = 'block';
    }
    // If valid, let form submit to Netlify
  });
});

// ===================== NEWSLETTER SUBSCRIPTION =====================
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (!newsletterForm) return;
  
  const emailInput = document.getElementById('newsletter-email');
  const successMsg = document.getElementById('newsletter-success');
  const errorMsg = document.getElementById('newsletter-error');
  
  // Load saved subscription status
  const subscribers = JSON.parse(localStorage.getItem('veltrin_subscribers') || '[]');
  if (subscribers.includes(emailInput.value)) {
    successMsg.textContent = '✓ Already subscribed!';
    successMsg.style.display = 'block';
  }
  
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value;
    
    // Simple email validation
    if (!email || !email.includes('@')) {
      errorMsg.style.display = 'block';
      successMsg.style.display = 'none';
      return;
    }
    
    // Save to localStorage
    let subscribers = JSON.parse(localStorage.getItem('veltrin_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('veltrin_subscribers', JSON.stringify(subscribers));
    }
    
    // Show success
    successMsg.textContent = '✓ Thank you for subscribing!';
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';
    emailInput.value = '';
    
    // Log subscription
    console.log('Newsletter subscription:', email);
  });
});

// ===================== WISHLIST FUNCTIONALITY =====================
document.addEventListener('DOMContentLoaded', function() {
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  if (wishlistBtns.length === 0) return;
  
  // Load wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem('veltrin_wishlist') || '[]');
  
  // Mark active items
  wishlistBtns.forEach(btn => {
    const model = btn.closest('[data-model]').dataset.model;
    if (wishlist.includes(model)) {
      btn.classList.add('active');
      btn.textContent = '♥';
    }
  });
  
  // Add click handlers
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const model = btn.closest('[data-model]').dataset.model;
      let wishlist = JSON.parse(localStorage.getItem('veltrin_wishlist') || '[]');
      
      if (wishlist.includes(model)) {
        wishlist = wishlist.filter(m => m !== model);
        btn.classList.remove('active');
        btn.textContent = '♡';
      } else {
        wishlist.push(model);
        btn.classList.add('active');
        btn.textContent = '♥';
      }
      
      localStorage.setItem('veltrin_wishlist', JSON.stringify(wishlist));
      console.log('Wishlist updated:', wishlist);
    });
  });
});

// ===================== FAQ SEARCH & FILTER =====================
document.addEventListener('DOMContentLoaded', function() {
  const faqSearch = document.getElementById('faq-search');
  const faqList = document.querySelector('.faq-list');
  if (!faqSearch || !faqList) return;
  
  const details = faqList.querySelectorAll('details');
  
  // Show all by default
  details.forEach(detail => {
    detail.classList.add('visible');
  });
  
  faqSearch.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    
    details.forEach(detail => {
      const summary = detail.querySelector('summary').textContent.toLowerCase();
      const content = detail.querySelector('p').textContent.toLowerCase();
      
      if (summary.includes(query) || content.includes(query) || query === '') {
        detail.classList.add('visible');
      } else {
        detail.classList.remove('visible');
      }
    });
  });
});

// ===================== KEYBOARD NAVIGATION & FOCUS MANAGEMENT =====================
document.addEventListener('DOMContentLoaded', function() {
  // Enhance focus visibility on all interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
  
  interactiveElements.forEach(el => {
    el.addEventListener('focus', function() {
      this.style.outline = '2px solid #d4a574';
      this.style.outlineOffset = '2px';
    });
    
    el.addEventListener('blur', function() {
      this.style.outline = 'none';
    });
  });
  
  // Trap focus in mobile menu
  const mobileNav = document.querySelector('.mobile-nav');
  const hamburger = document.querySelector('.hamburger');
  
  if (mobileNav && hamburger) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// ===================== ENHANCED TOUCH SUPPORT FOR COLLECTION =====================
document.addEventListener('DOMContentLoaded', function() {
  const collectionSection = document.querySelector('.collection-section');
  if (!collectionSection) return;
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  collectionSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  collectionSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
      // Swiped left - next
      console.log('Swiped left');
    }
    if (touchEndX - touchStartX > 50) {
      // Swiped right - previous
      console.log('Swiped right');
    }
  }
});
