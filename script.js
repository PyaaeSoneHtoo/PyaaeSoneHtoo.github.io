/**
 * Main Script File
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Loader ---
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            initHeroAnimation();
        }, 500);
    }, 1500); // Gives time to see loader, adjust if needed

    // --- 2. Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        
        // Toggle icon between bars and times (close)
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('nav-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // --- 3. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 4. Interactive Canvas Background (Modern Floating Orbs) ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, orbs = [];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Orb {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 150 + 50;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            
            // Randomly pick between the two gradient colors
            this.color = Math.random() > 0.5 
                ? 'rgba(96, 165, 250, 0.05)' // soft blue
                : 'rgba(167, 139, 250, 0.05)'; // soft purple
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce smoothly off edges
            if (this.x < -this.radius || this.x > width + this.radius) this.vx *= -1;
            if (this.y < -this.radius || this.y > height + this.radius) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initOrbs() {
        orbs = [];
        const numOrbs = 8; // Small number of large orbs for a clean look
        for (let i = 0; i < numOrbs; i++) {
            orbs.push(new Orb());
        }
    }

    function animateOrbs() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < orbs.length; i++) {
            orbs[i].update();
            orbs[i].draw();
        }
        
        requestAnimationFrame(animateOrbs);
    }

    initOrbs();
    animateOrbs();

    // --- 5. Anime.js Entrance Animations ---
    function initHeroAnimation() {
        const tl = anime.timeline({
            easing: 'easeOutExpo',
            duration: 1000
        });

        // Hide initially
        document.querySelector('.logo').style.opacity = '0';
        document.querySelectorAll('.nav-links li').forEach(el => el.style.opacity = '0');
        document.querySelectorAll('.hero-content > *').forEach(el => el.style.opacity = '0');

        tl.add({
            targets: '.logo',
            translateY: [-20, 0],
            opacity: [0, 1],
            delay: 100
        })
        .add({
            targets: '.nav-links li',
            translateY: [-20, 0],
            opacity: [0, 1],
            delay: anime.stagger(100)
        }, '-=800')
        .add({
            targets: '.hero-content > *',
            translateY: [20, 0],
            opacity: [0, 1],
            delay: anime.stagger(150)
        }, '-=600');
    }

    // --- 6. Scroll Reveal Animations (Intersection Observer + Anime.js) ---
    // Select elements to reveal
    const revealElements = document.querySelectorAll(
        '.about-text, .cert-card, .timeline-item, .project-card, .contact-title, .contact-text, .contact .btn, .social-links, .section-heading'
    );

    // Initial state: hidden
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            anime({
                targets: entry.target,
                opacity: [0, 1],
                translateY: [30, 0],
                easing: 'easeOutQuart',
                duration: 800,
                complete: function() {
                    entry.target.style.transform = ''; // clear inline styles
                }
            });

            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});