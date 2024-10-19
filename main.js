let recentGames = [];
const maxRecentGames = 5;

function navigateTo(page) {
    const content = document.getElementById('content');
    if (page === 'home') {
        content.innerHTML = '<h2>Recently Played Games</h2>';
        if (recentGames.length === 0) {
            content.innerHTML += '<p>No games played recently.</p>';
        } else {
            content.innerHTML += '<ul>' + recentGames.map(game => 
                `<li><button onclick="launchGame('${game}')">${game}</button></li>`
            ).join('') + '</ul>';
        }
    } else if (page === 'library') {
        content.innerHTML = `
            <h2>Game Library</h2>
            <div>
                <button onclick="launchGame('games/game1/index.html')">Play Game 1</button>
                <button onclick="launchGame('games/game2/index.html')">Play Game 2</button>
                <button onclick="launchGame('games/game3/index.html')">Play Game 3</button>
            </div>`;
    } else if (page === 'settings') {
        content.innerHTML = `
            <h2>Fjordr Player Settings</h2>
            <div>
                <label>
                    <input type="checkbox" id="fullscreenToggle" onchange="setFullscreenByDefault(this.checked)">
                    Enable Fullscreen by Default
                </label>
            </div>
            <div>
                <label for="customMessageInput">Custom Message:</label>
                <input type="text" id="customMessageInput">
                <button onclick="sendCustomMessage()">Send</button>
            </div>`;
    }
}

function launchGame(gameUrl) {
    document.getElementById('fjordr-player').classList.remove('hidden');
    document.getElementById('loading-screen').style.display = 'flex';
    document.getElementById('game-frame').src = gameUrl;

    // Add to recent games
    addRecentGame(gameUrl);
}

function addRecentGame(gameUrl) {
    // Prevent duplicates
    recentGames = recentGames.filter(game => game !== gameUrl);
    // Add to the beginning of the array
    recentGames.unshift(gameUrl);
    // Limit to maxRecentGames
    if (recentGames.length > maxRecentGames) {
        recentGames.pop();
    }
}

function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
}

function pauseGame() {
    sendMessageToGame('pause');
}

function restartGame() {
    const gameFrame = document.getElementById('game-frame');
    gameFrame.contentWindow.location.reload();
}

function toggleFullscreen() {
    const player = document.getElementById('fjordr-player');
    if (!document.fullscreenElement) {
        player.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

function exitPlayer() {
    document.getElementById('fjordr-player').classList.add('hidden');
    document.getElementById('game-frame').src = '';
}

/* Fjordr Player Settings */
function setFullscreenByDefault(enabled) {
    localStorage.setItem('fullscreenByDefault', enabled);
}

function getFullscreenByDefault() {
    return localStorage.getItem('fullscreenByDefault') === 'true';
}

/* Custom Messaging Support */
function sendMessageToGame(messageType, data = {}) {
    const gameFrame = document.getElementById('game-frame').contentWindow;
    gameFrame.postMessage({ type: messageType, payload: data }, '*');
}

// Example usage for sending custom messages
function sendCustomMessage() {
    const messageType = 'custom-event';
    const messageData = {
        action: 'someAction',
        value: document.getElementById('customMessageInput').value
    };
    sendMessageToGame(messageType, messageData);
}

// Load the default content
navigateTo('home');
