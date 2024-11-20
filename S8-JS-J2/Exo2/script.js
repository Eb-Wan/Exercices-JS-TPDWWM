let htmlBody = document.querySelector("body");

const newTitle = document.createElement("h1");
newTitle.innerText = "Super Titre";
newTitle.style.fontSize = "24px";
newTitle.style.color = "red";
newTitle.style.fontWeight = "bold";

const newParagraph1 = document.createElement("p");
newParagraph1.innerText = "Mon premier paragraphe.";
const newParagraph2 = document.createElement("p");
newParagraph2.innerText = "Mon second paragraphe.";

const newDiv = document.createElement("div");
newDiv.appendChild(newParagraph1);
newDiv.appendChild(newParagraph2);

htmlBody.appendChild(newTitle);
htmlBody.appendChild(newDiv);

let modifiedParagraph = document.querySelector("body p:nth-child(1)");
modifiedParagraph.innerText += " C'est le plus long.";