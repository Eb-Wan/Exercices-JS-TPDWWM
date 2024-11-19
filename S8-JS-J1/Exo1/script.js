let RedTextButton = document.querySelector("#RedTextButton");
let BlueTextButton = document.querySelector("#BlueTextButton");
let ResetButton = document.querySelector("#ResetButton");
let Paragraph = document.querySelector("p");

RedTextButton.onclick = () => (Paragraph.style.color = "red");
BlueTextButton.onclick = () => (Paragraph.style.color = "blue");
ResetButton.onclick = () => (Paragraph.style.color = "black");