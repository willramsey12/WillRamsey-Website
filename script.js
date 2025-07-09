// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const themeToggle = document.getElementById('theme-toggle');
const navLinks = document.querySelectorAll('.nav-link');

// Theme Management
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeToggle(theme);
        this.setupThemeToggle();
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupActiveLinks();
    }

    setupMobileMenu() {
        hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    }

    closeMobileMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    setupSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', debounce(() => {
            this.handleNavbarScroll();
            this.updateActiveLinks();
            this.updateScrollProgress();
        }, 10));
    }

    handleNavbarScroll() {
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
                ? 'rgba(17, 24, 39, 0.98)' 
                : 'rgba(250, 250, 250, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
                ? 'rgba(17, 24, 39, 0.95)' 
                : 'rgba(250, 250, 250, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    updateActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    }

    setupActiveLinks() {
        this.updateActiveLinks();
    }

    updateScrollProgress() {
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 2px;
                background: var(--accent-retro);
                z-index: 1001;
                transition: width 0.2s ease;
            `;
            document.body.appendChild(progressBar);
        }
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupCounterAnimations();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(
            '.skill-category, .project-card, .stat, .education-item, .contact-item'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            observer.observe(el);
        });
    }

    setupCounterAnimations() {
        const stats = document.querySelectorAll('.stat h3');
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    animateCounter(element) {
        const text = element.textContent;
        const isNumber = !isNaN(parseInt(text));
        
        if (isNumber) {
            const finalNumber = parseInt(text);
            let currentNumber = 0;
            const increment = finalNumber / 20;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    clearInterval(timer);
                    element.textContent = finalNumber + '+';
                } else {
                    element.textContent = Math.floor(currentNumber);
                }
            }, 100);
        }
    }
}

// Simple Retro Effects
class RetroEffects {
    constructor() {
        this.initTypingEffect();
        this.initGlitchEffect();
    }

    initTypingEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            const text = subtitle.textContent;
            subtitle.textContent = '';
            subtitle.style.borderRight = '2px solid var(--accent-retro)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    subtitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 80);
                } else {
                    // Simple cursor blink
                    setInterval(() => {
                        subtitle.style.borderRight = subtitle.style.borderRight === 'none' 
                            ? '2px solid var(--accent-retro)' 
                            : 'none';
                    }, 800);
                }
            };
            
            setTimeout(typeWriter, 800);
        }
    }

    initGlitchEffect() {
        const highlight = document.querySelector('.highlight');
        if (highlight) {
            highlight.addEventListener('mouseenter', () => {
                const originalText = highlight.textContent;
                highlight.style.color = 'var(--accent-secondary)';
                
                setTimeout(() => {
                    highlight.style.color = 'var(--accent-retro)';
                }, 150);
            });
        }
    }
}

// Utility Functions
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

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const scrollAnimations = new ScrollAnimations();
    const retroEffects = new RetroEffects();
    
    // Simple loading animation
    window.addEventListener('load', () => {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContent && heroImage) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(20px)';
            heroImage.style.opacity = '0';
            heroImage.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'all 0.6s ease';
                heroImage.style.transition = 'all 0.6s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateX(0)';
            }, 200);
        }
    });
    
    // Handle resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 968 && navMenu.classList.contains('active')) {
            navigationManager.closeMobileMenu();
        }
    }, 250));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navigationManager.closeMobileMenu();
        }
    });
});

// Export for external use
window.portfolioJS = {
    ThemeManager,
    NavigationManager,
    ScrollAnimations,
    RetroEffects
};
