const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const box = 20; // Snake unit size
const canvasSize = canvas.width;
const snake = [{ x: 10 * box, y: 10 * box }];
let food = generateFood();
let direction = "RIGHT";
let score = 0;

// Generate random food position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box,
        color: `hsl(${Math.random() * 360}, 100%, 50%)` // Random color
    };
}

// Control snake movement
document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Game loop
function gameLoop() {
    // Move the snake
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    // Check collision with walls
    if (headX < 0 || headY < 0 || headX >= canvasSize || headY >= canvasSize) {
        //alert("Game Over! Your score: " + score);
        document.getElementById("#scoreBoard").innerHTML = "Game Over! Your score: " + score;
        await(10000);
        document.location.reload();
    }

    // Check collision with self
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === headX && snake[i].y === headY) {
            //alert("Game Over! Your score: " + score);
            document.getElementById("#scoreBoard").innerHTML = "Game Over! Your score: " + score;
            await(10000);
            document.location.reload();
        }
    }

    // Check if snake eats food
    if (headX === food.x && headY === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop(); // Remove last tail segment
    }

    // Add new head to the snake
    snake.unshift({ x: headX, y: headY });

    // Render the game
    drawGame();
}

// Draw everything
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake with colorful segments
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = `hsl(${(i * 30) % 360}, 100%, 50%)`;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
}



// Start the game loop
setInterval(gameLoop, 100);