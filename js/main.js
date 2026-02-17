/* Arries Dental - Main JS */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const nav = document.querySelector('nav');
    const fadeItems = document.querySelectorAll('.fade-in');

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // AI Widget Logic
    const fab = document.getElementById('ai-fab');
    const aiWindow = document.getElementById('ai-window');
    const closeBtn = document.getElementById('ai-close');
    const navItems = document.querySelectorAll('.ai-nav-item');
    const views = document.querySelectorAll('.ai-view');
    const chatInput = document.getElementById('ai-input');
    const chatSend = document.getElementById('ai-send');
    const chatHistory = document.getElementById('chat-history');

    if (fab) {
        fab.addEventListener('click', () => {
            aiWindow.classList.toggle('active');
        });

        closeBtn.addEventListener('click', () => {
            aiWindow.classList.remove('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.dataset.tab;

                // Update nav items
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');

                // Update views with transition handling
                views.forEach(v => {
                    v.classList.remove('active');
                });

                const targetView = document.getElementById(`view-${target}`);
                if (targetView) {
                    targetView.classList.add('active');
                    if (target === 'chat') {
                        chatHistory.scrollTop = chatHistory.scrollHeight;
                        if (chatInput) chatInput.focus();
                    }
                }
            });
        });

        // Functional Suggestion Pills
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('ai-pill')) {
                const msg = e.target.dataset.msg;
                if (msg) {
                    window.switchTab('chat');
                    addMessage(msg, 'user');
                    setTimeout(() => {
                        simulateAIResponse();
                    }, 1000);
                }
            }
        });

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-bubble ${sender}`;
            msgDiv.textContent = text;
            chatHistory.appendChild(msgDiv);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        };

        const simulateAIResponse = () => {
            // Typing indicator
            const typingMsg = document.createElement('div');
            typingMsg.className = 'chat-bubble ai typing';
            typingMsg.textContent = "...";
            chatHistory.appendChild(typingMsg);
            chatHistory.scrollTop = chatHistory.scrollHeight;

            setTimeout(() => {
                if (typingMsg.parentNode) {
                    chatHistory.removeChild(typingMsg);
                }
                addMessage("That's a great question! I'm here to help. Would you like to check our pricing or schedule an appointment?", 'ai');
            }, 1200);
        };

        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (text) {
                addMessage(text, 'user');
                chatInput.value = '';
                setTimeout(() => {
                    simulateAIResponse();
                }, 800);
            }
        };

        if (chatSend) chatSend.addEventListener('click', sendMessage);
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }
    }

    // Global switch helper
    window.switchTab = (tabName) => {
        const navItem = document.querySelector(`.ai-nav-item[data-tab="${tabName}"]`);
        if (navItem) navItem.click();
    };

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeItems.forEach(item => {
        observer.observe(item);
    });

    // Interaction: Hover effect for service cards
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--secondary)';
        });
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active')) {
                card.style.borderColor = '#f0f0f0';
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.createElement('div');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
    document.querySelector('.container').appendChild(mobileMenuBtn);

    mobileMenuBtn.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
});