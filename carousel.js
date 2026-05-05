// Image Carousel Management
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000; // 6 seconds
        this.isAutoPlay = true;
        this.init();
    }

    init() {
        const track = document.getElementById('carouselTrack');
        
        this.totalSlides = track.querySelectorAll('.carousel-slide').length;
        
        // Update total slides display
        const totalSlidesEl = document.getElementById('totalSlides');
        if (totalSlidesEl) {
            totalSlidesEl.textContent = this.totalSlides;
        }

        this.setupEventListeners();
        this.startAutoPlay();
        this.preloadImages();
    }

    preloadImages() {
        // Preload all images for smooth transitions
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            const img = new Image();
            img.src = slide.style.backgroundImage;
        });
    }

    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        // Indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });

        // Pause on hover
        const container = document.querySelector('.carousel-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                this.isAutoPlay = false;
                this.stopAutoPlay();
            });

            container.addEventListener('mouseleave', () => {
                this.isAutoPlay = true;
                this.startAutoPlay();
            });

            // Touch support
            let startX = 0;
            let startTime = 0;

            container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startTime = Date.now();
                this.stopAutoPlay();
            });

            container.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const endTime = Date.now();
                const distance = startX - endX;
                const time = endTime - startTime;

                // Swipe detected
                if (Math.abs(distance) > 50 && time < 500) {
                    if (distance > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                if (this.isAutoPlay) {
                    this.startAutoPlay();
                }
            });
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        this.restartAutoPlay();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
        this.restartAutoPlay();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
        this.restartAutoPlay();
    }

    updateCarousel() {
        const track = document.getElementById('carouselTrack');
        const indicators = document.querySelectorAll('.indicator');
        const currentSlideEl = document.getElementById('currentSlide');

        // Update track position with smooth animation
        if (track) {
            track.style.transition = 'none'; // Remove transition temporarily
            track.offsetHeight; // Trigger reflow
            track.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }

        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
                // Add pulse animation
                indicator.style.animation = 'none';
                indicator.offsetHeight; // Trigger reflow
                indicator.style.animation = 'pulse 0.5s ease-out';
            } else {
                indicator.classList.remove('active');
            }
        });

        // Update slide counter
        if (currentSlideEl) {
            currentSlideEl.textContent = this.currentSlide + 1;
        }

        // Add animation class
        if (track) {
            track.classList.add('is-transitioning');
            setTimeout(() => {
                track.classList.remove('is-transitioning');
            }, 800);
        }

        // Trigger slide content animations
        this.animateSlideContent();
    }

    animateSlideContent() {
        const currentSlideEl = document.querySelectorAll('.carousel-slide')[this.currentSlide];
        if (currentSlideEl) {
            const contentWrapper = currentSlideEl.querySelector('.content-wrapper');
            const title = currentSlideEl.querySelector('.slide-title');
            const description = currentSlideEl.querySelector('.slide-description');
            const btn = currentSlideEl.querySelector('.btn');

            // Reset animations
            if (contentWrapper) contentWrapper.style.animation = 'none';
            if (title) title.style.animation = 'none';
            if (description) description.style.animation = 'none';
            if (btn) btn.style.animation = 'none';

            // Trigger reflow
            if (contentWrapper) contentWrapper.offsetHeight;

            // Apply animations
            if (contentWrapper) contentWrapper.style.animation = 'slideInUp 0.8s ease-out';
            if (title) title.style.animation = 'fadeInDown 0.8s ease-out';
            if (description) description.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
            if (btn) btn.style.animation = 'scaleIn 0.8s ease-out 0.4s both';
        }
    }

    startAutoPlay() {
        if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    restartAutoPlay() {
        if (this.isAutoPlay) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    destroy() {
        this.stopAutoPlay();
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.carousel = new Carousel();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.carousel) {
        window.carousel.destroy();
    }
});