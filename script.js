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

// Certificates Tabs
function initializeCertificateTabs() {
  const buttons = document.querySelectorAll('.cert-btn');
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
      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('show'));

      // Add active class to clicked button and show target content
      btn.classList.add('active');
      target.classList.add('show');
      
      // Smooth scroll to certificates section when changing tabs
      document.getElementById('certificates').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

// Certificate Carousel Functionality - FIXED
function changeCertificateImage(button, direction) {
  const card = button.closest('.card');
  const carousel = card.querySelector('.certificate-carousel');
  const slides = carousel.querySelectorAll('.certificate-slide');
  const indicator = card.querySelector('.carousel-indicator');
  
  let currentIndex = 0;
  slides.forEach((slide, index) => {
    if (slide.classList.contains('active')) {
      currentIndex = index;
      slide.classList.remove('active');
    }
  });
  
  let newIndex = (currentIndex + direction + slides.length) % slides.length;
  slides[newIndex].classList.add('active');
  indicator.textContent = `${newIndex + 1}/${slides.length}`;
}

// Make function global for onclick attributes
window.changeCertificateImage = changeCertificateImage;

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