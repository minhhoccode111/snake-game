// console.log('Hello, World! From app.js');

// const display = (() => {
//   const food = (f) => {};
//   const snake = (s) => {};

//   return {
//     food,
//     snake,
//   };
// })();

// const inputs = (() => {
//   let direction = { x: 0, y: 0 };

//   const letters = {
//     a: { x: -1, y: 0 },
//     s: { x: 0, y: -1 },
//     d: { x: 1, y: 0 },
//     w: { x: 0, y: 1 },
//   };

//   window.addEventListener('keyup', (e) => {
//     if (Object.keys(letters).includes(e.key)) {
//       console.log(direction);
//       direction = letters[e.key];
//     }
//   });
// })();

// const food = (() => {
//   let position = {
//     x: 15,
//     y: 15,
//   };
// })();

// const snake = (() => {
//   let position = [
//     { x: 10, y: 10 },
//     { x: 10, y: 9 },
//     { x: 10, y: 8 },
//   ];

//   const head = () => position[0];

//   return {
//     head,
//   };
// })();

// const grid = (() => {
//   const board = document.getElementById('game-board');
// })();

// const game = (() => {})();

(() => {
  const board = document.getElementById('game-board');
  let direction = {
    x: 1,
    y: 0,
  };

  let lastDirection;

  const getDirection = () => direction;

  let gameEnd = false;
  let position = [
    { x: 4, y: 9 },
    { x: 4, y: 8 },
    { x: 4, y: 7 },
  ];
  const div = document.createElement('div');
  div.className = 'snake';

  div.style.gridArea = `${position.y}/${position.x}/${position.y + 1}/${position.x + 1}`;

  board.appendChild(div);

  const move = () => {
    let d = getDirection();
    position.x += d.x;
    position.y += d.y;

    if (position.x > 21 || position.x < 1 || position.y < 1 || position.x > 21) {
      gameEnd = true;
    }

    if (gameEnd) {
      alert(`You've lost!`);
      return;
    }

    div.style.gridArea = `${position.y}/${position.x}/${position.y + 1}/${position.x + 1}`;

    setTimeout(() => {
      move();
    }, 300);
  };

  move();

  const letters = {
    a: { x: -1, y: 0 },
    s: { x: 0, y: 1 },
    d: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
  };
  window.addEventListener('keyup', (e) => {
    if (letters.hasOwnProperty(e.key)) {
      if (direction === letters[e.key]) return; //ignore if we're going that direction

      lastDirection = direction;

      direction = letters[e.key];
      return;
    }
  });
})();
