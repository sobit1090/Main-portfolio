 
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;
        
        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Update main cursor immediately
            gsap.to(cursor, {
                x: mouseX - 4,
                y: mouseY - 4,
                duration: 0.1,
                ease: "power2.out"
            });
        });
        
        // Smooth follower animation
        function updateFollower() {
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            
            followerX += dx * 0.1;
            followerY += dy * 0.1;
            
            gsap.set(cursorFollower, {
                x: followerX - 20,
                y: followerY - 20
            });
            
            requestAnimationFrame(updateFollower);
        }
        updateFollower();
        
        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .tech-item, input, textarea, .hamburger');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('hover');
                gsap.to(cursor, {
                    scale: 1.5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('hover');
                gsap.to(cursor, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
        
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Loading screen animation
        window.addEventListener('load', () => {
            const tl = gsap.timeline();
            
            // Animate loading bar
            tl.to('.loading-progress', {
                width: '100%',
                duration: 2,
                ease: "power2.inOut"
            })
            .to('.loading-screen', {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    document.querySelector('.loading-screen').style.display = 'none';
                    initMainAnimations();
                }
            });
        });
        
        function initMainAnimations() {
            // Header animations with enhanced effects
            const headerTl = gsap.timeline();
            
            headerTl.to('.logo', {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "elastic.out(1, 0.5)"
            })
            .to('.tagline', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out"
            }, "-=1")
            .to('.date-line', {
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, "-=0.8")
            .to('nav', {
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, "-=0.5");
            
            // About section animations
            gsap.to('.profile-img', {
                opacity: 1,
                scale: 1,
                duration: 1.5,
                delay: 2,
                ease: "elastic.out(1, 0.3)"
            });
            
            gsap.to('.about-text', {
                opacity: 1,
                x: 0,
                duration: 1.2,
                delay: 2.3,
                ease: "power3.out"
            });
            
            // Enhanced project cards animation
            gsap.utils.toArray('.project-card').forEach((card, i) => {
                // Initial state for animation
                gsap.set(card, {
                    opacity: 0,
                    y: 100,
                    rotationX: -15,
                    transformPerspective: 1000
                });
                
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    delay: i * 0.2
                });
                
                // Hover animation enhancement
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -15,
                        rotationX: 5,
                        rotationY: 2,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        rotationX: 0,
                        rotationY: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });
            
            // Tech stack animation with stagger effect
            gsap.to('.tech-item', {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: '#tech',
                    start: "top 70%",
                    toggleActions: "play none none none"
                }
            });
            
            // Section titles with typewriter effect
            gsap.utils.toArray('.section-title').forEach(title => {
                gsap.from(title, {
                    x: -100,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: title,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                });
            });
            
            // Floating code elements animation
            gsap.utils.toArray('.floating-code').forEach((element, i) => {
                gsap.to(element, {
                    y: "random(-20, 20)",
                    x: "random(-10, 10)",
                    duration: "random(3, 6)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.5
                });
            });
            
            // Parallax effects
            gsap.to('.ink-blot-1', {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: "none"
            });
            
            gsap.to('.ink-blot-2', {
                rotation: -360,
                duration: 25,
                repeat: -1,
                ease: "none"
            });
            
            // Smooth scroll for navigation links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        gsap.to(window, {
                            duration: 1.5,
                            scrollTo: target,
                            ease: "power2.inOut"
                        });
                    }
                });
            });
            
            // Form submission animation
            document.querySelector('.contact-form').addEventListener('submit', (e) => {
                e.preventDefault();
                gsap.to('.submit-btn', {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        alert('Message sent! (Demo)');
                    }
                });
            });
        }
        
        console.log("[v0] GSAP animations and custom cursor initialized successfully");
 