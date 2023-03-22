// getPD = function getCurrentPartDirection() {
//   //method to get current head direction
//   return this.#currentDirection;
// };
// setPD = function setCurrentPartDirection(newD) {
//   //method to set current head direction, it takes 1 argument
//   this.#currentDirection = newD;
//   //takes 1 argument and assign it to #currentDirection property
//   //this.#changedDirection note down a list of each time snake's head changed direction
//   this.#changedDirection.unshift({
//     //then we will add an object from the beginning of #changedDirection array
//     d: this.#currentDirection,
//     //object has a d: property to mark direction that head changed
//     ...this.#partPosition,
//     //and has x: and y: to mark position when head changed direction
//   });
//   if (this.#changedDirection.length > this.#length) {
//     //if changedDirection history length greater than the snake's length
//     this.#changedDirection.pop();
//     //then we remove changedDirection last mark
//   }
//   return this;
//   //return this to chain methods
// };

// spawnPart() {
//   const sqr = document.querySelector(
//     `[data-x='${this.#partPosition["x"]}'][data-y='${
//       this.#partPosition["y"]
//     }']`
//     //select a square (default is x:10, y;10)
//   );
//   sqr.style.backgroundColor = this.#color;
//   //and make that a part by giving it a red background color
//   return this;
// }
// updateBody() {}
// getPP = function getPartPosition() {
//   return this.#partPosition;
// };
// setPP = function setPartPosition(newPosition) {
//   this.#partPosition = newPosition;
//   return this;
// };
// move = function moveAlongWithPartDirection() {
//   const thisCD = this.getPD();
//   if (thisCD === "ArrowUp") {
//     while (this.#changedDirection) {
//       console.log("Moving up");
//     }
//   }
//   if (thisCD === "ArrowDown") {
//     console.log("Moving down");
//   }
//   if (thisCD === "ArrowLeft") {
//     console.log("Moving left");
//   }
//   if (thisCD === "ArrowRight") {
//     console.log("Moving right");
//   }
//   return this;
// };
