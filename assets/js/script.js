/**
 * Romantic Website JavaScript
 * Contains all functionality for the romantic multi-page website
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initHeartsAnimation();
    initMusicPlayer();
    initPageTransitions();
    
    // Page-specific initializations
    if (document.querySelector('.gallery-grid')) {
        initGallery();
    }
    
    if (document.querySelector('.timeline')) {
        initTimeline();
    }
    
    if (document.querySelector('.message-cards')) {
        initMessageCards();
    }
    
    if (document.querySelector('.countdown-container')) {
        initCountdown();
    }
});

/**
 * ===== GLOBAL FUNCTIONS =====
 */

// Initialize navigation menu
function initNavigation() {
    const toggleButton = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (toggleButton && navMenu) {
        toggleButton.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });
    }
    
    // Set active page link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize falling hearts animation
function initHeartsAnimation() {
    const canvas = document.getElementById('hearts-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let hearts = [];
    let animationId;
    
    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Heart class
    class Heart {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.size = Math.random() * 12 + 5;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.speed = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = `rgba(233, 69, 132, ${this.opacity})`;
            this.wobble = Math.random() * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.01;
            this.wobblePos = 0;
        }
        
        update() {
            this.y += this.speed;
            this.wobblePos += this.wobbleSpeed;
            this.x += Math.sin(this.wobblePos) * this.wobble;
            
            if (this.y > canvas.height) {
                this.reset();
                this.y = -this.size;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            
            // Draw heart shape
            ctx.bezierCurveTo(
                this.x + this.size / 2, this.y - this.size / 2,
                this.x + this.size, this.y,
                this.x, this.y + this.size
            );
            
            ctx.bezierCurveTo(
                this.x - this.size, this.y,
                this.x - this.size / 2, this.y - this.size / 2,
                this.x, this.y
            );
            
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }
    
    // Create hearts
    function createHearts() {
        hearts = [];
        const heartCount = Math.min(50, Math.floor(canvas.width / 20));
        
        for (let i = 0; i < heartCount; i++) {
            hearts.push(new Heart());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    function init() {
        setCanvasSize();
        createHearts();
        animate();
    }
    
    // Handle resize
    window.addEventListener('resize', function() {
        setCanvasSize();
        createHearts();
    });
    
    // Start the animation
    init();
    
    // Clean up on page navigation
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

// Initialize music player
function initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    
    if (!musicToggle || !bgMusic) return;
    
    // Check localStorage for user preference
    const musicPreference = localStorage.getItem('musicPlaying');
    if (musicPreference === 'true') {
        bgMusic.play().catch(e => {
            console.log('Audio play failed:', e);
        });
        musicToggle.classList.add('playing');
    }
    
    musicToggle.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                localStorage.setItem('musicPlaying', 'true');
            }).catch(e => {
                console.log('Audio play failed:', e);
                // Show message that user needs to interact first
                alert('Please click anywhere on the page first to enable music');
            });
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            localStorage.setItem('musicPlaying', 'false');
        }
    });
    
    // Enable audio on first user interaction
    function enableAudio() {
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
        
        if (localStorage.getItem('musicPlaying') === 'true') {
            bgMusic.play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }
    }
    
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
}

// Initialize smooth page transitions
function initPageTransitions() {
    const transitionOverlay = document.getElementById('page-transition');
    if (!transitionOverlay) return;
    
    // Add click event to all internal links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Check if it's an internal link
        if (href && href.startsWith('/') || 
            href && !href.includes('://') && 
            !href.startsWith('#') && 
            !href.startsWith('mailto:') && 
            !href.startsWith('tel:')) {
            
            e.preventDefault();
            
            // Show transition
            transitionOverlay.style.opacity = '1';
            transitionOverlay.style.pointerEvents = 'auto';
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        }
    });
    
    // Hide transition when page loads
    window.addEventListener('load', function() {
        transitionOverlay.style.opacity = '0';
        transitionOverlay.style.pointerEvents = 'none';
    });
}

/**
 * ===== GALLERY PAGE FUNCTIONS =====
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.createElement('div');
    const lightboxContent = document.createElement('div');
    const lightboxImg = document.createElement('img');
    const lightboxCaption = document.createElement('p');
    const lightboxClose = document.createElement('span');
    const lightboxPrev = document.createElement('span');
    const lightboxNext = document.createElement('span');
    
    // Set up lightbox
    lightbox.className = 'lightbox';
    lightboxContent.className = 'lightbox-content';
    lightboxImg.className = 'lightbox-img';
    lightboxCaption.className = 'lightbox-caption';
    lightboxClose.className = 'lightbox-close';
    lightboxPrev.className = 'lightbox-prev';
    lightboxNext.className = 'lightbox-next';
    
    lightboxClose.innerHTML = '&times;';
    lightboxPrev.innerHTML = '&#10094;';
    lightboxNext.innerHTML = '&#10095;';
    
    lightboxContent.appendChild(lightboxPrev);
    lightboxContent.appendChild(lightboxImg);
    lightboxContent.appendChild(lightboxCaption);
    lightboxContent.appendChild(lightboxNext);
    lightboxContent.appendChild(lightboxClose);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    
    let currentIndex = 0;
    
    // Open lightbox
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Update lightbox content
    function updateLightbox() {
        const item = galleryItems[currentIndex];
        const imgSrc = item.querySelector('img').src;
        const caption = item.getAttribute('data-caption') || '';
        
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Enable scrolling
    }
    
    // Navigate to next image
    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightbox();
    }
    
    // Navigate to previous image
    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightbox();
    }
    
    // Add event listeners to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Close lightbox when clicking outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
}

/**
 * ===== STORY PAGE FUNCTIONS =====
 */
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.3
    });
    
    // Observe each timeline item
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

/**
 * ===== MESSAGES PAGE FUNCTIONS =====
 */
function initMessageCards() {
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
        
        // Make cards keyboard accessible
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('flipped');
            }
        });
    });
}

/**
 * ===== COUNTDOWN PAGE FUNCTIONS =====
 */
function initCountdown() {
    const countdownContainer = document.querySelector('.countdown-container');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const messageElement = document.getElementById('countdown-message');
    
    // Get target date from data attribute or set default
    // EDIT THIS: Change the data-target-date attribute to your desired date
    const targetDate = new Date(countdownContainer.getAttribute('data-target-date') || '2024-12-31T23:59:59');
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            // Countdown finished
            daysElement.textContent = '0';
            hoursElement.textContent = '0';
            minutesElement.textContent = '0';
            secondsElement.textContent = '0';
            
            if (messageElement) {
                messageElement.textContent = 'The wait is over! Our special day has arrived! 💖';
            }
            
            return;
        }
        
        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Update elements
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Continue countdown
        requestAnimationFrame(updateCountdown);
    }
    
    // Start countdown
    updateCountdown();
}