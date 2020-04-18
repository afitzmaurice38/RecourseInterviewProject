/* Types */
interface spaces {
  [key: string]: string | null;
}

/*********Game Logic************/

//Inital Scores
document.getElementById("player1")!.innerHTML = `<h1>Player X Wins: 0`;
document.getElementById("player2")!.innerHTML = `<h1>Player O Wins: 0`;

//Listener Function
const action = (e: Event) => gameController.makeMove(e);

//Enables and Disable game board
const playable = (function initalizer(action) {
  const options: HTMLElement[] = [
    document.getElementById("one")!,
    document.getElementById("two")!,
    document.getElementById("three")!,
    document.getElementById("four")!,
    document.getElementById("five")!,
    document.getElementById("six")!,
    document.getElementById("seven")!,
    document.getElementById("eight")!,
    document.getElementById("nine")!,
  ];

  function setUpClickListeners(options: HTMLElement[]) {
    for (let option of options) {
      option.addEventListener("click", action);
    }
  }

  function removeClickListeners(options: HTMLElement[]) {
    for (let option of options) {
      option.removeEventListener("click", action);
    }
  }

  function resetInnerHTML(options: HTMLElement[]) {
    for (let option of options) {
      option.innerHTML = "";
    }
  }

  return {
    enable: () => setUpClickListeners(options),
    disable: () => removeClickListeners(options),
    clearBoard: () => resetInnerHTML(options),
  };
})(action);

//Mediates the game.
const gameController = (function controller(playable) {
  const scores = {
    X: 0,
    O: 0,
  };
  let spaces: spaces = {
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    six: null,
    seven: null,
    eight: null,
    nine: null,
  };

  let xTurn = true; // always starts with X being first. When false "O" will be placed on click

  function spaceOpen(
    spaceClicked: string,
    xTurn: boolean,
    currentSpaceState = { ...spaces }
  ): boolean | spaces {
    if (currentSpaceState[spaceClicked] === null) {
      console.log(spaceClicked, xTurn);
      currentSpaceState[spaceClicked] = xTurn ? "X" : "O";
      return currentSpaceState;
    }
    return false;
  }

  function winCheck() {
    const combos = [
      [spaces.one, spaces.two, spaces.three],
      [spaces.one, spaces.four, spaces.seven],
      [spaces.one, spaces.five, spaces.nine],
      [spaces.two, spaces.five, spaces.eight],
      [spaces.three, spaces.six, spaces.nine],
      [spaces.four, spaces.five, spaces.six],
      [spaces.seven, spaces.eight, spaces.nine],
      [spaces.three, spaces.five, spaces.seven],
    ];

    for (let winCombo of combos) {
      //check if all are not null and they are all the same.
      if (
        winCombo[0] &&
        winCombo[1] &&
        winCombo[2] &&
        winCombo[0] === winCombo[1] &&
        winCombo[1] === winCombo[2]
      ) {
        return winCombo[0];
      }
    }
    return false;
  }

  return {
    makeMove: function makeMove(e: Event) {
      const clickedSpaceId = (<HTMLDivElement>e.target).id;
      const move = spaceOpen(clickedSpaceId, xTurn);

      //Move is an object when a space is updated from 'null' to 'X' or 'O'
      if (typeof move === "object") {
        document.querySelector(`#${clickedSpaceId}`)!.innerHTML = xTurn
          ? "<div><h1>X</h1></div>"
          : "<div><h1>O</h1><div>";
        xTurn = !xTurn; // Switch turns
        spaces = move;

        //Check for winning combo
        const winner = winCheck(); //String "X", "O", or false
        if (winner) {
          playable.disable();
          if (winner === "X") {
            scores.X += 1;
            document.getElementById(
              "player1"
            )!.innerHTML = `<h1>Player X Wins: ${scores.X}`;
          } else {
            scores.O += 1;
            document.getElementById(
              "player2"
            )!.innerHTML = `<h1>Player O Wins: ${scores.O}`;
          }

          // Display Modal
          const backdrop = document.createElement("div");
          const modal = document.createElement("div");
          modal.setAttribute("id", "modal");
          backdrop.setAttribute("id", "backdrop");
          modal.innerHTML = `<h1>Player ${winner} Wins!</h1>
                    <h3>Would you like to play again?</h3>
                   <button id="playagain"><span>Yes</span></button>`;
          backdrop.appendChild(modal);
          let target = document.getElementById("root");
          document.getElementById("positioner")!.insertBefore(backdrop, target);
          document
            .getElementById("playagain")!
            .addEventListener("click", this.resetGame.bind(this));
        }
      } else {
        console.log("try again");
      }
    },
    resetGame: function resetGame() {
      const modal = document.getElementById("backdrop");
      spaces = {
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        seven: null,
        eight: null,
        nine: null,
      };

      if (modal) {
        document.getElementById("positioner")!.removeChild(modal);
        playable.clearBoard();
        playable.enable();
      }
    },
  };
})(playable);

playable.enable();
