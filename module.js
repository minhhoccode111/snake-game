const grid = (() => {
  const GRID_SIZE = 21;
  const randomGridPosition = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE) + 1,
      y: Math.floor(Math.random() * GRID_SIZE) + 1,
    };
  };
  const outsideGrid = (position) => {
    return (
      position.x < 1 ||
      position.x > GRID_SIZE ||
      position.y < 1 ||
      position.y > GRID_SIZE
    );
  };
  return {
    randomGridPosition,
    outsideGrid,
  };
})();

const input = (() => {
  let inputDirection = { x: 0, y: 0 };
  let lastInputDirection = { x: 0, y: 0 };
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        if (lastInputDirection.y !== 0) break;
        inputDirection = { x: 0, y: -1 };
        break;
      case "s":
        if (lastInputDirection.y !== 0) break;
        inputDirection = { x: 0, y: 1 };
        break;
      case "a":
        if (lastInputDirection.x !== 0) break;
        inputDirection = { x: -1, y: 0 };
        break;
      case "d":
        if (lastInputDirection.x !== 0) break;
        inputDirection = { x: 1, y: 0 };
        break;
    }
  });
  const getInputDirection = () => {
    lastInputDirection = inputDirection;
    return inputDirection;
  };
  return { getInputDirection };
})();

const snake = (() => {
  const SNAKE_SPEED = 15;
  const snakeBody = [{ x: 11, y: 11 }];
  let newSegments = 0;
  const addSegments = () => {
    for (let i = 0; i < newSegments; i++) {
      snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
    }
    newSegments = 0;
  };
  const update = () => {
    addSegments();
    const inputDirection = input.getInputDirection();
    for (let i = snakeBody.length - 2; i >= 0; i--) {
      snakeBody[i + 1] = { ...snakeBody[i] };
    }
    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
  };
  const draw = (gameBoard) => {
    snakeBody.forEach((segment) => {
      const snakeElement = document.createElement("div");
      snakeElement.style.gridRowStart = segment.y;
      snakeElement.style.gridColumnStart = segment.x;
      snakeElement.classList.add("snake");
      gameBoard.appendChild(snakeElement);
    });
  };
  const expandSnake = (amount) => {
    newSegments += amount;
  };
  const equalPositions = (pos1, pos2) => {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  };
  const onSnake = (position, { ignoreHead = false } = {}) => {
    return snakeBody.some((segment, index) => {
      if (ignoreHead && index === 0) return false;
      return equalPositions(segment, position);
    });
  };
  const getSnakeHead = () => snakeBody[0];
  const snakeIntersection = () => onSnake(snakeBody[0], { ignoreHead: true });
  return {
    SNAKE_SPEED,
    update,
    draw,
    expandSnake,
    onSnake,
    getSnakeHead,
    snakeIntersection,
  };
})();

const food = (() => {
  const getRandomFoodPosition = () => {
    let newFoodPosition;
    while (newFoodPosition == null || snake.onSnake(newFoodPosition)) {
      newFoodPosition = grid.randomGridPosition();
    }
    return newFoodPosition;
  };
  let food = getRandomFoodPosition();
  const EXPANSION_RATE = 1;
  const update = () => {
    if (snake.onSnake(food)) {
      snake.expandSnake(EXPANSION_RATE);
      food = getRandomFoodPosition();
    }
  };
  const draw = (gameBoard) => {
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
  };
  return {
    update,
    draw,
  };
})();

const game = (() => {
  let lastRenderTime = 0;
  let gameOver = 0;
  const gameBoard = document.getElementById("game-board");
  const checkDeath = () => {
    gameOver =
      grid.outsideGrid(snake.getSnakeHead()) || snake.snakeIntersection();
  };
  const update = () => {
    snake.update();
    food.update();
    checkDeath();
  };
  const draw = () => {
    gameBoard.innerHTML = "";
    snake.draw(gameBoard);
    food.draw(gameBoard);
  };
  const main = (currentTime) => {
    if (gameOver) {
      if (confirm("Game Over! Restart?")) {
        window.location = "/";
      }
      return;
    }
    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / snake.SNAKE_SPEED) return;
    lastRenderTime = currentTime;
    update();
    draw();
  };
  window.requestAnimationFrame(main);
})();
