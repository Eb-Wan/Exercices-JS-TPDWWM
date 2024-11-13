// let value = 8;
// console.log ((value%2)===0)

var BodyElement = document.getElementById("BodyId");


let Value = prompt("Enter value");
let Result = ((Value%2)===0);

console.log (Result);
BodyElement.innerHTML = Result;