// ===== PLAYER DATA MANAGEMENT =====
function getPlayer() {
    const defaultPlayer = {
        level: 1,
        xp: 0,
        xpForNextLevel: 100,
        gold: 0,
        streak: 0,
        rank: 'E',
        title: 'HUNTER',
        lastActiveDate: new Date().toDateString(),
        createdAt: new Date().toISOString()
    };

    const saved = localStorage.getItem('player');
    return saved ? JSON.parse(saved) : defaultPlayer;
}

function savePlayer(player) {
    localStorage.setItem('player', JSON.stringify(player));
}

function checkLevelUp() {
    const player = getPlayer();
    
    while (player.xp >= player.xpForNextLevel) {
        player.xp -= player.xpForNextLevel;
        player.level += 1;
        player.gold += 100;
        updateRank(player);
        player.xpForNextLevel = 100 + (player.level * 50);
        
        // Trigger level up notification
        showLevelUpAnimation(player);
    }
    
    savePlayer(player);
}

function updateRank(player) {
    const ranks = {
        1: 'E',
        5: 'D',
        10: 'C',
        15: 'B',
        20: 'A',
        30: 'S'
    };

    for (const [level, rank] of Object.entries(ranks)) {
        if (player.level >= parseInt(level)) {
            player.rank = rank;
        }
    }
}

function showLevelUpAnimation(player) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff6b00, #ff8c00);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 24px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 0 30px rgba(255, 107, 0, 0.5);
        animation: levelUpPop 2s ease-out forwards;
    `;
    notification.textContent = `⬆️ LEVEL ${player.level}!`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
}

// ===== INITIALIZATION =====
function initializeGame() {
    const player = getPlayer();
    const today = new Date().toDateString();
    
    // Check if day changed
    if (player.lastActiveDate !== today) {
        player.lastActiveDate = today;
        savePlayer(player);
    }
    
    // Add CSS animation
    if (!document.querySelector('style[data-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-animations', 'true');
        style.textContent = `
            @keyframes levelUpPop {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.2);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -80%) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

// ===== UTILS =====
function generateId() {
    return Date.now();
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
