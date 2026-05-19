// --- SERVICE WORKER REGISTRATION ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[Service Worker] Registered successfully:', reg.scope))
            .catch(err => console.log('[Service Worker] Registration failed:', err));
    });
}

// --- DATA LISTS ---
const paragraphs = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the English alphabet at least once.",
    "Programming is the art of telling another human being what one wants the computer to do. It requires logic and creativity.",
    "Design is not just what it looks like and feels like. Design is how it works. A great interface is invisible to the user.",
    "In the middle of difficulty lies opportunity. The most important thing is to keep going and never give up on your dreams.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep pushing forward every single day.",
    "Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems.",
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    "Be the change that you wish to see in the world. Every small step counts towards making a big difference."
];

const wordsList = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "algorithm", "function", "variable", "syntax", "compile", "debug", "object", "class"
];

const homeRowWords = [
    "as", "ask", "all", "fall", "dad", "sad", "glad", "add", "has", "had",
    "half", "hall", "lass", "salad", "flask", "dash", "flash", "glass", "gas"
];

const numberFormats = [
    () => Math.floor(Math.random() * 100),
    () => Math.floor(Math.random() * 900) + 100,
    () => Math.floor(Math.random() * 9000) + 1000,
    () => (Math.random() * 100).toFixed(2),
    () => `$${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 99)}`,
    () => `${Math.floor(Math.random() * 100)}%`
];

const lessons = [
    { id: 1, title: "Lesson 1: The Home Row", content: "asdf jkl; asdf jkl; as df jk l; asdf jkl; a s d f j k l ;" },
    { id: 2, title: "Lesson 2: Keys E and I", content: "de ki de ki ed ik ed ik ded kik ded kik de ki de ki" },
    { id: 3, title: "Lesson 3: Keys R and U", content: "fr ju fr ju rf uj rf uj frf juj frf juj fr ju fr ju" },
    { id: 4, title: "Lesson 4: Keys T and Y", content: "ft jy ft jy tf yj tf yj ftf jyj ftf jyj ft jy ft jy" },
    { id: 5, title: "Lesson 5: Top Row Review", content: "qwer uiop qwer uiop re re ui ui te te yi yi qwer uiop" },
    { id: 6, title: "Lesson 6: Keys C and M", content: "dc jm dc jm cd mj cd mj dcd jmj dcd jmj dc jm dc jm" },
    { id: 7, title: "Lesson 7: Short Words", content: "the and for are but not you all any can had her was one our" },
    { id: 8, title: "Lesson 8: Basic Sentences", content: "The quick brown fox. A lazy dog ran fast. She sells sea shells." },
    { id: 9, title: "Lesson 9: Paragraph Practice", content: "Programming is the art of telling another human being what one wants the computer to do. It requires logic and creativity." },
    { id: 10, title: "Lesson 10: Advanced Mastery", content: "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep pushing forward every single day." }
];

// --- DOM ELEMENTS ---
const themeSelect = document.getElementById('theme-select');
const userBadgeContainer = document.getElementById('user-badge-container');
const displayUsername = document.getElementById('display-username');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');

const mascotImg = document.getElementById('mascot-img');
const modeBtns = document.querySelectorAll('.mode-btn');
const soundToggle = document.getElementById('sound-toggle');
const soundTypeSelect = document.getElementById('sound-type');
const soundVolumeRange = document.getElementById('sound-volume');
const resetDataBtn = document.getElementById('reset-data-btn');

const authPanel = document.getElementById('auth-panel');
const registerForm = document.getElementById('register-form');
const lessonsPanel = document.getElementById('lessons-panel');
const lessonsGrid = document.getElementById('lessons-grid');

const statsPanel = document.getElementById('stats-panel');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeDisplay = document.getElementById('time');
const mistakesDisplay = document.getElementById('mistakes');

const typingContainer = document.getElementById('typing-container');
const typingText = document.getElementById('typing-text');
const hiddenInput = document.getElementById('hidden-input');
const progressFill = document.getElementById('progress-fill');
const drillControls = document.getElementById('drill-controls');
const restartBtn = document.getElementById('restart-btn');

const gameContainer = document.getElementById('game-container');
const gameArea = document.getElementById('game-area');
const gameScoreDisplay = document.getElementById('game-score');
const gameLivesDisplay = document.getElementById('game-lives');
const gameInput = document.getElementById('game-input');

const dashboardPanel = document.getElementById('dashboard-panel');
const allTimeMaxWpmDisplay = document.getElementById('alltime-max-wpm');
const allTimeAvgWpmDisplay = document.getElementById('alltime-avg-wpm');
const allTimeAvgAccDisplay = document.getElementById('alltime-avg-acc');
const allTimeCompletedDisplay = document.getElementById('alltime-completed');
const historyLogTbody = document.getElementById('history-log-tbody');

const resultsModal = document.getElementById('results-modal');
const modalTitle = document.getElementById('modal-title');
const modalMascotImg = document.getElementById('modal-mascot-img');
const finalGrossWpm = document.getElementById('final-gross-wpm');
const finalNetWpm = document.getElementById('final-net-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const modalRestartBtn = document.getElementById('modal-restart-btn');
const modalNextBtn = document.getElementById('modal-next-btn');

// --- APP STATE ---
let currentTheme = 'cyberpunk';
let currentMode = 'lessons';
let isTyping = false;
let charIndex = 0;
let mistakes = 0;
let totalKeystrokes = 0;
let totalErrors = 0;
let startTime = null;
let timeLeft = 60;
let timeElapsed = 0;
let maxTime = 60;
let timerInterval = null;
let targetText = "";

// Game State
let gameScore = 0;
let gameLives = 3;
let fallingWords = [];
let gameLoopId = null;
let wordSpawnIntervalId = null;
let spawnRate = 2000;

// Web Audio Context
let audioCtx = null;

// --- INITIALIZE WEB AUDIO ---
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound Synthesizer via Web Audio API
function playSound(type) {
    if (!soundToggle.checked) return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const vol = parseFloat(soundVolumeRange.value || 0.5);
    const soundType = soundTypeSelect.value;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
        if (soundType === 'mechanical') {
            // High frequency click + noise simulation
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.02);
            gainNode.gain.setValueAtTime(vol * 0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
            osc.start(now);
            osc.stop(now + 0.02);
        } else if (soundType === 'typewriter') {
            // Short metallic tap
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.015);
            gainNode.gain.setValueAtTime(vol * 0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
            osc.start(now);
            osc.stop(now + 0.015);
        } else { // retro
            // Direct sharp synth beep
            osc.type = 'square';
            osc.frequency.setValueAtTime(1200, now);
            gainNode.gain.setValueAtTime(vol * 0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
            osc.start(now);
            osc.stop(now + 0.02);
        }
    } else if (type === 'space') {
        if (soundType === 'mechanical') {
            // Deeper, slightly longer thump
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
            gainNode.gain.setValueAtTime(vol * 0.25, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (soundType === 'typewriter') {
            // Thud sound
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.06);
            gainNode.gain.setValueAtTime(vol * 0.4, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.start(now);
            osc.stop(now + 0.06);
        } else { // retro
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            gainNode.gain.setValueAtTime(vol * 0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        }
    } else if (type === 'backspace') {
        if (soundType === 'mechanical') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.03);
            gainNode.gain.setValueAtTime(vol * 0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.03);
        } else if (soundType === 'typewriter') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);
            gainNode.gain.setValueAtTime(vol * 0.25, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
            osc.start(now);
            osc.stop(now + 0.02);
        } else { // retro
            // Descending sweep
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1000, now);
            osc.frequency.linearRampToValueAtTime(500, now + 0.05);
            gainNode.gain.setValueAtTime(vol * 0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    } else if (type === 'error') {
        // Low annoying buzz
        osc.type = 'square';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.15);
        gainNode.gain.setValueAtTime(vol * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (type === 'success') {
        // Joyful ascending arpeggio notes
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, idx) => {
            const oscNote = audioCtx.createOscillator();
            const gainNote = audioCtx.createGain();
            oscNote.connect(gainNote);
            gainNote.connect(audioCtx.destination);
            oscNote.type = 'sine';
            oscNote.frequency.setValueAtTime(freq, now + idx * 0.08);
            gainNote.gain.setValueAtTime(vol * 0.25, now + idx * 0.08);
            gainNote.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
            oscNote.start(now + idx * 0.08);
            oscNote.stop(now + idx * 0.08 + 0.2);
        });
    }
}

// --- AUTH & PROFILE HANDLERS ---
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        authPanel.style.display = 'none';
        userBadgeContainer.classList.remove('d-none');
        displayUsername.innerText = currentUser.username;
        updateProfileAvatar();
        
        // Render content
        switchPanel(currentMode);
    } else {
        authPanel.style.display = 'flex';
        userBadgeContainer.classList.add('d-none');
        hideAllActivePanels();
    }
}

function updateProfileAvatar() {
    if (currentTheme === 'palace') {
        userAvatar.src = 'assets/indian_mascot.png';
    } else if (currentTheme === 'retro') {
        userAvatar.src = 'assets/retro_keyboard_mascot.png';
    } else {
        userAvatar.src = 'assets/retro_keyboard_mascot.png';
    }
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    
    localStorage.setItem('currentUser', JSON.stringify({
        username: username,
        email: email,
        registeredAt: new Date().toISOString()
    }));
    
    if (!localStorage.getItem('typingHistory')) {
        localStorage.setItem('typingHistory', JSON.stringify([]));
    }
    if (!localStorage.getItem('unlockedLessonIndex')) {
        localStorage.setItem('unlockedLessonIndex', '0');
    }
    
    checkAuth();
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    checkAuth();
});

// --- THEME ENGINE ---
function initTheme() {
    const savedTheme = localStorage.getItem('appTheme') || 'cyberpunk';
    currentTheme = savedTheme;
    themeSelect.value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeAssets();
}

function updateThemeAssets() {
    if (currentTheme === 'palace') {
        mascotImg.src = 'assets/indian_mascot.png';
        modalMascotImg.src = 'assets/indian_trophy.png';
        document.getElementById('logo-title').innerText = "SAKSHAM TYPES";
        document.getElementById('logo-subtitle').innerText = "Royal Palace";
        document.getElementById('auth-title').innerText = "SAKSHAM TYPES";
        document.getElementById('auth-subtitle').innerText = "Enter the Royal Court of Typing";
        document.getElementById('auth-submit-btn').innerText = "ENTER ROYAL COURT";
        document.getElementById('auth-ornament').innerText = "❖";
    } else if (currentTheme === 'retro') {
        mascotImg.src = 'assets/retro_keyboard_mascot.png';
        modalMascotImg.src = 'assets/retro_gold_trophy.png';
        document.getElementById('logo-title').innerText = "SAKSHAM TYPES";
        document.getElementById('logo-subtitle').innerText = "Retro Terminal";
        document.getElementById('auth-title').innerText = "SAKSHAM TYPES";
        document.getElementById('auth-subtitle').innerText = "Connect to Typing Mainframe";
        document.getElementById('auth-submit-btn').innerText = "ENTER SYSTEM";
        document.getElementById('auth-ornament').innerText = "┌────────────────┐";
    } else { // cyberpunk
        mascotImg.src = 'assets/retro_keyboard_mascot.png';
        modalMascotImg.src = 'assets/retro_gold_trophy.png';
        document.getElementById('logo-title').innerText = "SAKSHAM TYPES";
        document.getElementById('logo-subtitle').innerText = "Cyberpunk Space";
        document.getElementById('auth-title').innerText = "SAKSHAM TYPES";
        document.getElementById('auth-subtitle').innerText = "Initiate Typing Simulation V1";
        document.getElementById('auth-submit-btn').innerText = "ENTER THE SPACE";
        document.getElementById('auth-ornament').innerText = "⚡ NEON OVERDRIVE ⚡";
    }
    updateProfileAvatar();
}

themeSelect.addEventListener('change', (e) => {
    currentTheme = e.target.value;
    localStorage.setItem('appTheme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeAssets();
});

// --- NAVIGATION PANEL SWITCHING ---
function hideAllActivePanels() {
    lessonsPanel.style.display = 'none';
    statsPanel.style.display = 'none';
    typingContainer.style.display = 'none';
    drillControls.style.display = 'none';
    gameContainer.style.display = 'none';
    dashboardPanel.style.display = 'none';
}

function switchPanel(mode) {
    currentMode = mode;
    hideAllActivePanels();
    resultsModal.classList.remove('show');
    
    // Stop run loops
    clearInterval(timerInterval);
    cancelAnimationFrame(gameLoopId);
    clearInterval(wordSpawnIntervalId);
    isTyping = false;
    
    // Update active nav button
    modeBtns.forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (!localStorage.getItem('currentUser')) return;

    if (mode === 'lessons') {
        lessonsPanel.style.display = 'block';
        renderLessonsGrid();
    } else if (mode === 'dashboard') {
        dashboardPanel.style.display = 'block';
        renderDashboard();
    } else if (mode === 'fallingWords') {
        gameContainer.style.display = 'flex';
        initFallingWordsGame();
    } else {
        // practice drills: paragraph, word, homerow, number
        statsPanel.style.display = 'flex';
        typingContainer.style.display = 'block';
        drillControls.style.display = 'flex';
        initTypingDrill(mode);
    }
}

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchPanel(btn.dataset.mode);
    });
});

// --- PROGRESSIVE LESSONS GRID ---
function renderLessonsGrid() {
    lessonsGrid.innerHTML = '';
    const unlockedIndex = parseInt(localStorage.getItem('unlockedLessonIndex') || '0');
    
    lessons.forEach((lesson, index) => {
        const isLocked = index > unlockedIndex;
        const activeLessonIndex = parseInt(localStorage.getItem('activeLessonIndex') || '-1');
        
        const card = document.createElement('div');
        card.className = `lesson-card glass-panel ${isLocked ? 'locked' : ''} ${activeLessonIndex === index ? 'active' : ''}`;
        
        card.innerHTML = `
            <div>
                <span class="lesson-num">Lesson ${lesson.id}</span>
                <div class="lesson-title">${lesson.title.replace(`Lesson ${lesson.id}: `, '')}</div>
            </div>
            <span class="lesson-badge ${isLocked ? 'locked-badge' : 'unlocked'}">
                ${isLocked ? 'Locked 🔒' : 'Unlocked 🔓'}
            </span>
        `;
        
        if (!isLocked) {
            card.addEventListener('click', () => {
                localStorage.setItem('activeLessonIndex', index);
                startLessonDrill(index);
            });
        }
        
        lessonsGrid.appendChild(card);
    });
}

function startLessonDrill(lessonIndex) {
    currentMode = `lesson-${lessonIndex}`;
    hideAllActivePanels();
    
    statsPanel.style.display = 'flex';
    typingContainer.style.display = 'block';
    drillControls.style.display = 'flex';
    
    initTypingDrill(currentMode);
}

function generateDrillText(mode) {
    if (mode === 'paragraph') {
        let p1 = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        let p2 = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        while (p1 === p2 && paragraphs.length > 1) {
            p2 = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        }
        return p1 + " " + p2;
    } else if (mode === 'word') {
        let words = [];
        for (let i = 0; i < 45; i++) {
            words.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
        }
        return words.join(' ');
    } else if (mode === 'homerow') {
        let words = [];
        for (let i = 0; i < 35; i++) {
            words.push(homeRowWords[Math.floor(Math.random() * homeRowWords.length)]);
        }
        return words.join(' ');
    } else if (mode === 'number') {
        let numbers = [];
        for (let i = 0; i < 35; i++) {
            numbers.push(numberFormats[Math.floor(Math.random() * numberFormats.length)]());
        }
        return numbers.join(' ');
    } else if (mode.startsWith('lesson-')) {
        const lessonIdx = parseInt(mode.split('-')[1]);
        const content = lessons[lessonIdx].content;
        return content + " " + content; // Double the lesson content for a longer, more thorough drill
    }
    return "";
}

function initTypingDrill(mode) {
    clearInterval(timerInterval);
    isTyping = false;
    charIndex = 0;
    mistakes = 0;
    totalKeystrokes = 0;
    totalErrors = 0;
    startTime = null;
    
    // Check if it's lesson mode or regular mode
    let targetModeTitle = mode;
    if (mode.startsWith('lesson-')) {
        const idx = parseInt(mode.split('-')[1]);
        targetModeTitle = lessons[idx].title;
        maxTime = 90; // curriculum lessons get 90 seconds limit or we track time elapsed.
        timeLeft = 0; // lessons track elapsed time
    } else {
        maxTime = 60; // 60s countdown
        timeLeft = maxTime;
    }
    
    // Reset stats displays
    wpmDisplay.innerText = "0";
    accuracyDisplay.innerText = "100%";
    mistakesDisplay.innerText = "0";
    timeDisplay.innerText = mode.startsWith('lesson-') ? "0:00" : `${timeLeft}s`;
    
    progressFill.style.width = "0%";
    resultsModal.classList.remove('show');
    typingContainer.classList.remove('active');
    
    targetText = generateDrillText(mode);
    typingText.innerHTML = '';
    
    // Inject spans char by char to prevent word wrap bugs
    targetText.split('').forEach((char) => {
        let charSpan = document.createElement('span');
        charSpan.classList.add('char');
        charSpan.textContent = char;
        typingText.appendChild(charSpan);
    });
    
    hiddenInput.value = '';
    updateCaret();
    
    // Reset scroll of container
    typingContainer.scrollTop = 0;
    
    // Focus trigger
    hiddenInput.focus();
}

function updateCaret() {
    const characters = typingText.querySelectorAll('.char');
    characters.forEach(span => {
        span.classList.remove('active');
        span.classList.remove('word-active');
    });
    
    if (charIndex < characters.length) {
        characters[charIndex].classList.add('active');
        
        // Highlight active word
        let start = charIndex;
        while (start > 0 && characters[start - 1].textContent !== ' ') {
            start--;
        }
        let end = charIndex;
        while (end < characters.length && characters[end].textContent !== ' ') {
            end++;
        }
        for (let i = start; i < end; i++) {
            characters[i].classList.add('word-active');
        }
        
        // Auto Scroll
        const activeSpan = characters[charIndex];
        if (activeSpan.offsetTop > typingContainer.scrollTop + typingContainer.clientHeight - 80) {
            typingContainer.scrollTop = activeSpan.offsetTop - typingContainer.clientHeight / 2;
        } else if (activeSpan.offsetTop < typingContainer.scrollTop) {
            typingContainer.scrollTop = activeSpan.offsetTop;
        }
    }
}

function handleTyping() {
    const characters = typingText.querySelectorAll('.char');
    const typedText = hiddenInput.value;
    
    if (!isTyping && typedText.length > 0) {
        isTyping = true;
        typingContainer.classList.add('active');
        timeElapsed = 0;
        startTime = Date.now();
        
        if (currentMode.startsWith('lesson-')) {
            timerInterval = setInterval(updateElapsedTimer, 1000);
        } else {
            timerInterval = setInterval(updateCountdownTimer, 1000);
        }
    }
    
    let clickPlayed = false;
    
    // Secure backspaces
    while (charIndex > typedText.length) {
        charIndex--;
        if (characters[charIndex].classList.contains('incorrect')) {
            mistakes = Math.max(0, mistakes - 1);
        }
        characters[charIndex].classList.remove('correct', 'incorrect');
        
        if (!clickPlayed) {
            playSound('backspace');
            clickPlayed = true;
        }
    }
    
    // Forward typing
    while (charIndex < typedText.length && charIndex < characters.length) {
        const expected = characters[charIndex].textContent;
        const typed = typedText[charIndex];
        totalKeystrokes++;
        
        if (typed === expected) {
            characters[charIndex].classList.add('correct');
            if (!clickPlayed) {
                if (typed === ' ') {
                    playSound('space');
                } else {
                    playSound('click');
                }
                clickPlayed = true;
            }
        } else {
            mistakes++;
            totalErrors++;
            characters[charIndex].classList.add('incorrect');
            if (!clickPlayed) {
                playSound('error');
                clickPlayed = true;
            }
        }
        charIndex++;
    }
    
    // Limit typing length
    if (hiddenInput.value.length > characters.length) {
        hiddenInput.value = hiddenInput.value.substring(0, characters.length);
    }
    
    updateCaret();
    
    // Realtime stats
    let accuracy = 100;
    if (totalKeystrokes > 0) {
        accuracy = Math.round(((totalKeystrokes - totalErrors) / totalKeystrokes) * 100);
    }
    accuracy = accuracy < 0 ? 0 : accuracy;
    accuracyDisplay.innerText = `${accuracy}%`;
    mistakesDisplay.innerText = mistakes;
    
    let progress = (charIndex / characters.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Realtime speed
    let dur = startTime ? (Date.now() - startTime) / 1000 : 1;
    dur = Math.max(1, dur);
    let netWpm = Math.round(((totalKeystrokes - mistakes) / 5) / (dur / 60));
    wpmDisplay.innerText = netWpm < 0 ? 0 : netWpm;
    
    // Complete drill check
    if (charIndex === characters.length) {
        endTypingDrill();
    }
}

function formatLessonTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateElapsedTimer() {
    timeElapsed++;
    timeDisplay.innerText = formatLessonTime(timeElapsed);
    
    let dur = startTime ? (Date.now() - startTime) / 1000 : timeElapsed;
    dur = Math.max(1, dur);
    let netWpm = Math.round(((totalKeystrokes - mistakes) / 5) / (dur / 60));
    wpmDisplay.innerText = netWpm < 0 ? 0 : netWpm;
}

function updateCountdownTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeDisplay.innerText = `${timeLeft}s`;
        
        let dur = startTime ? (Date.now() - startTime) / 1000 : (maxTime - timeLeft);
        dur = Math.max(1, dur);
        let netWpm = Math.round(((totalKeystrokes - mistakes) / 5) / (dur / 60));
        wpmDisplay.innerText = netWpm < 0 ? 0 : netWpm;
    } else {
        endTypingDrill();
    }
}

function endTypingDrill() {
    clearInterval(timerInterval);
    isTyping = false;
    hiddenInput.blur();
    typingContainer.classList.remove('active');
    
    let dur = startTime ? (Date.now() - startTime) / 1000 : (currentMode.startsWith('lesson-') ? timeElapsed : (maxTime - timeLeft));
    dur = Math.max(1, dur);
    const minutes = dur / 60;
    
    let grossWpm = Math.round((totalKeystrokes / 5) / minutes);
    let netWpm = Math.round(((totalKeystrokes - mistakes) / 5) / minutes);
    
    grossWpm = grossWpm < 0 ? 0 : grossWpm;
    netWpm = netWpm < 0 ? 0 : netWpm;
    
    let accuracy = 100;
    if (totalKeystrokes > 0) {
        accuracy = Math.round(((totalKeystrokes - totalErrors) / totalKeystrokes) * 100);
    }
    accuracy = accuracy < 0 ? 0 : accuracy;
    
    // Play completion sound chime
    if (accuracy >= 90 || !currentMode.startsWith('lesson-')) {
        playSound('success');
    }
    
    // Save history
    let history = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    let logName = currentMode;
    if (currentMode.startsWith('lesson-')) {
        const idx = parseInt(currentMode.split('-')[1]);
        logName = lessons[idx].title;
    } else {
        logName = currentMode.toUpperCase() + " Practice";
    }
    
    const runResult = {
        mode: logName,
        grossWpm: grossWpm,
        netWpm: netWpm,
        accuracy: accuracy,
        passed: true,
        date: new Date().toISOString()
    };
    
    // Setup modal elements
    finalGrossWpm.innerText = `${grossWpm} WPM`;
    finalNetWpm.innerText = `${netWpm} WPM`;
    finalAccuracy.innerText = `${accuracy}%`;
    
    // Curriculum Unlock Logic
    if (currentMode.startsWith('lesson-')) {
        const idx = parseInt(currentMode.split('-')[1]);
        let unlockedIndex = parseInt(localStorage.getItem('unlockedLessonIndex') || '0');
        
        if (accuracy >= 90) {
            modalTitle.innerText = "Drill Passed! (≥90% Acc)";
            modalTitle.style.color = "var(--correct)";
            runResult.passed = true;
            
            // Unlock logic
            if (idx === unlockedIndex && unlockedIndex < lessons.length - 1) {
                unlockedIndex++;
                localStorage.setItem('unlockedLessonIndex', unlockedIndex.toString());
            }
            
            if (idx < lessons.length - 1) {
                modalNextBtn.classList.remove('d-none');
            } else {
                modalNextBtn.classList.add('d-none');
            }
        } else {
            modalTitle.innerText = "Drill Failed (<90% Acc)";
            modalTitle.style.color = "var(--incorrect)";
            runResult.passed = false;
            modalNextBtn.classList.add('d-none');
        }
    } else {
        modalTitle.innerText = "Practice Drill Complete! 🎉";
        modalTitle.style.color = "var(--accent)";
        modalNextBtn.classList.add('d-none');
    }
    
    // Save record to DB
    history.push(runResult);
    localStorage.setItem('typingHistory', JSON.stringify(history));
    
    resultsModal.classList.add('show');
}

// --- ARCADE GAME (FALLING WORDS) ---
function initFallingWordsGame() {
    clearInterval(timerInterval);
    cancelAnimationFrame(gameLoopId);
    clearInterval(wordSpawnIntervalId);
    
    gameScore = 0;
    gameLives = 3;
    spawnRate = 2000;
    fallingWords = [];
    
    gameScoreDisplay.innerText = gameScore;
    gameLivesDisplay.innerText = gameLives;
    gameInput.value = '';
    gameArea.innerHTML = '';
    
    wordSpawnIntervalId = setInterval(spawnFallingWord, spawnRate);
    gameLoopId = requestAnimationFrame(gameLoop);
    
    gameInput.focus();
}

function spawnFallingWord() {
    const text = wordsList[Math.floor(Math.random() * wordsList.length)];
    const el = document.createElement('div');
    el.className = 'falling-word';
    el.innerText = text;
    // Bounds check to keep words visible in area (between 5% and 85% width)
    el.style.left = `${Math.floor(Math.random() * 80) + 5}%`;
    gameArea.appendChild(el);
    
    fallingWords.push({
        text: text,
        element: el,
        y: -40
    });
}

function gameLoop() {
    // Increase falling speed incrementally as score grows
    const speed = 1.0 + (gameScore * 0.015);
    
    for (let i = fallingWords.length - 1; i >= 0; i--) {
        let wordObj = fallingWords[i];
        wordObj.y += speed;
        wordObj.element.style.top = `${wordObj.y}px`;
        
        // Check if word hits the floor
        if (wordObj.y > gameArea.clientHeight) {
            wordObj.element.remove();
            fallingWords.splice(i, 1);
            gameLives--;
            gameLivesDisplay.innerText = gameLives;
            playSound('error');
            
            // Screen flash red effect
            gameArea.style.boxShadow = "inset 0 0 40px rgba(239, 68, 68, 0.4)";
            setTimeout(() => {
                gameArea.style.boxShadow = "none";
            }, 150);
            
            if (gameLives <= 0) {
                endFallingWordsGame();
                return;
            }
        }
    }
    
    // Highlight matched partial letters
    const inputVal = gameInput.value.trim().toLowerCase();
    fallingWords.forEach(wordObj => {
        if (inputVal.length > 0 && wordObj.text.startsWith(inputVal)) {
            wordObj.element.classList.add('typing');
        } else {
            wordObj.element.classList.remove('typing');
        }
    });
    
    // Spawn faster as score scales
    const targetSpawnRate = Math.max(800, 2000 - (gameScore * 8));
    if (targetSpawnRate < spawnRate) {
        spawnRate = targetSpawnRate;
        clearInterval(wordSpawnIntervalId);
        wordSpawnIntervalId = setInterval(spawnFallingWord, spawnRate);
    }
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

gameInput.addEventListener('input', () => {
    if (currentMode !== 'fallingWords') return;
    
    const inputVal = gameInput.value.trim().toLowerCase();
    const matchIndex = fallingWords.findIndex(w => w.text === inputVal);
    
    if (matchIndex !== -1) {
        const matched = fallingWords[matchIndex];
        
        // Explode scale animation before remove
        matched.element.style.transform = "translateX(-50%) scale(1.4)";
        matched.element.style.opacity = "0";
        playSound('click');
        
        setTimeout(() => {
            matched.element.remove();
        }, 150);
        
        fallingWords.splice(matchIndex, 1);
        gameScore += 10;
        gameScoreDisplay.innerText = gameScore;
        gameInput.value = '';
    }
});

function endFallingWordsGame() {
    cancelAnimationFrame(gameLoopId);
    clearInterval(wordSpawnIntervalId);
    gameInput.blur();
    
    playSound('error');
    
    // Save to history
    let history = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    const runResult = {
        mode: "Falling Words Arcade",
        grossWpm: gameScore, // Use score as metric
        netWpm: gameScore,
        accuracy: 100,
        passed: true,
        date: new Date().toISOString()
    };
    history.push(runResult);
    localStorage.setItem('typingHistory', JSON.stringify(history));
    
    // Populate modal values
    modalTitle.innerText = "Game Over!";
    modalTitle.style.color = "var(--incorrect)";
    finalGrossWpm.innerText = `${gameScore} pts`;
    finalNetWpm.innerText = `${gameScore} pts`;
    finalAccuracy.innerText = "Completed";
    modalNextBtn.classList.add('d-none');
    
    resultsModal.classList.add('show');
}

// --- STATS & HISTORY DASHBOARD ---
function renderDashboard() {
    const history = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    historyLogTbody.innerHTML = '';
    
    if (history.length === 0) {
        allTimeMaxWpmDisplay.innerText = "0";
        allTimeAvgWpmDisplay.innerText = "0";
        allTimeAvgAccDisplay.innerText = "100%";
        allTimeCompletedDisplay.innerText = "0";
        
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="6" style="text-align:center; color:var(--text-secondary);">No history drills completed yet. Start typing to build stats!</td>`;
        historyLogTbody.appendChild(emptyRow);
        return;
    }
    
    let maxWpm = 0;
    let sumWpm = 0;
    let sumAcc = 0;
    let testsCompleted = 0;
    
    // Render logs reversed (newest first)
    const reversedHistory = [...history].reverse();
    
    reversedHistory.forEach((run) => {
        let isGame = run.mode.includes("Arcade");
        
        if (!isGame) {
            if (run.netWpm > maxWpm) maxWpm = run.netWpm;
            sumWpm += run.netWpm;
            sumAcc += run.accuracy;
            testsCompleted++;
        }
        
        const row = document.createElement('tr');
        const formattedDate = new Date(run.date).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
        
        const wpmMetric = isGame ? `${run.netWpm} pts` : `${run.netWpm} WPM`;
        const grossWpmMetric = isGame ? `${run.grossWpm} pts` : `${run.grossWpm} WPM`;
        const accuracyMetric = isGame ? "N/A" : `${run.accuracy}%`;
        const statusBadge = isGame ? "Arcade" : (run.passed ? "PASSED" : "FAILED");
        const badgeColor = isGame ? "var(--accent)" : (run.passed ? "var(--correct)" : "var(--incorrect)");
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td style="font-weight:bold;">${run.mode}</td>
            <td>${grossWpmMetric}</td>
            <td style="color:var(--accent); font-weight:bold;">${wpmMetric}</td>
            <td>${accuracyMetric}</td>
            <td><span style="color:${badgeColor}; font-weight:bold; font-size:0.8rem;">${statusBadge}</span></td>
        `;
        historyLogTbody.appendChild(row);
    });
    
    const avgWpm = testsCompleted > 0 ? Math.round(sumWpm / testsCompleted) : 0;
    const avgAcc = testsCompleted > 0 ? Math.round(sumAcc / testsCompleted) : 100;
    
    allTimeMaxWpmDisplay.innerText = maxWpm;
    allTimeAvgWpmDisplay.innerText = avgWpm;
    allTimeAvgAccDisplay.innerText = `${avgAcc}%`;
    allTimeCompletedDisplay.innerText = history.length;
}

resetDataBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all of your progress, lesson unlocks, and history data? This cannot be undone.")) {
        localStorage.removeItem('typingHistory');
        localStorage.removeItem('unlockedLessonIndex');
        localStorage.removeItem('activeLessonIndex');
        alert("All stats and history have been successfully reset.");
        
        // Re-route to current view
        switchPanel(currentMode);
    }
});

// --- EVENT LISTENERS & TRIGGERS ---
hiddenInput.addEventListener('input', handleTyping);

restartBtn.addEventListener('click', () => {
    if (currentMode.startsWith('lesson-')) {
        const idx = parseInt(currentMode.split('-')[1]);
        startLessonDrill(idx);
    } else {
        initTypingDrill(currentMode);
    }
});

modalRestartBtn.addEventListener('click', () => {
    resultsModal.classList.remove('show');
    if (currentMode === 'fallingWords') {
        initFallingWordsGame();
    } else if (currentMode.startsWith('lesson-')) {
        const idx = parseInt(currentMode.split('-')[1]);
        startLessonDrill(idx);
    } else {
        initTypingDrill(currentMode);
    }
});

modalNextBtn.addEventListener('click', () => {
    resultsModal.classList.remove('show');
    if (currentMode.startsWith('lesson-')) {
        const idx = parseInt(currentMode.split('-')[1]);
        if (idx < lessons.length - 1) {
            localStorage.setItem('activeLessonIndex', idx + 1);
            startLessonDrill(idx + 1);
        }
    }
});

// Sound Settings persistence saving
soundToggle.addEventListener('change', (e) => {
    localStorage.setItem('soundEnabled', e.target.checked);
});
soundTypeSelect.addEventListener('change', (e) => {
    localStorage.setItem('soundType', e.target.value);
});
soundVolumeRange.addEventListener('input', (e) => {
    localStorage.setItem('soundVolume', e.target.value);
});

// Load audio settings from cache
if (localStorage.getItem('soundEnabled') === 'false') {
    soundToggle.checked = false;
}
if (localStorage.getItem('soundType')) {
    soundTypeSelect.value = localStorage.getItem('soundType');
}
if (localStorage.getItem('soundVolume')) {
    soundVolumeRange.value = localStorage.getItem('soundVolume');
}

// Redirect keys to hidden input when applicable
document.addEventListener('keydown', (e) => {
    // If not logged in or in dashboard/lessons menus, ignore key forwards
    if (!localStorage.getItem('currentUser')) return;
    
    if (currentMode === 'fallingWords') {
        // focus game input
        if (document.activeElement !== gameInput) {
            gameInput.focus();
        }
    } else if (currentMode !== 'lessons' && currentMode !== 'dashboard') {
        // Prevent key focus defaults
        if (e.key === 'Tab') return;
        if (e.key.length === 1 || e.key === 'Backspace') {
            hiddenInput.focus();
        }
    }
});

typingContainer.addEventListener('click', () => {
    if (currentMode !== 'lessons' && currentMode !== 'dashboard' && currentMode !== 'fallingWords') {
        hiddenInput.focus();
    }
});

// --- INIT APP RUN ---
initTheme();
checkAuth();
