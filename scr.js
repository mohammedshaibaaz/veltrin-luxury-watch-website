(function () {
  // ------------------ Helper: wrap first sentence in .lead ------------------
  function wrapFirstSentence(containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    var p = container.querySelector('p');
    if (!p) return;

    // If there's already a .lead element inside the first paragraph, do nothing.
    if (p.querySelector('.lead')) return;

    var text = p.textContent.trim();
    if (!text) return;

    // Find the first sentence using a simple regex for . ? !
    var sentenceRegex = /([\s\S]*?[\.?!])(\s+|$)([\s\S]*)/;
    var match = text.match(sentenceRegex);
    if (!match) return;

    var firstSentence = match[1];
    var remainder = match[3] || '';

    var span = document.createElement('span');
    span.className = 'lead';
    span.textContent = firstSentence;

    p.textContent = '';
    p.appendChild(span);
    if (remainder) {
      p.appendChild(document.createTextNode(' ' + remainder.trim()));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      wrapFirstSentence('.brand-intro .intro-content');
      wrapFirstSentence('.veltrin-intro'); // fallback if you add a dedicated container
    });
  } else {
    wrapFirstSentence('.brand-intro .intro-content');
    wrapFirstSentence('.veltrin-intro');
  }

  // ------------------ GSAP animation micro-targets ------------------
  // Guard GSAP-specific code so it doesn't abort the rest of the script when GSAP is absent.
  if (typeof gsap !== 'undefined') {
    try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* ignore if plugin not present */ }

    var isMobile = window.innerWidth < 900;

    // Brand micro final opacity
   // BRAND — first impression
// Brand name — appears first, calm and confident
// Brand — first, calm authority
gsap.to(".brand", {
  opacity: isMobile ? 0.9 : 0.92,
  delay: isMobile ? 0.4 : 0.6,
  duration: isMobile ? 0.9 : 1.1,
  ease: "power2.out"
});

// Headline line 1 — Precision
gsap.to(".headline .headline-1", {
  opacity: isMobile ? 0.9 : 0.92,
  letterSpacing: isMobile ? "0.04em" : "0.06em",
  delay: isMobile ? 1.3 : 1.6,
  duration: isMobile ? 1.0 : 1.2,
  ease: "power2.out"
});

// Headline line 2 — Refined
gsap.to(".headline .headline-2", {
  opacity: isMobile ? 0.9 : 0.92,
  letterSpacing: isMobile ? "0.04em" : "0.06em",
  delay: isMobile ? 1.9 : 2.3,
  duration: isMobile ? 1.0 : 1.2,
  ease: "power2.out"
});

// Supporting line — slow, restrained
gsap.to(".hero-support", {
  opacity: isMobile ? 0.65 : 0.72,
  delay: isMobile ? 2.8 : 3.3,
  duration: isMobile ? 2.2 : 2.8,
  ease: "power1.out"
});


    // Fade-in for fade-section blocks

    // Intro content reveal (brand-intro)
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






    // Media reveal animations
   
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
    body.classList.toggle('menu-open', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      body.classList.remove('menu-open');
      body.style.overflow = '';
    });
  });
});

// ===================== FAQ FUNCTIONALITY =====================
document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  const faqSearch = document.getElementById('faq-search');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isVisible = answer.style.display !== 'none';
      
      // Close all other answers
      document.querySelectorAll('.faq-answer').forEach(a => {
        a.style.display = 'none';
      });
      
      // Toggle current answer
      answer.style.display = isVisible ? 'none' : 'block';
    });
  });

  // FAQ Search
  if (faqSearch) {
    faqSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question').textContent.toLowerCase();
        if (question.includes(searchTerm)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});

// ===================== ADVANCED FORM VALIDATION & SUBMISSION =====================
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const model = document.getElementById('model');
  const message = document.getElementById('message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const modelError = document.getElementById('model-error');
  const messageError = document.getElementById('message-error');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error-message');

  // Function to validate email
  const validateEmail = (emailValue) => {
    return emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  };

  // Function to show error
  const showError = (input, errorSpan, message) => {
    input.classList.add('error');
    errorSpan.textContent = message;
    errorSpan.classList.add('show');
  };

  // Function to clear error
  const clearError = (input, errorSpan) => {
    input.classList.remove('error');
    errorSpan.textContent = '';
    errorSpan.classList.remove('show');
  };

  // Real-time validation on blur for Name field
  if (name) {
    name.addEventListener('blur', function() {
      if (!this.value.trim()) {
        showError(this, nameError, 'Please provide your name');
      } else {
        clearError(this, nameError);
      }
    });
    name.addEventListener('input', function() {
      if (this.value.trim() && this.classList.contains('error')) {
        clearError(this, nameError);
      }
    });
  }

  // Real-time validation on blur for Email field
  if (email) {
    email.addEventListener('blur', function() {
      if (!this.value) {
        showError(this, emailError, 'Email address is required');
      } else if (!validateEmail(this.value)) {
        showError(this, emailError, 'Please enter a valid email address');
      } else {
        clearError(this, emailError);
      }
    });
    email.addEventListener('input', function() {
      if (validateEmail(this.value) && this.classList.contains('error')) {
        clearError(this, emailError);
      }
    });
  }

  // Real-time validation for dropdown/select field
  if (model) {
    model.addEventListener('change', function() {
      if (this.value) {
        clearError(this, modelError);
      }
    });
  }

  // Form submission validation
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset all messages
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';
    let isValid = true;

    // Validate name
    if (!name || !name.value.trim()) {
      showError(name, nameError, 'Please provide your name');
      isValid = false;
    } else {
      clearError(name, nameError);
    }

    // Validate email
    if (!email.value) {
      showError(email, emailError, 'Email address is required');
      isValid = false;
    } else if (!validateEmail(email.value)) {
      showError(email, emailError, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(email, emailError);
    }

    // Validate model selection
    if (!model.value) {
      showError(model, modelError, 'Please select a timepiece');
      isValid = false;
    } else {
      clearError(model, modelError);
    }

    if (!isValid) {
      errorMsg.style.display = 'block';
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    } else {
      // Submit to Netlify (AJAX) so submissions appear in the dashboard
      const formData = new FormData(form);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
        .then(() => {
          successMsg.style.display = 'block';
          form.reset();

          // Clear any remaining error states
          form.querySelectorAll('input, select, textarea').forEach(field => {
            field.classList.remove('error');
          });
          form.querySelectorAll('.form-error').forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
          });
        })
        .catch(() => {
          errorMsg.textContent = 'Submission failed. Please try again.';
          errorMsg.style.display = 'block';
        });
    }
  });
});

// ===================== NEWSLETTER SUBSCRIPTION =====================
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailField = this.querySelector('input[type="email"]');
      if (!emailField || !emailField.value) return;

      const formData = new FormData(this);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
        .then(() => {
          alert('Thank you for subscribing! Check your email for confirmation.');
          this.reset();
        })
        .catch(() => {
          alert('Subscription failed. Please try again.');
        });
    });
  }
});
