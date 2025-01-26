export class Game{
    constructor(){
        this.update()
    }
 update(){
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


