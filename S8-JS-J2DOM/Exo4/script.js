const inputField = document.getElementById("inputField");
const outputField = document.getElementById("outputField");
const buttonCheck = document.getElementById("buttonCheck");

buttonCheck.addEventListener("mouseover", () => { buttonCheck.style.backgroundColor="#333333"; buttonCheck.style.cursor="pointer";});
buttonCheck.addEventListener("mouseout", () => { buttonCheck.style.backgroundColor="black"; buttonCheck.style.cursor="pointer";});

let PrepareString = (stringToPrepare) => (stringToPrepare.toLowerCase().replace(/[\s&\/\\#,+()$~%.'":*?<>{}éèàç]/g, ''));
let CheckIfPalindrome = (stringToCheck) => (stringToCheck===(stringToCheck.split('').reverse().join('')));

function CheckInput () {
    let originalString = inputField.value;
    if (CheckIfPalindrome(PrepareString(originalString))) {
        outputField.textContent = `"${originalString}" est bien un palindrome.`;
        outputField.style.color = "green";
    } else {
        outputField.textContent = `"${originalString}" n'est pas un palindrome.`;
        outputField.style.color = "red";
    }
}



/*
Prendre l'input
Retirer les espaces/majuscules/ponctuation/accents et mettre dans inputModif

split inputModif et mettre dans inputReversed
reverse inputReversed et mettre dans inputReversed
join inputReversed et mettre dans inputReversed

verfifier inputModif et inputReversed
si ils sont égaux c'est un palindrome
*/