
    // Player
export  const player = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        speed: 7,
        isAlive: true
    };

    // Bullets and Enemies
    let bullets = [];
    let enemies = [];
    let score = 0;
    let enemyDirection = 1;
    let enemySpeed = 1;

    // Initialize enemies grid
    for(let i = 0; i < 5; i++) {
        for(let j = 0; j < 8; j++) {
            enemies.push({
                x: 80 + j * 50,
                y: 50 + i * 40,
                width: 20,
                height: 20
            });
        }
    }

    // Keyboard controls
   const keys = {
        ArrowLeft: false,
        ArrowRight: false,
        Space: false
    };

    document.addEventListener('keydown', (e) => {
        if(e.code === 'ArrowLeft') keys.ArrowLeft = true;
        if(e.code === 'ArrowRight') keys.ArrowRight = true;
        if(e.code === 'Space' && !keys.Space) {
            keys.Space = true;
            bullets.push({
                x: player.x,
                y: player.y,
                speed: -8
            });
        }
    });

    document.addEventListener('keyup', (e) => {
        if(e.code === 'ArrowLeft') keys.ArrowLeft = false;
        if(e.code === 'ArrowRight') keys.ArrowRight = false;
        if(e.code === 'Space') keys.Space = false;
    });

  class Game{
    constructor(){
        this.update()
    }
    update() {
        if(!player.isAlive) return;

        // Player movement
        if(keys.ArrowLeft && player.x > 20) player.x -= player.speed;
        if(keys.ArrowRight && player.x < canvas.width - 20) player.x += player.speed;

        // Bullets update
        bullets.forEach((bullet, index) => {
            bullet.y += bullet.speed;
            if(bullet.y < 0) bullets.splice(index, 1);
        });

        // Enemies movement
        let edge = false;
        enemies.forEach(enemy => {
            enemy.x += enemySpeed * enemyDirection;
            if(enemy.x > canvas.width - 20 || enemy.x < 20) edge = true;
        });

        if(edge) {
            enemyDirection *= -1;
            enemies.forEach(enemy => enemy.y += 20);
        }

        // Collision detection
        bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if(bullet.x > enemy.x - 10 && 
                   bullet.x < enemy.x + 10 && 
                   bullet.y > enemy.y - 10 && 
                   bullet.y < enemy.y + 10) {
                    bullets.splice(bIndex, 1);
                    enemies.splice(eIndex, 1);
                    score += 100;
                    scoreElement.textContent = `SCORE: ${score}`;
                }
            });
        });

        // Game over conditions
        enemies.forEach(enemy => {
            if(enemy.y > canvas.height - 50) gameOver();
            if(Math.abs(enemy.x - player.x) < 20 && 
               Math.abs(enemy.y - player.y) < 20) gameOver();
        });
    }
  }
  const newGame = new Game();
    function draw() {
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw player
        ctx.fillStyle = '#0f0';
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x - 15, player.y + 30);
        ctx.lineTo(player.x + 15, player.y + 30);
        ctx.closePath();
        ctx.fill();

        // Draw bullets
        ctx.fillStyle = '#ff0';
        bullets.forEach(bullet => {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw enemies
        ctx.fillStyle = '#f00';
        enemies.forEach(enemy => {
            ctx.beginPath();
            ctx.rect(enemy.x - 10, enemy.y - 10, 20, 20);
            ctx.fill();
        });
    }

    const gameOver = ()=>{
        player.isAlive = false;
        gameOverElement.style.display = 'block';
    }

    const gameLoop = ()=>{
        newGame.update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Start the game
    gameLoop();