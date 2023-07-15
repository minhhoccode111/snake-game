const board = document.getElementById('game-board');

const Cell = (xAxis, yAxis, type) => {
  let x = xAxis;
  let y = yAxis;

  const getX = () => x;
  const getY = () => y;

  const div = document.createElement('div');
  div.className = type; // snake or food
  div.style.gridColumnStart = `${x}`;
  div.style.gridColumnEnd = `${x + 1}`;
  div.style.gridRowStart = `${y}`;
  div.style.gridRowEnd = `${y + 1}`;
  board.appendChild(div);

  const change = (newX, newY) => {
    x = newX;
    y = newY;
    div.style.gridColumnStart = `${x}`;
    div.style.gridColumnEnd = `${x + 1}`;
    div.style.gridRowStart = `${y}`;
    div.style.gridRowEnd = `${y + 1}`;
    // div.style.gridArea = `${x}/${y}/${x + 1}/${y + 1}`;
  };

  return {
    getX,
    getY,
    change,
  };
};

const grid = (() => {
  let size = 21;

  const getSize = () => size;

  const setSize = (v) => (size = v);

  const checkOutside = (obj) => {
    return obj.getX() > size || obj.getY() > size || obj.getX() < 1 || obj.getY() < 1;
  };

  const randomPosition = () => ({
    x: Math.floor(Math.random() * size) + 1,
    y: Math.floor(Math.random() * size) + 1,
  });

  const display = () => {
    board.style.gridTemplate = `repeat(${size},1fr)/repeat(${size},1fr)`;
  };

  return {
    getSize,
    setSize,
    display,
    checkOutside,
    randomPosition,
  };
})();

const snake = (() => {
  let speed = 750; // ms refresh frame
  let speedExtra = 5; // 1000ms - 5ms each time snake eat
  let growRate = 1; // + 1 Cell each time snake eat
  let cellsToGrow = 0; //while this === 0, the snake can move, while this !== 0, the snake grows instead of moving and each time the snake grow cellsToGrow--
  // when the snake eat something, cellsToGrow += growRate

  let direction = { x: 1, y: 0 }; // init move right

  const getSpeed = () => speed;

  const getDirection = () => direction;

  const setDirection = (obj) => {
    direction.x = obj.x;
    direction.y = obj.y;
  };

  const grow = () => (cellsToGrow += growRate);

  // movable direction is not current direction and not opposite to current direction
  const movableDirection = (obj) => {
    // if current direction is left or right {x:-1,y:0}, {x:1,y:0}
    // then movable direction must me up or down {x:0,y:1}, {x:0,y:-1}
    if (direction.x !== 0 && obj.x === 0) return true;
    // vice versa
    if (direction.y !== 0 && obj.y === 0) return true;
    // else it's falsy
    return false;
  };

  const body = [Cell(10, 10, 'snake'), Cell(9, 10, 'snake'), Cell(8, 10, 'snake'), Cell(7, 10, 'snake'), Cell(6, 10, 'snake')];

  // to check if its head is on body (or food)
  const isOnBody = (obj) => {
    return body.some((current, index) => {
      // start from index 1 because we already have isOnHead
      if (index === 0) return;
      return obj.getX() === current.getX() && obj.getY() === current.getY();
    });
  };

  const getHead = () => body[0];

  const isOnHead = (obj) => getHead().getX() === obj.getX() && getHead().getY() === obj.getY();

  const move = () => {
    // move it ahead of snake's head base on current direction to make it moving
    const aheadX = getHead().getX() + direction.x;
    const aheadY = getHead().getY() + direction.y;
    //if we have cells to grow then we grow before moving
    if (cellsToGrow > 0) {
      const newCell = Cell(aheadX, aheadY, 'snake');
      body.unshift(newCell);
      cellsToGrow--;
      return;
    }
    // take last cell
    const last = body.pop();
    // change cell's position
    last.change(aheadX, aheadY);
    // make last cell to be first cell in body array
    body.unshift(last);
  };

  return {
    move,
    grow,
    getHead,
    isOnHead,
    isOnBody,
    getSpeed,
    getDirection,
    setDirection,
    movableDirection,
  };
})();

const food = (() => {
  let position = Cell(15, 15, 'food');

  const change = () => {
    //TODO FIXME implement spawn food
  };

  const getPosition = () => position;

  return {
    getPosition,
    change,
  };
})();

const game = (() => {
  const start = () => {
    const moving = setInterval(snakeMove, snake.getSpeed());

    function snakeMove() {
      snake.move();
      // check game ended
      if (grid.checkOutside(snake.getHead()) || snake.isOnBody(snake.getHead())) {
        clearInterval(moving);
        if (window.confirm('Play again?')) {
          window.location.href = '/';
        }
      }
      // check snake eat food
      if (snake.isOnHead(food.getPosition())) {
        snake.grow();
      }
    }
  };

  return { start };
})();

const listener = (() => {
  const letters = {
    ArrowUp: { x: 0, y: -1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowDown: { x: 0, y: 1 },
    ArrowRight: { x: 1, y: 0 },
  };

  window.addEventListener('keyup', (e) => {
    if (letters.hasOwnProperty(e.key)) {
      if (snake.movableDirection(letters[e.key])) {
        snake.setDirection(letters[e.key]);
      }
    }
  });

  window.addEventListener('DOMContentLoaded', (e) => {
    grid.display();
    game.start();
  });
})();
