// Hamburger toggle: open/close main nav
(function(){
    const buttons = document.querySelectorAll('.hamburger');
    if(!buttons || !buttons.length) return;

    function closeNavs(){
        document.querySelectorAll('.nav-links.open').forEach(nav => nav.classList.remove('open'));
        document.querySelectorAll('.hamburger[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded','false'));
    }

    buttons.forEach(btn => {
        const targetId = btn.getAttribute('aria-controls');
        const nav = targetId ? document.getElementById(targetId) : null;
        btn.addEventListener('click', ()=>{
            if(!nav) return;
            const isOpen = nav.classList.toggle('open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
                document.querySelectorAll('.hamburger[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded','false'));
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
