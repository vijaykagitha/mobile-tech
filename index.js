// Global variables
let courseData = null;
let isDataLoaded = false;
let currentSlide = 0;
let slideshowInterval = null;

// DOM elements
const elements = {
  courseName: document.getElementById('course-name'),
  courseDuration: document.getElementById('course-duration'),
  coursePrice: document.getElementById('course-price'),
  courseCurrency: document.getElementById('course-currency'),
  courseIncludes: document.getElementById('course-includes'),
  courseHighlights: document.getElementById('course-highlights'),
  careerTitle: document.getElementById('career-title'),
  careerGoal: document.getElementById('career-goal'),
  careerTopicsList: document.getElementById('career-topics-list'),
  careerBg: document.getElementById('career-bg'),
  formAlerts: document.getElementById('form-alerts'),
  topicsSlideshow: document.getElementById('topics-slideshow'),
  slideshowDots: document.getElementById('slideshow-dots')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Main initialization function
async function initializeApp() {
  try {
    // Initialize AOS animations
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    // Load course data
    await loadCourseData();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize counter animations
    initializeCounterAnimations();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize slideshow
    initializeSlideshow();
    
    // Initialize additional features
    initializeCardHoverEffects();
    initializeScrollProgress();
    initializeWhatsAppWidget();
    
    // Start typing effect after a delay
    setTimeout(initializeTypingEffect, 2000);
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
    showError('Failed to load course data. Please refresh the page.');
  }
}

// Load course data from JSON
async function loadCourseData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    courseData = await response.json();
    isDataLoaded = true;
    
    // Populate dynamic content
    populateCourseContent();
    populateCareerContent();
    updateHeroBackground();
    updateCareerBackground();
    
    console.log('Course data loaded successfully:', courseData);
  } catch (error) {
    console.error('Error loading course data:', error);
    // Fallback content
    showFallbackContent();
  }
}

// Populate course content
function populateCourseContent() {
  if (!courseData) return;
  
  // Update course information
  if (elements.courseName) {
    elements.courseName.textContent = courseData.courseName;
  }
  
  if (elements.courseDuration) {
    elements.courseDuration.textContent = courseData.duration;
  }
  
  if (elements.courseCurrency) {
    elements.courseCurrency.textContent = courseData.currency;
  }
  
  if (elements.courseIncludes) {
    elements.courseIncludes.textContent = courseData.includes;
  }
  
  // Populate highlights
  if (elements.courseHighlights && courseData.highlights) {
    elements.courseHighlights.innerHTML = '';
    courseData.highlights.forEach((highlight, index) => {
      const li = document.createElement('li');
      li.textContent = highlight;
      li.style.animationDelay = `${index * 0.1}s`;
      elements.courseHighlights.appendChild(li);
    });
  }
}

// Populate career content
function populateCareerContent() {
  if (!courseData || !courseData.careerTraining) return;
  
  const career = courseData.careerTraining;
  
  if (elements.careerTitle) {
    elements.careerTitle.textContent = career.title;
  }
  
  if (elements.careerGoal) {
    elements.careerGoal.textContent = career.goal;
  }
  
  // Populate career topics as slideshow cards
  if (elements.topicsSlideshow && career.topics) {
    createTopicsSlideshow(career.topics);
  }
}

// Update hero background
function updateHeroBackground() {
  if (!courseData || !courseData.images) return;
  
  const heroSection = document.querySelector('.hero');
  if (heroSection && courseData.images.hero) {
    heroSection.style.backgroundImage = `url('${courseData.images.hero}')`;
    heroSection.style.backgroundRepeat = 'no-repeat';
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center center';
  }
}

// Update career background
function updateCareerBackground() {
  if (!courseData || !courseData.images) return;
  
  if (elements.careerBg && courseData.images.career) {
    elements.careerBg.style.backgroundImage = `url('${courseData.images.career}')`;
    elements.careerBg.style.backgroundRepeat = 'no-repeat';
    elements.careerBg.style.backgroundSize = 'cover';
    elements.careerBg.style.backgroundPosition = 'center center';
  }
}

// Initialize scroll effects
function initializeScrollEffects() {
  // Header scroll effect
  const header = document.querySelector('header');
  
  // Debounced scroll handler for header
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 10);
  });
  
  // Fade in elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe elements for fade-in animation
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// Initialize navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  // Initialize mobile menu toggle
  initializeMobileMenu();
  
  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  
  // Update active nav link on scroll (debounced)
  let navScrollTimeout;
  window.addEventListener('scroll', () => {
    if (navScrollTimeout) {
      clearTimeout(navScrollTimeout);
    }
    
    navScrollTimeout = setTimeout(() => {
      let current = '';
      const headerHeight = document.querySelector('header').offsetHeight;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, 50);
  });
}

// Initialize mobile menu
function initializeMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  if (!mobileToggle || !navMenu) return;
  
  // Toggle mobile menu
  mobileToggle.addEventListener('click', function() {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Add/remove overlay
    toggleNavOverlay();
    
    // Prevent body scroll when menu is open
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMobileMenu();
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
  
  // Close menu on window resize (if resized to desktop)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

// Close mobile menu
function closeMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    removeNavOverlay();
  }
}

// Toggle navigation overlay
function toggleNavOverlay() {
  let overlay = document.querySelector('.nav-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMobileMenu);
  }
  
  overlay.classList.toggle('active');
}

// Remove navigation overlay
function removeNavOverlay() {
  const overlay = document.querySelector('.nav-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      if (overlay && !overlay.classList.contains('active')) {
        overlay.remove();
      }
    }, 300);
  }
}

// Initialize contact form
function initializeContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
  body: formData
});
      
      if (response.ok) {
        showSuccess('Thank you! We\'ll contact you soon.');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showError('Sorry, there was an error sending your message. Please try again.');
    } finally {
      // Reset button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }
  });
}

// Initialize counter animations
function initializeCounterAnimations() {
  const priceCounter = document.querySelector('.price-counter');
  if (!priceCounter || !courseData) return;
  
  const targetPrice = courseData.price;
  const duration = 2000; // 2 seconds
  const increment = targetPrice / (duration / 16); // 60fps
  let currentPrice = 0;
  
  const counter = setInterval(() => {
    currentPrice += increment;
    if (currentPrice >= targetPrice) {
      currentPrice = targetPrice;
      clearInterval(counter);
    }
    priceCounter.textContent = Math.floor(currentPrice).toLocaleString();
  }, 16);
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Show success message
function showSuccess(message) {
  if (elements.formAlerts) {
    elements.formAlerts.innerHTML = `
      <div class="alert alert-success">
        <i class="fas fa-check-circle"></i> ${message}
      </div>
    `;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      elements.formAlerts.innerHTML = '';
    }, 5000);
  }
}

// Show error message
function showError(message) {
  if (elements.formAlerts) {
    elements.formAlerts.innerHTML = `
      <div class="alert alert-error">
        <i class="fas fa-exclamation-circle"></i> ${message}
      </div>
    `;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      elements.formAlerts.innerHTML = '';
    }, 5000);
  }
}

// Show fallback content when data loading fails
function showFallbackContent() {
  if (elements.courseName) {
    elements.courseName.textContent = 'Mobile Repairing Master Course';
  }
  if (elements.courseDuration) {
    elements.courseDuration.textContent = '1 Month';
  }
  if (elements.coursePrice) {
    elements.coursePrice.textContent = '20,000';
  }
  if (elements.courseCurrency) {
    elements.courseCurrency.textContent = 'INR';
  }
  if (elements.courseIncludes) {
    elements.courseIncludes.textContent = 'Includes full repairing toolkit';
  }
  
  // Show fallback highlights
  if (elements.courseHighlights) {
    const fallbackHighlights = [
      'Learn repairing from small mobiles to advanced iPhones and Android devices',
      'Hands-on training with real devices',
      '100% practical sessions',
      'Industry expert instructors',
      'Free tool kit with the course',
      'Lifetime technical support'
    ];
    
    elements.courseHighlights.innerHTML = '';
    fallbackHighlights.forEach(highlight => {
      const li = document.createElement('li');
      li.textContent = highlight;
      elements.courseHighlights.appendChild(li);
    });
  }
  
  // Show fallback career content
  if (elements.careerTitle) {
    elements.careerTitle.textContent = 'Career & Business Training';
  }
  if (elements.careerGoal) {
    elements.careerGoal.textContent = 'Prepare students to start earning immediately after completing the course.';
  }
  
  if (elements.topicsSlideshow) {
    const fallbackTopics = [
      'How to start your own repair shop',
      'Estimating costs, sourcing spare parts, and dealing with suppliers',
      'Handling customers professionally',
      'Digital marketing for repair business',
      'Creating a YouTube/Instagram repair brand',
      'Certification after course completion'
    ];
    
    createTopicsSlideshow(fallbackTopics);
  }
}

// Utility function to debounce events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add loading states to buttons
function addLoadingState(button, text = 'Loading...') {
  const originalText = button.innerHTML;
  button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
  button.disabled = true;
  
  return () => {
    button.innerHTML = originalText;
    button.disabled = false;
  };
}

// Add hover effects to cards
function initializeCardHoverEffects() {
  const cards = document.querySelectorAll('.feature-item, .course-card, .contact-item');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Card hover effects will be initialized in main app initialization

// Parallax effect removed to improve scroll performance

// Add typing effect to hero title
function initializeTypingEffect() {
  const heroTitle = document.querySelector('.hero h2');
  if (!heroTitle) return;
  
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  
  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  };
  
  // Start typing effect after a delay
  setTimeout(typeWriter, 1000);
}

// Add scroll progress indicator
function initializeScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #0066ff, #00d4ff);
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  let ticking = false;
  
  function updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  });
}

// Scroll progress will be initialized in main app initialization

// Create topics slideshow
function createTopicsSlideshow(topics) {
  if (!elements.topicsSlideshow) return;
  
  const topicsContainer = document.createElement('div');
  topicsContainer.className = 'topics-container';
  
  // Topic icons mapping
  const topicIcons = {
    0: 'bi-shop',
    1: 'bi-calculator',
    2: 'bi-people',
    3: 'bi-graph-up',
    4: 'bi-camera-video',
    5: 'bi-award'
  };
  
  topics.forEach((topic, index) => {
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.innerHTML = `
      <i class="bi ${topicIcons[index] || 'bi-book'}"></i>
      <h5>${topic}</h5>
      <p>Learn essential skills for your mobile repair business success</p>
    `;
    topicsContainer.appendChild(card);
  });
  
  elements.topicsSlideshow.innerHTML = '';
  elements.topicsSlideshow.appendChild(topicsContainer);
  
  // Create dots
  createSlideshowDots(topics.length);
  
  // Start auto-slideshow
  startAutoSlideshow();
}

// Create slideshow dots
function createSlideshowDots(count) {
  if (!elements.slideshowDots) return;
  
  elements.slideshowDots.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    elements.slideshowDots.appendChild(dot);
  }
}

// Initialize slideshow
function initializeSlideshow() {
  // Auto-slideshow will start when data is loaded
}

// Start auto slideshow
function startAutoSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
  }
  
  slideshowInterval = setInterval(() => {
    const topicsContainer = document.querySelector('.topics-container');
    if (topicsContainer) {
      const totalSlides = topicsContainer.children.length;
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlideshow();
    }
  }, 4000); // Change slide every 4 seconds
}

// Change slide function (called by HTML onclick)
function changeSlide(direction) {
  const topicsContainer = document.querySelector('.topics-container');
  if (!topicsContainer) return;
  
  const totalSlides = topicsContainer.children.length;
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  updateSlideshow();
  
  // Reset auto-slideshow timer
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    startAutoSlideshow();
  }
}

// Go to specific slide
function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateSlideshow();
  
  // Reset auto-slideshow timer
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    startAutoSlideshow();
  }
}

// Update slideshow display
function updateSlideshow() {
  const topicsContainer = document.querySelector('.topics-container');
  const dots = document.querySelectorAll('.dot');
  
  if (topicsContainer) {
    const translateX = -currentSlide * 100;
    topicsContainer.style.transform = `translateX(${translateX}%)`;
  }
  
  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Initialize WhatsApp Widget
function initializeWhatsAppWidget() {
  const whatsappWidget = document.getElementById('whatsapp-widget');
  const whatsappLink = document.querySelector('.whatsapp-link');
  
  if (!whatsappWidget || !whatsappLink) return;
  
  // Add click tracking
  whatsappLink.addEventListener('click', function(e) {
    // Track the click (you can add analytics here)
    console.log('WhatsApp widget clicked');
    
    // Add a small delay to show the click effect
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 150);
  });
  
  // Keep widget always visible - remove scroll hiding behavior
  // Widget will remain visible throughout the entire page
  
  // Add entrance animation and ensure widget stays visible
  setTimeout(() => {
    whatsappWidget.style.transform = 'translateY(0)';
    whatsappWidget.style.opacity = '1';
  }, 1000);
  
  // Ensure widget remains visible at all times
  whatsappWidget.style.position = 'fixed';
  whatsappWidget.style.bottom = '20px';
  whatsappWidget.style.right = '20px';
  whatsappWidget.style.zIndex = '1000';
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadCourseData,
    populateCourseContent,
    populateCareerContent,
    showSuccess,
    showError,
    changeSlide,
    goToSlide,
    initializeWhatsAppWidget
  };
}
