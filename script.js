// Smooth scroll for navbar links
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

// Typing effect for tagline
const typedText = document.querySelector('.typed-text');
if (typedText) {
  const words = ["AI Engineer", "Data Scientist", "Full Stack Developer", "Problem Solver"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typeEffect() {
    const currentWord = words[wordIndex];
    typedText.textContent = currentWord.substring(0, charIndex);

    if (!isDeleting && charIndex < currentWord.length) {
      charIndex++;
      setTimeout(typeEffect, 100);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(typeEffect, 50);
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        wordIndex = (wordIndex + 1) % words.length;
      }
      setTimeout(typeEffect, 1000);
    }
  }
  
  // Start the typing effect after a short delay
  setTimeout(typeEffect, 1000);
}

// Button ripple hover effect
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--x', `${x}px`);
    btn.style.setProperty('--y', `${y}px`);
  });
});

// Scroll reveal animations
function initializeScrollAnimations() {
  const animatedElements = [
    ...document.querySelectorAll(".about-photo img"),
    ...document.querySelectorAll(".about-info h2"),
    ...document.querySelectorAll(".about-info p"),
    ...document.querySelectorAll(".about-info ul li"),
    ...document.querySelectorAll(".social-icons a"),
    ...document.querySelectorAll(".education-section .card"),
    ...document.querySelectorAll(".skill-card"),
    ...document.querySelectorAll(".project-card"),
    ...document.querySelectorAll(".certificates-section .card"),
    ...document.querySelectorAll(".contact-card")
  ];

  animatedElements.forEach((el, i) => {
    el.classList.add("will-animate");
    el.style.setProperty("--stagger", `${i * 100}ms`);
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        entry.target.classList.remove("will-animate");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => observer.observe(el));
}
// Enhanced Certificate Section Functionality
function initializeCertificateTabs() {
  const buttons = document.querySelectorAll('.cert-tab');
  const contents = document.querySelectorAll('.cert-content');

  // Show first section by default
  if (contents.length > 0) {
    contents[0].classList.add('show');
    buttons[0].classList.add('active');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);

      // Remove active class from all buttons and hide all contents
      buttons.forEach(b => {
        b.classList.remove('active');
        b.style.transform = 'translateY(0)';
      });
      contents.forEach(c => c.classList.remove('show'));

      // Add active class to clicked button and show target content
      btn.classList.add('active');
      btn.style.transform = 'translateY(-2px)';
      target.classList.add('show');
    });
  });
}

// Enhanced Certificate Carousel Functionality - FIXED SCOPE ISSUE
function changeCertificateImage(button, direction) {
  const card = button.closest('.cert-card');
  const carousel = card.querySelector('.certificate-carousel');
  const slides = carousel.querySelectorAll('.certificate-slide');
  const indicator = card.querySelector('.carousel-indicator');
  
  let currentIndex = 0;
  
  // Find current active slide - ONLY IN THIS SPECIFIC CAROUSEL
  slides.forEach((slide, index) => {
    if (slide.classList.contains('active')) {
      currentIndex = index;
      slide.classList.remove('active');
    }
  });
  
  // Calculate new index with wrap-around
  let newIndex = (currentIndex + direction + slides.length) % slides.length;
  
  // Show new slide - ONLY IN THIS SPECIFIC CAROUSEL
  slides[newIndex].classList.add('active');
  indicator.textContent = `${newIndex + 1}/${slides.length}`;
}

// Initialize individual carousels properly
function initializeCarousels() {
  const carousels = document.querySelectorAll('.certificate-carousel');
  
  carousels.forEach((carousel, index) => {
    const slides = carousel.querySelectorAll('.certificate-slide');
    const indicator = carousel.querySelector('.carousel-indicator');
    
    // Initialize first slide as active for each carousel
    if (slides.length > 0) {
      slides[0].classList.add('active');
      if (indicator) {
        indicator.textContent = `1/${slides.length}`;
      }
    }
    
    // Add unique event listeners for each carousel's buttons
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        changeCertificateImage(this, -1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        changeCertificateImage(this, 1);
      });
    }
    
    // Add touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', function(e) {
      endX = e.changedTouches[0].clientX;
      handleSwipe(this);
    });
    
    function handleSwipe(carouselElement) {
      const swipeThreshold = 50;
      const difference = startX - endX;
      
      if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
          // Swipe left - next
          const nextBtn = carouselElement.querySelector('.carousel-btn.next');
          if (nextBtn) changeCertificateImage(nextBtn, 1);
        } else {
          // Swipe right - previous
          const prevBtn = carouselElement.querySelector('.carousel-btn.prev');
          if (prevBtn) changeCertificateImage(prevBtn, -1);
        }
      }
    }
  });
}

// Auto-rotate carousel for certificates with multiple images
function initializeAutoCarousel() {
  const carousels = document.querySelectorAll('.certificate-carousel');
  
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.certificate-slide');
    if (slides.length > 1) {
      let autoRotateInterval;
      
      const startAutoRotate = () => {
        autoRotateInterval = setInterval(() => {
          const nextBtn = carousel.querySelector('.carousel-btn.next');
          if (nextBtn) {
            changeCertificateImage(nextBtn, 1);
          }
        }, 5000); // Rotate every 5 seconds
      };
      
      const stopAutoRotate = () => {
        if (autoRotateInterval) {
          clearInterval(autoRotateInterval);
        }
      };
      
      // Start auto-rotate when card is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAutoRotate();
          } else {
            stopAutoRotate();
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(carousel.closest('.cert-card'));
      
      // Pause auto-rotate on hover
      const card = carousel.closest('.cert-card');
      card.addEventListener('mouseenter', stopAutoRotate);
      card.addEventListener('mouseleave', startAutoRotate);
      
      // Pause auto-rotate on touch
      card.addEventListener('touchstart', stopAutoRotate);
      card.addEventListener('touchend', () => {
        setTimeout(startAutoRotate, 3000); // Resume after 3 seconds
      });
    }
  });
}

// Certificate modal view for larger images
function initializeCertificateModal() {
  const certificateImages = document.querySelectorAll('.certificate-img');
  
  certificateImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    
    img.addEventListener('click', function() {
      // Get the current active slide if it's in a carousel
      const carousel = this.closest('.certificate-carousel');
      let imageSrc = this.src;
      let imageAlt = this.alt;
      
      if (carousel) {
        const activeSlide = carousel.querySelector('.certificate-slide.active');
        if (activeSlide) {
          const activeImg = activeSlide.querySelector('.certificate-img');
          if (activeImg) {
            imageSrc = activeImg.src;
            imageAlt = activeImg.alt;
          }
        }
      }
      
      const modal = document.createElement('div');
      modal.className = 'certificate-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <img src="${imageSrc}" alt="${imageAlt}" class="modal-certificate-img">
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Close modal functionality
      const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
      };
      
      modal.querySelector('.close-modal').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      
      // Close on escape key
      document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', closeOnEscape);
        }
      });
      
      document.body.style.overflow = 'hidden';
    });
  });
}

// Add CSS for modal and carousel transitions
function injectModalStyles() {
  const modalStyles = `
    .certificate-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    }
    
    .certificate-modal .modal-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .modal-certificate-img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
    }
    
    .close-modal {
      position: absolute;
      top: -40px;
      right: 0;
      color: white;
      font-size: 40px;
      cursor: pointer;
      transition: color 0.3s ease;
      z-index: 10000;
    }
    
    .close-modal:hover {
      color: var(--primary);
    }
    
    /* Smooth carousel transitions */
    .certificate-slide {
      transition: opacity 0.4s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Mobile touch improvements */
    .certificate-carousel {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = modalStyles;
  document.head.appendChild(styleSheet);
}

// Reset all carousels to first slide
function resetAllCarousels() {
  const carousels = document.querySelectorAll('.certificate-carousel');
  
  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.certificate-slide');
    const indicator = carousel.querySelector('.carousel-indicator');
    
    // Remove active from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Activate first slide
    if (slides.length > 0) {
      slides[0].classList.add('active');
      if (indicator) {
        indicator.textContent = `1/${slides.length}`;
      }
    }
  });
}

// Initialize all certificate functionality
function initializeCertificateSection() {
  initializeCertificateTabs();
  initializeCarousels(); // Use the new fixed function
  initializeAutoCarousel();
  injectModalStyles();
  initializeCertificateModal();
  
  // Reset carousels when switching tabs
  const tabButtons = document.querySelectorAll('.cert-tab');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', resetAllCarousels);
  });
  
  // Add scroll animations for certificate cards
  const certCards = document.querySelectorAll('.cert-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  certCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// Make functions globally available
window.changeCertificateImage = changeCertificateImage;
window.resetAllCarousels = resetAllCarousels;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeCertificateSection();
});

// Re-initialize carousels when the page becomes visible again
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    setTimeout(initializeCarousels, 100);
  }
});


// Contact Form Handler
function initializeContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const subject = this.querySelectorAll('input[type="text"]')[1].value;
      const message = this.querySelector('textarea').value;
      
      // Simple form validation
      if (name && email && subject && message) {
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        alert(`Thank you ${name}! Your message has been sent. I'll get back to you soon.`);
        this.reset();
      } else {
        alert('Please fill in all required fields.');
      }
    });
  }
}

// Navbar active state update on scroll
function initializeNavbarScroll() {
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 100)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeScrollAnimations();
  initializeCertificateTabs();
  initializeContactForm();
  initializeNavbarScroll();
  
  // Scroll reveal fallback (if IntersectionObserver fails)
  if (typeof AOS === "undefined") {
    document.querySelectorAll("[data-aos]").forEach(el => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
  }
});

// Add some console styling for fun
console.log(`
%cAbarna's Portfolio 🚀
%cBuilt with passion and attention to detail!
`, 
'color: #64ffda; font-size: 18px; font-weight: bold;',
'color: #ccd6f6; font-size: 14px;'
);

// Make carousel function global for onclick attributes
window.changeCertificateImage = changeCertificateImage;
function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");
    toastMsg.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });

    if (res.ok) {
      showToast("Message sent successfully 🚀");
      form.reset();
    } else {
      showToast("Something went wrong ❌");
    }
  });
