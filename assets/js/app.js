"use strict";
console.log("Hello world from snake game");

const header = document.querySelector("#header");
const pg = document.querySelector("#playground"); //pg stand for playground
const scoreP1 = document.querySelector(".scoreP1");
class App {
  #point;
  #player;
  #pgSize;
  constructor(point = 0, player = 1, pgSize = 20) {
    this.#point = point; //default app initialize has 0 point
    this.#player = player; //default app initialize has 1 player
    this.#pgSize = pgSize;
  }

  setGridTemplate() {
    pg.style.cssText = `display:grid;
                grid-template-columns: repeat(${this.#pgSize},1fr);
                grid-template-rows: repeat(${this.#pgSize},1fr);`;
    return this;
  }
  createGridDivs() {
    let x = 1; //x stand for row position inside playground
    let y = 1; //y stand for column position inside playground
    for (let i = 1; i <= this.#pgSize ** 2; i++) {
      //for let i in the range of 20*20 pgSize
      const div = document.createElement("div");
      //create a div
      if (x > this.#pgSize) {
        //if x greater than pgSize
        x = 1;
        //restore x to equal 1
        y++;
        //increase y
      }
      div.setAttribute("data-x", x);
      //set its attribute data-x = x
      div.setAttribute("data-y", y);
      //set its attribute data-y = y
      div.setAttribute("class", "sqr");
      pg.appendChild(div);
      //then append
      x++;
      //increase x
    }
    return this;
    //return this (this object) to easily chain methods
  }
  displayScore() {
    scoreP1.innerHTML = this.#point;
    return this;
  }
  increaseScore() {
    this.#point++;
    return this;
  }
}

class Snake {
  #currentDirection;
  #changedDirection;
  #headPosition;
  #body;
  #length;
  #speed;
  #color;
  #moveKeys;
  constructor(
    currentDirection = "",
    speed = 10,
    body = [0],
    color = "red",
    headPosition = { x: 10, y: 10 },
    moveKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
  ) {
    this.#currentDirection = currentDirection;
    //currentDirection to specify which direction snake's head is moving
    this.#changedDirection = [];
    //mark every time head change direction
    this.#headPosition = headPosition;
    //init head position on board
    this.#body = body;
    // init with [0] and push another 0 every time snake eat food
    this.#length = body.length;
    //length of body
    this.#speed = 110 - speed;
    //we will use setInterval to display snake position after the amount of time
    this.#color = color;
    this.#moveKeys = moveKeys;
  }
  getCD = function getCurrentHeadDirection() {
    //method to get current head direction
    return this.#currentDirection;
  };
  setCD = function setCurrentHeadDirection(newD) {
    //method to set current head direction, it takes 1 argument
    this.#currentDirection = newD;
    //takes 1 argument and assign it to #currentDirection property
    //this.#changedDirection note down a list of each time snake's head changed direction
    this.#changedDirection.unshift({
      //then we will add an object from the beginning of #changedDirection array
      d: this.#currentDirection,
      //object has a d: property to mark direction that head changed
      ...this.#headPosition,
      //and has x: and y: to mark position when head changed direction
    });
    if (this.#changedDirection.length > this.#length) {
      //if changedDirection history length greater than the snake's length
      this.#changedDirection.pop();
      //then we remove changedDirection last mark
    }
    return this;
    //return this to chain methods
  };
  spawnHead() {
    const sqr = document.querySelector(
      `[data-x='${this.#headPosition["x"]}'][data-y='${
        this.#headPosition["y"]
      }']`
      //select a square (default is x:10, y;10)
    );
    sqr.style.backgroundColor = this.#color;
    //and make that a head by giving it a red background color
    return this;
  }
  move = function moveAlongWithHeadDirection() {
    const thisCD = this.getCD();
    this.#moveKeys.forEach((el) => {
      if (el === thisCD) {
        console.log(el);
        console.dir(this.#changedDirection);
      }
    });
    // if (thisCD.includes("Up")) {
    //   console.log("Moving up");
    // }
    // if (thisCD.includes("Down")) {
    //   console.log("Moving down");
    // }
    // if (thisCD.includes("Left")) {
    //   console.log("Moving left");
    // }
    // if (thisCD.includes("Right")) {
    //   console.log("Moving right");
    // }
    return this;
  };
}

const app = new App();
app.setGridTemplate().createGridDivs().displayScore();
const snake = new Snake();
snake.spawnHead();
window.addEventListener("keydown", handleKeyDown);
function handleKeyDown(e) {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const currentD = snake.getCD();
  if (keys.some((el) => el === e.key) && e.key != currentD) {
    snake.setCD(e.key).move();
  }
}
