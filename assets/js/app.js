"use strict";
console.log("Hello world from snake game");

const header = document.querySelector("#header");
const pg = document.querySelector("#playground"); //pg stand for playground
const scoreP1 = document.querySelector(".scoreP1");
class App {
  constructor(point = 0, player = 1, pgSize = 20) {
    this.point = point; //default app initialize has 0 point
    this.player = player; //default app initialize has 1 player
    this.pgSize = pgSize; //default app initialize has 20 squares each row
  }
  static getRandomPosition(n = 20) {
    return Math.floor(Math.random() * n) + 1;
  }
  getSize() {
    return this.pgSize;
  }
  setGridTemplate() {
    pg.style.cssText = `display:grid;
                grid-template-columns: repeat(${this.pgSize},1fr);
                grid-template-rows: repeat(${this.pgSize},1fr);`;
    this.createGridDivs();
    return this;
  }
  createGridDivs() {
    let x = 1; //x stand for row position inside playground
    let y = 1; //y stand for column position inside playground
    for (let i = 1; i <= this.pgSize ** 2; i++) {
      //for let i in the range of 20*20 pgSize
      const div = document.createElement("div");
      //create a div
      if (x > this.pgSize) {
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
  }
  displayScore() {
    scoreP1.innerHTML = this.point;
    //show scoreP1 innerHTML = this.point
  }
  increaseScore() {
    this.point++;
    this.displayScore();
    return this;
  }
}

class Snake {
  constructor(
    headDirection = "ArrowLeft",
    tailDirection = "ArrowLeft",
    headPosition = { x: 10, y: 10 },
    tailPosition = { x: 14, y: 10 },
    body = [
      { x: 11, y: 10 },
      { x: 12, y: 10 },
      { x: 13, y: 10 },
    ],
    speed = 10,
    color = "red",
    changedDirection = [],
    moveKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
  ) {
    this.hD = headDirection;
    this.tD = tailDirection;
    this.hP = headPosition;
    this.tP = tailPosition;
    this.body = [headPosition, ...body, tailPosition];
    this.speed = 510 - speed;
    this.color = color;
    this.cD = changedDirection;
    this.moveKeys = moveKeys;
  }
  createSnakeBody() {
    this.body.forEach((el) => {
      const sqr = document.querySelector(
        `[data-x="${el["x"]}"][data-y="${el["y"]}"]`
      );
      sqr.style.backgroundColor = this.color;
    });
    const head = document.querySelector(
      `[data-x="${this.hP["x"]}"][data-y="${this.hP["y"]}"]`
    );
    const tail = document.querySelector(
      `[data-x="${this.tP["x"]}"][data-y="${this.tP["y"]}"]`
    );
    head.style.backgroundColor = "Chocolate";
    tail.style.backgroundColor = "Brown";
    return this;
  }
  //create a initialize body with 4 parts
  getHeadDirection() {
    return this.hD;
  }
  setHeadDirection(newHeadDirection) {
    this.hD = newHeadDirection;
    return this;
  }
  getHeadPosition() {
    return this.hP;
  }
  setHeadPosition(newHeadPosition) {
    this.hP = newHeadPosition;
  }
  getChangedDirection() {
    return this.changedDirection;
  }
  addChangedDirectionQueue(newDirection) {
    this.changedDirection.unshift({
      //then we will add an object from the beginning of #changedDirection array
      d: this.currentDirection,
      //object has a d: property to mark direction that head changed
      ...this.partPosition,
      //and has x: and y: to mark position when head changed direction
    });
    if (this.changedDirection.length > this.length) {
      //if changedDirection history length greater than the snake's length
      this.changedDirection.pop();
      //then we remove changedDirection last mark
    }
  }
  moveUp() {
    const moveUpInterval = setInterval(() => {
      this.hP = { x: this.hP["x"], y: this.hP["y"] - 1 };
      console.log(this.getHeadPosition()["y"]);
      this.body.pop();
      this.createSnakeBody();
      if (this.getHeadPosition()["y"] <= 1) clearInterval(moveUpInterval);
    }, this.speed);
  }
  moveDown() {
    const moveDownInterval = setInterval(() => {
      this.hP = { x: this.hP["x"], y: this.hP["y"] + 1 };
      console.log(this.getHeadPosition()["y"]);
      this.body.pop();
      this.createSnakeBody();
      if (this.getHeadPosition()["y"] >= 20) clearInterval(moveDownInterval);
    }, this.speed);
  }
  moveLeft() {
    const moveLeftInterval = setInterval(() => {
      this.hP = { x: this.hP["x"] - 1, y: this.hP["y"] };
      console.log(this.getHeadPosition()["x"]);
      this.body.pop();
      this.createSnakeBody();
      if (this.getHeadPosition()["x"] <= 1) clearInterval(moveLeftInterval);
    }, this.speed);
  }
  moveRight() {
    const moveRightInterval = setInterval(() => {
      this.hP = { x: this.hP["x"] + 1, y: this.hP["y"] };
      console.log(this.getHeadPosition()["x"]);
      this.body.pop();
      this.createSnakeBody();
      if (this.getHeadPosition()["x"] >= 20) clearInterval(moveRightInterval);
    }, this.speed);
  }
}
class Food {
  constructor(color = "green") {
    this.color = color;
  }

  appearFood() {}
  disappearFood() {}
}
const app = new App();
const snake = new Snake();
app.setGridTemplate().displayScore();
snake.createSnakeBody().moveLeft();
window.addEventListener("keydown", handleKeyDown);
function handleKeyDown(e) {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const currentD = snake.getHeadDirection();
  if (keys[0] === e.key && e.key != currentD) {
    snake.setHeadDirection(e.key).moveUp();
  }
  if (keys[1] === e.key && e.key != currentD) {
    snake.setHeadDirection(e.key).moveDown();
  }
  if (keys[2] === e.key && e.key != currentD) {
    snake.setHeadDirection(e.key).moveLeft();
  }
  if (keys[3] === e.key && e.key != currentD) {
    snake.setHeadDirection(e.key).moveRight();
  }
}
