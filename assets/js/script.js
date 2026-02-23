// Hamburger toggle: open/close main nav
(function(){
    const buttons = document.querySelectorAll('.hamburger');
    if(!buttons || !buttons.length) return;

    function closeNavs(){
        document.querySelectorAll('.nav-links.open').forEach(nav => nav.classList.remove('open'));
        document.querySelectorAll('.hamburger[aria-expanded="true"]').forEach(b => {
            b.setAttribute('aria-expanded','false');
            const img = b.querySelector('img');
            // Check if we're on index or service page based on image src
            if(img) {
                if(img.src.includes('../assets')) {
                    img.src = '../assets/images/hamburger-menu.jpg';
                } else {
                    img.src = 'assets/images/hamburger-menu.jpg';
                }
            }
        });
    }

    buttons.forEach(btn => {
        const targetId = btn.getAttribute('aria-controls');
        const nav = targetId ? document.getElementById(targetId) : null;
        btn.addEventListener('click', ()=>{
            if(!nav) return;
            const isOpen = nav.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            const img = btn.querySelector('img');
            if(img) {
                // Check if we're on index or service page based on current src
                const isIndexPage = !img.src.includes('../assets');
                if(isIndexPage) {
                    img.src = isOpen ? 'assets/images/close-button-icon.jpg' : 'assets/images/hamburger-menu.jpg';
                } else {
                    img.src = isOpen ? '../assets/images/close-button-icon.jpg' : '../assets/images/hamburger-menu.jpg';
                }
            }
        });

        // close nav when a link inside is clicked
        if(nav){
            nav.addEventListener('click', (e)=>{
                if(e.target && (e.target.tagName === 'A')){
                    closeNavs();
                }
            });
        }
    });

    // Close when resizing to desktop
    window.addEventListener('resize', ()=>{
        if(window.innerWidth >= 768) closeNavs();
    });
})();

// Services submenu toggle (desktop hover + mobile accordion toggle)
(function(){
    const toggles = document.querySelectorAll('.submenu-toggle');
    if(!toggles || !toggles.length) return;

    function closeAll(){
        document.querySelectorAll('.submenu.open').forEach(s => s.classList.remove('open'));
        document.querySelectorAll('.submenu-toggle[aria-expanded="true"]').forEach(b => {
            b.setAttribute('aria-expanded','false');
            const p = b.querySelector('.plus'); if(p) p.textContent = '+';
        });
    }

    toggles.forEach(btn => {
        const targetId = btn.getAttribute('aria-controls');
        const submenu = targetId ? document.getElementById(targetId) : null;
        if(!submenu) return;
        btn.addEventListener('click', (e)=>{
            e.preventDefault();
            const isOpen = submenu.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            const plus = btn.querySelector('.plus'); if(plus) plus.textContent = isOpen ? '−' : '+';
            // close other submenus
            if(isOpen){
                toggles.forEach(other=>{ if(other!==btn){ const oId = other.getAttribute('aria-controls'); const oSub = document.getElementById(oId); if(oSub) oSub.classList.remove('open'); other.setAttribute('aria-expanded','false'); const p = other.querySelector('.plus'); if(p) p.textContent = '+'; } });
            }
        });

        // close menus when a link inside submenu is clicked
        submenu.addEventListener('click', (e)=>{
            if(e.target && e.target.tagName === 'A'){
                closeAll();
                // also close mobile main nav
                document.querySelectorAll('.nav-links.open').forEach(nav => nav.classList.remove('open'));
                document.querySelectorAll('.hamburger[aria-expanded="true"]').forEach(b => {
                    b.setAttribute('aria-expanded','false');
                    const img = b.querySelector('img');
                    if(img) {
                        // Check path structure
                        const isIndexPage = !img.src.includes('../assets');
                        if(isIndexPage) {
                            img.src = 'assets/images/hamburger-menu.jpg';
                        } else {
                            img.src = '../assets/images/hamburger-menu.jpg';
                        }
                    }
                });
            }
        });
    });

    // Close submenus on outside click
    document.addEventListener('click', (e)=>{
        if(!e.target.closest('.nav-item')){
            closeAll();
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', ()=>{
        if(window.innerWidth >= 768) closeAll();
    });
})();

// Slideshow functionality
(function() {
    let slideIndex = 1;
    let slideTimer;

    // Initialize slideshow
    function initSlideshow() {
        showSlide(slideIndex);
        startAutoSlide();
    }

    function showSlide(n) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if(!slides.length) return;

        if (n > slides.length) { slideIndex = 1; }
        if (n < 1) { slideIndex = slides.length; }

        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current slide
        if(slides[slideIndex - 1]) {
            slides[slideIndex - 1].classList.add('active');
        }
        
        // Highlight current dot
        if(dots[slideIndex - 1]) {
            dots[slideIndex - 1].classList.add('active');
        }
    }

    function changeSlide(n) {
        clearTimeout(slideTimer);
        showSlide(slideIndex += n);
        startAutoSlide();
    }

    function currentSlide(n) {
        clearTimeout(slideTimer);
        showSlide(slideIndex = n);
        startAutoSlide();
    }

    function startAutoSlide() {
        slideTimer = setTimeout(() => {
            slideIndex++;
            showSlide(slideIndex);
            startAutoSlide();
        }, 5000); // Change slide every 5 seconds
    }

    // Make functions global so they can be called from HTML
    window.changeSlide = changeSlide;
    window.currentSlide = currentSlide;

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlideshow);
    } else {
        initSlideshow();
    }

    // Pause slideshow when user hovers over it
    const slideshowContainer = document.querySelector('.slideshow-container');
    if(slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearTimeout(slideTimer);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
})();

// Gallery filter functionality
(function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if(!tabButtons.length || !galleryItems.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-tab');

            // Update active button
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filter gallery items
            galleryItems.forEach(item => {
                const service = item.getAttribute('data-service');
                if (filter === 'all' || service === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
})();
// Lightbox for all gallery images
(function () {
    function buildLightbox() {
        if (document.getElementById('tc-lightbox')) return;
        const lb = document.createElement('div');
        lb.id = 'tc-lightbox';
        lb.className = 'lightbox-overlay';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-modal', 'true');
        lb.setAttribute('aria-label', 'Image viewer');
        lb.innerHTML = `
            <button class="lightbox-close" aria-label="Close image viewer">&#10005;</button>
            <button class="lightbox-prev" aria-label="Previous image">&#8249;</button>
            <div class="lightbox-inner">
                <img class="lightbox-img" src="" alt="">
            </div>
            <button class="lightbox-next" aria-label="Next image">&#8250;</button>
            <p class="lightbox-caption"></p>
        `;
        document.body.appendChild(lb);
        return lb;
    }

    let currentImages = [];
    let currentIndex = 0;

    function openLightbox(images, index) {
        currentImages = images;
        currentIndex = index;
        showLightboxImage();
        const lb = document.getElementById('tc-lightbox');
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
        lb.querySelector('.lightbox-close').focus();
    }

    function closeLightbox() {
        const lb = document.getElementById('tc-lightbox');
        if (!lb) return;
        lb.classList.remove('open');
        document.body.style.overflow = '';
    }

    function showLightboxImage() {
        const lb = document.getElementById('tc-lightbox');
        if (!lb) return;
        const img = lb.querySelector('.lightbox-img');
        const cap = lb.querySelector('.lightbox-caption');
        const data = currentImages[currentIndex];
        img.src = data.src;
        img.alt = data.alt || '';
        cap.textContent = data.caption || '';
    }

    function navigateLightbox(dir) {
        currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
        showLightboxImage();
    }

    function initGalleryLightboxes() {
        buildLightbox();
        const lb = document.getElementById('tc-lightbox');

        lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lb.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
        lb.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

        // Close on overlay click (but not inner content)
        lb.addEventListener('click', (e) => {
            if (e.target === lb) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lb.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });

        // Wire up each gallery grid separately
        document.querySelectorAll('.gallery-grid').forEach(grid => {
            const figures = Array.from(grid.querySelectorAll('.gallery-item'));
            const imageData = figures.map(fig => ({
                src: fig.querySelector('img')?.src || '',
                alt: fig.querySelector('img')?.alt || '',
                caption: fig.querySelector('figcaption')?.textContent || ''
            }));

            figures.forEach((fig, i) => {
                fig.setAttribute('tabindex', '0');
                fig.setAttribute('role', 'button');
                fig.setAttribute('aria-label', `View: ${imageData[i].caption || imageData[i].alt}`);
                fig.addEventListener('click', () => openLightbox(imageData, i));
                fig.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(imageData, i);
                    }
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGalleryLightboxes);
    } else {
        initGalleryLightboxes();
    }
})();