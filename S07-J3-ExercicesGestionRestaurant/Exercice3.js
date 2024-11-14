const orders = ["Pizza", "Salade", "Pâtes", "Burger", "Dessert"];
let price = 10;

orders.forEach(element => {console.log (element)});

console.log ("_");

for (let i = 0; i < orders.length; i++) {
    console.log (orders[i]);
}

console.log ("_");

let a = 0;
while (a < orders.length) {
    console.log (orders[a]);
    if (orders[a] === "Burger") break;
    a++;
}

console.log ("_");

let i = 0;
do {
    price = 10;
    if (orders[i] === "Burger") price *= 0.9; 
    console.log (orders[i], "| Prix = ", price+"€");
    i++;
} while (i < orders.length);