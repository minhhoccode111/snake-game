// console.log('Hello, World! From app.js');

const board = document.getElementById('game-board');

const Cell = (x, y, type) => {
  const div = document.createElement('div');
  div.className = type; // snake or food
  div.style.gridArea = `${x}/${y}/${x + 1}/${y + 1}`;
  board.appendChild(div);

  const change = (newX, newY) => {
    x = newX;
    y = newY;
    div.style.gridArea = `${x}/${y}/${x + 1}/${y + 1}`;
  };

  return {
    x,
    y,
  };
};

// const display = (() => {
//   const food = (f) => {};
//   const snake = (s) => {};

//   return {
//     food,
//     snake,
//   };
// })();

const grid = (() => {
  let size = 21;

  const getSize = () => size;

  const setSize = (v) => (size = v);

  const checkOutside = (obj) => {
    return obj.x > size || obj.y > size || obj.x < 1 || obj.y < 1;
  };

  const randomPosition = () => ({
    x: Math.floor(Math.random() * size) + 1,
    y: Math.floor(Math.random() * size) + 1,
  });

  return {
    getSize,
    setSize,
    checkOutside,
    randomPosition,
  };
})();

const snake = (() => {
  let speed = 1000; // ms refresh frame
  let speedExtra = 5; // 1000ms - 5ms each time snake eat
  let growRate = 1; // + 1 Cell each time snake eat
  let cellsToGrow = 0; //while this === 0, the snake can move, while this !== 0, the snake grows instead of moving and each time the snake grow cellsToGrow--
  // when the snake eat something, cellsToGrow += growRate

  let direction = { x: 1, y: 0 };

  const getDirection = () => direction;

  const setDirection = (obj) => {
    direction.x = obj.x;
    direction.y = obj.y;
  };

  // movable direction is not current direction and not opposite to current direction
  const movableDirection = (obj) => {
    if (obj.x === direction.x && obj.y !== direction.y) return true;
    if (obj.y === direction.y && obj.x !== direction.x) return true;
    return false;
  };

  const body = [Cell(10, 10, 'snake'), Cell(10, 9, 'snake'), Cell(10, 8, 'snake')];

  const isOnBody = (obj) => {};

  const getHead = () => body[0];

  const isOnHead = (obj) => getHead().x === obj.x && getHead().y === obj.y;

  return {
    getHead,
    isOnHead,
    isOnBody,
    getDirection,
    setDirection,
    movableDirection,
  };
})();

const food = (() => {
  let position = Cell(15, 15, 'food');

  const change = (obj) => {
    position.change(obj.x, obj.y);
  };

  return {
    change,
  };
})();

const game = (() => {})();

const listener = (() => {
  const letters = {
    ArrowUp: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowDown: { x: 0, y: -1 },
    ArrowRight: { x: 1, y: 0 },
  };

  window.addEventListener('keyup', (e) => {});

  window.addEventListener('DOMContentLoaded', (e) => {
    board.style.gridTemplate = `repeat(${grid.getSize()},1fr)/repeat(${grid.getSize()},1fr)`;
  });
})();
