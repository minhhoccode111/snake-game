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
    // make it clarify instead of css shorthand
    div.style.gridColumnStart = `${x}`;
    div.style.gridColumnEnd = `${x + 1}`;
    div.style.gridRowStart = `${y}`;
    div.style.gridRowEnd = `${y + 1}`;
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
  let speed = 100; // ms refresh frame
  let speedExtra = 245; // 750ms - 25ms each time snake eat
  let growRate = 2; // + 1 Cell each time snake eat
  let cellsToGrow = 0; //while this === 0, the snake can move, while this !== 0, the snake grows instead of moving (but grow ahead of snake's head so it still look like moving) and each time the snake grow cellsToGrow--

  let direction = { x: 1, y: 0 }; // init move right

  const getSpeed = () => speed;

  const getDirection = () => direction;

  const setDirection = ({ x, y }) => {
    direction.x = x;
    direction.y = y;
  };

  // grow is call after snake ate food
  const grow = () => {
    cellsToGrow += growRate; // + cells
    speed -= speedExtra; // - refresh rate
  };

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

  // init body
  const body = [Cell(10, 10, 'snake'), Cell(9, 10, 'snake'), Cell(8, 10, 'snake'), Cell(7, 10, 'snake'), Cell(6, 10, 'snake')];

  // to check if its head is on body (or food)
  const isOnBody = (obj) => {
    // start from index 1 because we already have isOnHead
    return body.slice(1).some((current, index) => {
      // we'll check on body with snake's head (which is a cell)
      // or with food (so that we don't respawn food on snake's body, and food is a cell too)
      // 'cause the are both cells so we use getX() and getY()
      return obj.getX() === current.getX() && obj.getY() === current.getY();
    });
  };

  const getHead = () => body[0];

  // is used to check if food (which is a cell) is on head
  const isOnHead = (obj) => getHead().getX() === obj.getX() && getHead().getY() === obj.getY();

  const move = () => {
    // move its tail ahead of snake's head base on current direction to make it moving
    const aheadX = getHead().getX() + direction.x;
    const aheadY = getHead().getY() + direction.y;
    //if we have cells to grow then we grow before moving
    if (cellsToGrow > 0) {
      const newCell = Cell(aheadX, aheadY, 'snake');
      body.unshift(newCell);
      cellsToGrow--;
      return;
    }
    // else we take last cell
    const last = body.pop();
    // change last cell's position to be ahead of snake's head
    last.change(aheadX, aheadY);
    // make last cell to be the front
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
  const position = Cell(15, 15, 'food');

  const change = () => {
    // use grid method to get random position
    let random = grid.randomPosition();

    // change food position to that random spot
    position.change(random.x, random.y);

    // while (if) new position isOnHead or isOnBody of snake
    while (snake.isOnHead(position) || snake.isOnBody(position)) {
      // do it again
      random = grid.randomPosition();
      position.change(random.x, random.y);
    }
  };

  const getPosition = () => position;

  return {
    getPosition,
    change,
  };
})();

const game = (() => {
  const start = () => {
    // game start then snake start moving
    const moving = setInterval(snakeMove, snake.getSpeed());

    function snakeMove() {
      snake.move();
      // check game ended when snake's head outside of grid
      // or snake's head is on its body
      if (grid.checkOutside(snake.getHead()) || snake.isOnBody(snake.getHead())) {
        // then clear interval
        clearInterval(moving);
        // ask to play again
        if (window.confirm('Play again?')) {
          // if yes then reload
          window.location.href = '/';
        }
      }
      // check if snake eat food
      if (snake.isOnHead(food.getPosition())) {
        // then snake grow
        snake.grow();
        // spawn food on new position
        food.change();
      }
    }
  };

  return { start };
})();

// event listeners
(() => {
  const letters = {
    ArrowUp: { x: 0, y: -1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowDown: { x: 0, y: 1 },
    ArrowRight: { x: 1, y: 0 },
  };

  window.addEventListener('keyup', (e) => {
    // check if right keys is pressed
    if (letters.hasOwnProperty(e.key)) {
      // then check if that key is movable direction
      if (snake.movableDirection(letters[e.key])) {
        // then change snake's direction
        snake.setDirection(letters[e.key]);
      }
    }
  });

  window.addEventListener('DOMContentLoaded', (e) => {
    grid.display();
    game.start();
  });
})();
