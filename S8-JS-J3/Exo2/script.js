let playField = [];
let nextPlayer = (Math.random()<0.5)? "O" : "X";
const crossIcon = '<img class="icon X" src="./Icons/x.svg" alt="X">';
const circleIcon = '<img class="icon O" src="./Icons/circle.svg" alt="O">';
const winningPosibilities = "012"+"345"+"678"+"036"+"147"+"258"+"048"+"246";
const h2Title =  document.querySelector("h2");
const resetButton = document.createElement("button");
resetButton.textContent = "Reset Game";
resetButton.addEventListener("click", () => location.reload());
let gameEnded = false;
let turnsPlayed = 0;

h2Title.textContent = `${nextPlayer} is the first player. Mind blowing isn't it?`;

function CheckLine(player) {
    let lineLength = 0;
    for (let i=0; i<winningPosibilities.length; i++) {
        if (i%3 === 0) lineLength = 0;
        if (playField[winningPosibilities[i]]==player) lineLength++;
        if (lineLength === 3) Win(player, i);
    }
}
function Win (player, winningLine) {
    gameEnded = true;
    h2Title.textContent = `${player} player won!`;
    h2Title.style.color = "green";
    h2Title.append(resetButton);
    cells[winningPosibilities[winningLine-2]].id="Green";
    cells[winningPosibilities[winningLine-1]].id="Green";
    cells[winningPosibilities[winningLine]].id="Green";
}
function Tie () {
    gameEnded = true;
    h2Title.textContent = "Tie !";
    h2Title.style.color = "red";
    h2Title.append(resetButton);
}
function BoxClick (event) {
    event.target.removeEventListener("click", BoxClick);
    if (gameEnded) return;
    if (turnsPlayed === 8) Tie();
    else turnsPlayed++;
    playField[event.target.id] = nextPlayer;
    CheckLine(nextPlayer);
    event.target.innerHTML = (nextPlayer == "O") ? circleIcon : crossIcon;
    nextPlayer = (nextPlayer == "X") ? "O" : "X";
}
const cells = document.querySelectorAll(".ticTacToeCell");
for(let i = 0; i < cells.length; i++) {cells[i].addEventListener("click", BoxClick);}

// function CheckLine(player) {
//     let check = 0;
//     for (let i=0; i<3; i++) {
//         if (playField[i*4] == player) check++;
//         if (check == 3) Win (player);
//     }
//     if (check == 3) Win (player);

//     check = 0;
//     for (let i=0; i<3; i++) {
//         if (playField[6-(i*2)] == player) check++;
//     }
//     if (check == 3) Win (player);

//     for (let i=0; i<3; i++) {
//         check = 0;
//         for (let j=0; j<3; j++) {
//             if (playField[(3*i)+j] == player) check++;
//         }
//         if (check == 3) Win (player);
//     }

//     for (let i=0; i<3; i++) {
//         check = 0;
//         for (let j=0; j<3; j++) {
//             if (playField[(3*j)+i] == player) check++;
//         }
//         if (check == 3) Win (player);
//     }
// }