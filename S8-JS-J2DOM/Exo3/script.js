let htmlBody = document.querySelector("body");

const newTitle = `<h1 style="color: red; font-size: 24px; font-weight: bold;">Super Titre</h1>`;
const newParagraph1 = "<p>Mon premier paragraphe.</p>";
const newParagraph2 = "<p>Mon second paragraphe.</p>";
const newDiv = `<div>${newParagraph1}${newParagraph2}</div>`;

htmlBody.innerHTML = `${newTitle}${newDiv}`;