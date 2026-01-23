/**
 * Optimized Gallery Lightbox & Slider Indicators
 */
document.addEventListener('DOMContentLoaded', function () {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length && !document.querySelector('.gallery-grid')) return;

    // 1. Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="Full size image" loading="lazy">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Add lightbox styles dynamically (moved to more efficient placement)
    const style = document.createElement('style');
    style.textContent = `
        .lightbox-overlay {
            display: none;
            position: fixed;
            z-index: 99999;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(5px);
            justify-content: center;
            align-items: center;
            cursor: zoom-out;
        }
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .lightbox-content img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 8px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.5);
            object-fit: contain;
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: #fff;
            font-size: 35px;
            font-weight: bold;
            cursor: pointer;
        }
        .lightbox-caption {
            color: #fff;
            margin-top: 15px;
            font-size: 18px;
            text-align: center;
            font-family: sans-serif;
        }
        body.lightbox-open {
            overflow: hidden;
        }
        
        .slider-indicator {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 15px 0;
        }
        .indicator-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ccc;
            transition: all 0.3s ease;
        }
        .indicator-dot.active {
            background: #012169;
            transform: scale(1.3);
        }
    `;
    document.head.appendChild(style);

    // 2. Lightbox logic
    galleryItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const fullImgUrl = this.getAttribute('data-full');
            const title = this.getAttribute('title');

            if (fullImgUrl) {
                lightboxImg.src = fullImgUrl;
                lightboxCaption.textContent = title || '';
                lightbox.style.display = 'flex';
                document.body.classList.add('lightbox-open');
            }
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.classList.remove('lightbox-open');
        lightboxImg.src = '';
    };

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target === closeBtn) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

    // 3. Optimized Slider Indicators Logic using IntersectionObserver
    function setupSliderIndicators(sliderSelector, containerSelector, itemsPerSlide = 1) {
        const slider = document.querySelector(sliderSelector);
        const container = document.querySelector(containerSelector);
        if (!slider || !container) return;

        const items = Array.from(slider.children);
        if (items.length === 0) return;

        const slideCount = Math.ceil(items.length / itemsPerSlide);
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'slider-indicator';

        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
            indicatorContainer.appendChild(dot);
        }

        container.appendChild(indicatorContainer);
        const dots = indicatorContainer.querySelectorAll('.indicator-dot');

        // Use IntersectionObserver for high performance active state detection
        const observerOptions = {
            root: slider,
            threshold: 0.6
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = items.indexOf(entry.target);
                    const activeSlideIndex = Math.floor(index / itemsPerSlide);
                    
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === activeSlideIndex);
                    });
                }
            });
        }, observerOptions);

        items.forEach(item => observer.observe(item));
    }

    // Initialize only if mobile
    if (window.matchMedia("(max-width: 768px)").matches) {
        setupSliderIndicators('.gallery-grid', '.custom-gallery', 1);
        setupSliderIndicators('.mobile-review-slider', '.mobile-reviews-section', 1);
        
        // Also handle the testimonial slider in index.html if it exists
        setupSliderIndicators('[data-css="tve-u-16c38bf81d6"]', '.desktop-reviews-section', 1);

        // Add navigation arrows to gallery
        setupGalleryArrows();
    }

    function setupGalleryArrows() {
        const gallery = document.querySelector('.custom-gallery');
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!gallery || !galleryGrid) return;

        // Create arrow container above gallery
        const navContainer = document.createElement('div');
        navContainer.className = 'gallery-nav-container';

        // Create prev arrow
        const prevArrow = document.createElement('button');
        prevArrow.className = 'gallery-nav-arrow gallery-nav-prev';
        prevArrow.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
        prevArrow.setAttribute('aria-label', 'Previous image');

        // Create next arrow
        const nextArrow = document.createElement('button');
        nextArrow.className = 'gallery-nav-arrow gallery-nav-next';
        nextArrow.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>';
        nextArrow.setAttribute('aria-label', 'Next image');

        navContainer.appendChild(prevArrow);
        navContainer.appendChild(nextArrow);

        // Wrap gallery-grid in a wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'gallery-wrapper';
        galleryGrid.parentNode.insertBefore(wrapper, galleryGrid);
        wrapper.appendChild(galleryGrid);

        // Insert arrow container after gallery grid (below)
        wrapper.parentNode.insertBefore(navContainer, wrapper.nextSibling);

        const items = galleryGrid.querySelectorAll('.gallery-item');
        let currentIndex = 0;

        function scrollToIndex(index) {
            if (index < 0) index = items.length - 1;
            if (index >= items.length) index = 0;
            currentIndex = index;
            items[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }

        prevArrow.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToIndex(currentIndex - 1);
        });

        nextArrow.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToIndex(currentIndex + 1);
        });

        // Update currentIndex on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    currentIndex = Array.from(items).indexOf(entry.target);
                }
            });
        }, { root: galleryGrid, threshold: 0.6 });

        items.forEach(item => observer.observe(item));
    }
});

