document.addEventListener('DOMContentLoaded', () => {
    // State Tracker
    let activeIndex = 0;

    // Element References
    const themeToggleBtn = document.getElementById('themeToggle');
    const screens = Array.from(document.querySelectorAll('.letter-screen'));
    const progressDots = Array.from(document.querySelectorAll('.progress-dot'));

    // Navigation Buttons
    const openLetterBtn = document.querySelector('.open-letter-button');
    const openEnvelopeBtn = document.querySelector('.open-envelope-button');
    const continueLetterBtn = document.querySelector('.continue-letter-button');
    const yesBtn = document.querySelector('.yes-button');
    const thinkBtn = document.querySelector('.think-button');
    const replayBtn = document.querySelector('.replay-button');

    // Envelope Interactive Elements
    const envelope = document.getElementById('interactiveEnvelope');

    // Dynamic Texts for the "Think" button
    const thinkPhrases = [
        "Are you sure? 🥹",
        "Think again... 💖",
        "Pretty please? 🥺",
        "Don't break my heart! 💔",
        "Just say yes! ✨"
    ];
    let thinkClickCount = 0;

    // --- Theme Switcher Logic ---
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark-mode');
            themeToggleBtn.textContent = '☀️';
            themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        }
    };

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
        themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // --- Screen Navigation & Progress Dots ---
    const updateProgress = (targetIndex) => {
        progressDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === targetIndex);
        });
    };

    const goToScreen = (targetIndex) => {
        if (targetIndex < 0 || targetIndex >= screens.length) return;

        screens[activeIndex].classList.remove('active');
        screens[targetIndex].classList.add('active');

        activeIndex = targetIndex;
        updateProgress(activeIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Heart Particle Shower ---
    const spawnHeartParticle = () => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        const heartIcons = ['❤️', '💖', '💕', '💗', '🌸', '✨'];
        heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

        heart.style.left = `${Math.random() * 90 + 5}vw`;
        heart.style.animationDuration = `${3 + Math.random() * 2}s`;

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 5000);
    };

    const triggerHeartShower = (amount = 35) => {
        for (let i = 0; i < amount; i++) {
            setTimeout(spawnHeartParticle, i * 100);
        }
    };

    // --- Event Listeners ---

    // 1. Intro -> Envelope
    openLetterBtn.addEventListener('click', () => goToScreen(1));

    // 2. Envelope Animation Handling
    const handleEnvelopeOpening = () => {
        if (envelope.classList.contains('open')) return;

        envelope.classList.add('open');
        setTimeout(() => goToScreen(2), 900);
    };

    openEnvelopeBtn.addEventListener('click', handleEnvelopeOpening);
    envelope.addEventListener('click', handleEnvelopeOpening);
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleEnvelopeOpening();
        }
    });

    // 3. Letter Paper -> Question
    continueLetterBtn.addEventListener('click', () => goToScreen(3));

    // 4. Question Response Interactivity
    thinkBtn.addEventListener('click', () => {
        if (thinkClickCount < thinkPhrases.length) {
            thinkBtn.textContent = thinkPhrases[thinkClickCount];
            thinkClickCount++;

            // Incrementally scale the YES button to draw attention
            const currentScale = 1 + thinkClickCount * 0.12;
            yesBtn.style.transform = `scale(${currentScale})`;
        } else {
            thinkBtn.textContent = "Okay fine, YES! 🥰";
            thinkBtn.style.background = "var(--accent)";
            thinkBtn.style.color = "#ffffff";

            setTimeout(() => {
                goToScreen(4);
                triggerHeartShower(40);
            }, 600);
        }
    });

    yesBtn.addEventListener('click', () => {
        goToScreen(4);
        triggerHeartShower(50);
    });

    // 5. Success Screen Reset
    replayBtn.addEventListener('click', () => {
        envelope.classList.remove('open');
        thinkClickCount = 0;
        thinkBtn.textContent = "Let me think... 🙈";
        thinkBtn.style.background = "";
        thinkBtn.style.color = "";
        yesBtn.style.transform = "";

        goToScreen(0);
    });

    // Run Initialization
    initTheme();
});