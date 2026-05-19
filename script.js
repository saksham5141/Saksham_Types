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
    () => Math.floor(Math.random() * 100),                // 0-99
    () => Math.floor(Math.random() * 900) + 100,          // 100-999
    () => Math.floor(Math.random() * 9000) + 1000,        // 1000-9999
    () => (Math.random() * 100).toFixed(2),               // Decimals
    () => `$${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 99)}`, // Currency
    () => `${Math.floor(Math.random() * 100)}%`           // Percentages
];

// DOM Elements
const modeBtns = document.querySelectorAll('.mode-btn');
const statsPanel = document.getElementById('stats-panel');
const typingContainer = document.querySelector('.typing-container');
const controls = document.querySelector('.controls');
const gameContainer = document.getElementById('game-container');

const typingText = document.getElementById('typing-text');
const hiddenInput = document.getElementById('hidden-input');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeDisplay = document.getElementById('time');
const mistakesDisplay = document.getElementById('mistakes');
const restartBtn = document.getElementById('restart-btn');
const progressFill = document.getElementById('progress-fill');

// Game Elements
const gameArea = document.getElementById('game-area');
const gameScoreDisplay = document.getElementById('game-score');
const gameLivesDisplay = document.getElementById('game-lives');
const gameInput = document.getElementById('game-input');

// Modal Elements
const resultsModal = document.getElementById('results-modal');
const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const modalRestartBtn = document.getElementById('modal-restart-btn');

// App State
let currentMode = 'paragraph';
const maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;
let timer;
let targetText = "";

// Game State
let gameScore = 0;
let gameLives = 3;
let fallingWords = [];
let gameLoopId;
let wordSpawnIntervalId;
let spawnRate = 2000;

// Initialize layout
function setupMode() {
    if (currentMode === 'fallingWords') {
        typingContainer.style.display = 'none';
        statsPanel.style.display = 'none';
        controls.style.display = 'none';
        gameContainer.style.display = 'flex';
        initGame();
    } else {
        gameContainer.style.display = 'none';
        typingContainer.style.display = 'block';
        statsPanel.style.display = 'flex';
        controls.style.display = 'flex';
        initTyping();
    }
}

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        
        // Stop any running activities
        clearInterval(timer);
        cancelAnimationFrame(gameLoopId);
        clearInterval(wordSpawnIntervalId);
        
        setupMode();
    });
});

function generateText(mode) {
    if (mode === 'paragraph') {
        return paragraphs[Math.floor(Math.random() * paragraphs.length)];
    } else if (mode === 'word') {
        let text = [];
        for(let i=0; i<20; i++) text.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
        return text.join(' ');
    } else if (mode === 'homerow') {
        let text = [];
        for(let i=0; i<15; i++) text.push(homeRowWords[Math.floor(Math.random() * homeRowWords.length)]);
        return text.join(' ');
    } else if (mode === 'number') {
        let text = [];
        for(let i=0; i<15; i++) text.push(numberFormats[Math.floor(Math.random() * numberFormats.length)]());
        return text.join(' ');
    }
    return "";
}

function initTyping() {
    timeLeft = maxTime;
    charIndex = 0;
    mistakes = 0;
    isTyping = false;
    clearInterval(timer);

    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = '100%';
    timeDisplay.innerText = `${timeLeft}s`;
    mistakesDisplay.innerText = 0;
    progressFill.style.width = '0%';
    resultsModal.classList.remove('show');
    typingContainer.classList.remove('active');

    targetText = generateText(currentMode);
    
    typingText.innerHTML = '';
    targetText.split('').forEach((char) => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });

    if (typingText.querySelectorAll('span').length > 0) {
        typingText.querySelectorAll('span')[0].classList.add('active');
    }
    
    hiddenInput.value = '';
    
    // Focus logic
    hiddenInput.focus();
}

function handleTyping() {
    if (currentMode === 'fallingWords') return;

    const characters = typingText.querySelectorAll('span');
    const typedChar = hiddenInput.value.split('')[charIndex];

    if (charIndex < characters.length && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(updateTimer, 1000);
            isTyping = true;
            typingContainer.classList.add('active');
        }

        if (typedChar == null) {
            // Backspace logic
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains('incorrect')) {
                    mistakes--;
                }
                characters[charIndex].classList.remove('correct', 'incorrect');
            }
        } else {
            // Typing logic
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add('correct');
            } else {
                mistakes++;
                characters[charIndex].classList.add('incorrect');
            }
            charIndex++;
        }

        characters.forEach(span => span.classList.remove('active'));
        if (charIndex < characters.length) {
            characters[charIndex].classList.add('active');
        }

        let wpm = Math.round(((charIndex - mistakes) / 5) / ((maxTime - timeLeft) / 60));
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100);
        accuracy = accuracy < 0 || !accuracy || isNaN(accuracy) ? 100 : accuracy;

        wpmDisplay.innerText = wpm;
        accuracyDisplay.innerText = `${accuracy}%`;
        mistakesDisplay.innerText = mistakes;
        
        const progress = (charIndex / characters.length) * 100;
        progressFill.style.width = `${progress}%`;

        if (charIndex === characters.length) {
            endGame(wpm, accuracy);
        }
    } else {
        hiddenInput.value = hiddenInput.value.substring(0, charIndex);
    }
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeDisplay.innerText = `${timeLeft}s`;
        
        let wpm = Math.round(((charIndex - mistakes) / 5) / ((maxTime - timeLeft) / 60));
        wpmDisplay.innerText = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    } else {
        clearInterval(timer);
        let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100);
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime / 60));
        endGame(wpm, accuracy);
    }
}

function endGame(wpm, accuracy) {
    if (currentMode === 'fallingWords') return;
    
    clearInterval(timer);
    isTyping = false;
    hiddenInput.blur();
    typingContainer.classList.remove('active');
    
    finalWpm.innerText = wpm < 0 || !wpm ? 0 : wpm;
    finalAccuracy.innerText = `${accuracy < 0 || !accuracy || isNaN(accuracy) ? 0 : accuracy}%`;
    resultsModal.classList.add('show');
}

// Game Logic
function initGame() {
    gameScore = 0;
    gameLives = 3;
    spawnRate = 2000;
    fallingWords = [];
    
    gameScoreDisplay.innerText = gameScore;
    gameLivesDisplay.innerText = gameLives;
    gameInput.value = '';
    gameArea.innerHTML = '';
    resultsModal.classList.remove('show');
    
    cancelAnimationFrame(gameLoopId);
    clearInterval(wordSpawnIntervalId);
    
    wordSpawnIntervalId = setInterval(spawnWord, spawnRate);
    gameLoopId = requestAnimationFrame(gameLoop);
    gameInput.focus();
}

function spawnWord() {
    const text = wordsList[Math.floor(Math.random() * wordsList.length)];
    const el = document.createElement('div');
    el.className = 'falling-word';
    el.innerText = text;
    // Make sure it spawns within view horizontally
    el.style.left = `${Math.max(10, Math.random() * 85)}%`;
    gameArea.appendChild(el);
    
    fallingWords.push({
        text: text,
        element: el,
        y: -30
    });
}

function gameLoop() {
    const speed = 1 + (gameScore * 0.02); // increase speed progressively
    
    for (let i = fallingWords.length - 1; i >= 0; i--) {
        let fw = fallingWords[i];
        fw.y += speed;
        fw.element.style.top = `${fw.y}px`;
        
        if (fw.y > gameArea.clientHeight) {
            fw.element.remove();
            fallingWords.splice(i, 1);
            gameLives--;
            gameLivesDisplay.innerText = gameLives;
            
            // flash screen red
            gameArea.style.backgroundColor = 'rgba(248, 113, 113, 0.3)';
            setTimeout(() => {
                gameArea.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            }, 150);
            
            if (gameLives <= 0) {
                endGameMode();
                return; 
            }
        }
    }
    
    // Partially typed word highlight
    const val = gameInput.value.trim().toLowerCase();
    fallingWords.forEach(fw => {
        if (val.length > 0 && fw.text.startsWith(val)) {
            fw.element.classList.add('typing');
        } else {
            fw.element.classList.remove('typing');
        }
    });

    // Speed up spawning based on score
    const newSpawnRate = Math.max(800, 2000 - (gameScore * 5));
    if (newSpawnRate < spawnRate) {
        spawnRate = newSpawnRate;
        clearInterval(wordSpawnIntervalId);
        wordSpawnIntervalId = setInterval(spawnWord, spawnRate);
    }
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

gameInput.addEventListener('input', () => {
    if (currentMode !== 'fallingWords') return;
    
    const val = gameInput.value.trim().toLowerCase();
    
    const matchIndex = fallingWords.findIndex(fw => fw.text === val);
    if (matchIndex !== -1) {
        // Explode animation effect
        const matchedElement = fallingWords[matchIndex].element;
        matchedElement.style.transform = 'scale(1.5)';
        matchedElement.style.opacity = '0';
        
        setTimeout(() => {
            matchedElement.remove();
        }, 150);
        
        fallingWords.splice(matchIndex, 1);
        gameScore += 10;
        gameScoreDisplay.innerText = gameScore;
        gameInput.value = '';
    }
});

function endGameMode() {
    cancelAnimationFrame(gameLoopId);
    clearInterval(wordSpawnIntervalId);
    gameInput.blur();
    
    finalWpm.innerText = gameScore;
    finalAccuracy.innerText = 'Game Over';
    resultsModal.classList.add('show');
}

// Event Listeners
hiddenInput.addEventListener('input', handleTyping);
restartBtn.addEventListener('click', setupMode);
modalRestartBtn.addEventListener('click', setupMode);

typingContainer.addEventListener('click', () => {
    if(currentMode !== 'fallingWords') hiddenInput.focus();
});
gameContainer.addEventListener('click', () => {
    if(currentMode === 'fallingWords') gameInput.focus();
});

document.addEventListener('keydown', (e) => {
    if (currentMode === 'fallingWords') {
        gameInput.focus();
    } else {
        // Prevent auto-focus on refresh/F5 etc.
        if(e.key.length === 1 || e.key === 'Backspace') {
            hiddenInput.focus();
        }
    }
});

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
let isDarkTheme = true;

themeToggleBtn.addEventListener('click', () => {
    const root = document.documentElement;
    isDarkTheme = !isDarkTheme;
    
    if (isDarkTheme) {
        root.style.setProperty('--bg-primary', '#0f172a');
        root.style.setProperty('--bg-secondary', 'rgba(30, 41, 59, 0.7)');
        root.style.setProperty('--text-primary', '#f8fafc');
        root.style.setProperty('--text-secondary', '#94a3b8');
        root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
        document.body.style.backgroundImage = `
            radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%)`;
    } else {
        root.style.setProperty('--bg-primary', '#f8fafc');
        root.style.setProperty('--bg-secondary', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--text-primary', '#0f172a');
        root.style.setProperty('--text-secondary', '#475569');
        root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.1)');
        document.body.style.backgroundImage = `
            radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.2) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.2) 0px, transparent 50%)`;
    }
});

// Start
setupMode();
