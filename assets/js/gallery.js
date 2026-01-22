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
        setupSliderIndicators('.gallery-grid', '.custom-gallery', 2);
        setupSliderIndicators('.mobile-review-slider', '.mobile-reviews-section', 1);
        
        // Also handle the testimonial slider in index.html if it exists
        setupSliderIndicators('[data-css="tve-u-16c38bf81d6"]', '.desktop-reviews-section', 1);
    }
});

