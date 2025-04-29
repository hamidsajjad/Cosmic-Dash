const player = document.querySelector('.player');
const obstacle = document.querySelector('.obstacle');
const crystal = document.querySelector('.crystal');
const gameContainer = document.querySelector('.game-container');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.querySelector('.game-over');
const startScreen = document.querySelector('.start-screen');

let score = 0;
let isJumping = false;
let isGameOver = false;
let gameSpeed = 5;
let gameInterval;

// Start Game
function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    score = 0;
    isGameOver = false;
    obstacle.style.right = '-100px';
    crystal.style.right = '-100px';
    player.style.bottom = '100px';
    gameInterval = setInterval(updateGame, 20);
}

// Update Game State
function updateGame() {
    if (isGameOver) return;

    // Move Obstacle & Crystal
    const obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
    const crystalRight = parseInt(window.getComputedStyle(crystal).getPropertyValue('right'));

    if (obstacleRight < 1000) {
        obstacle.style.right = (obstacleRight + gameSpeed) + 'px';
    } else {
        obstacle.style.right = '-100px';
        score++;
        scoreElement.textContent = score;
    }

    if (crystalRight < 1000) {
        crystal.style.right = (crystalRight + gameSpeed) + 'px';
    } else {
        crystal.style.right = '-100px';
    }

    // Collision Detection
    const playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue('bottom'));
    const obstacleLeft = 1000 - obstacleRight;

    if (
        obstacleLeft > 0 && obstacleLeft < 80 &&
        playerBottom < 80
    ) {
        endGame();
    }

    // Crystal Collection
    const crystalLeft = 1000 - crystalRight;

    if (
        crystalLeft > 0 && crystalLeft < 80 &&
        playerBottom > 100
    ) {
        crystal.style.right = '-100px';
        score += 5;
        scoreElement.textContent = score;
    }

    // Increase Difficulty
    if (score % 20 === 0) {
        gameSpeed += 0.2;
    }
}

// Jump Mechanic
function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        if (jumpHeight >= 150) {
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                }
                jumpHeight -= 5;
                player.style.bottom = (100 + jumpHeight) + 'px';
            }, 20);
        }
        jumpHeight += 5;
        player.style.bottom = (100 + jumpHeight) + 'px';
    }, 20);
}

// End Game
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    gameOverScreen.style.display = 'block';
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (isGameOver || startScreen.style.display === 'block') {
            startGame();
        } else {
            jump();
        }
    }
});

// Touch Support for Mobile
document.addEventListener('touchstart', () => {
    if (isGameOver || startScreen.style.display === 'block') {
        startGame();
    } else {
        jump();
    }
});
