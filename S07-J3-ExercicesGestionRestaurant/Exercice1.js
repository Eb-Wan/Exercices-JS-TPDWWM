const restaurantName = "En Gaule";      //Nom de restaurant
const tablesTotal = 20;                 //Tables dispo
const defaultPrice = 10;                //Prix Moyen
const currency = "€";                   //Devise monétaire

let customersEating = 12;                //Clients installés
let tablesRemaining = tablesTotal;      //Tables Restantes
let restaurantIsFull = false;           //Booléen pour restaurant complet
let potentialSales = 0;                 //Chiffre d'affaire potentiel

const message1 = "Bienvenue au restaurant";
const message2 = restaurantName;
const welcomeMessage = message1 + " " + message2;

console.log ("Nom: [" + restaurantName + "] Tables(6) : [" + tablesTotal + "] Clients : [" + customersEating + "] Prix moyen : [" + defaultPrice + currency +"]");

tablesRemaining = tablesTotal - (customersEating / 6);
console.log ("Tables(6) restantes : " + tablesRemaining);

console.log ("Au moins 5 tables(6) disponibles :", tablesRemaining >= 5);
console.log ("Moins 3 tables(6) disponibles :", tablesRemaining < 3);
restaurantIsFull = tablesRemaining <= 0;
console.log ("Restaurant complet :",restaurantIsFull);

potentialSales = defaultPrice * customersEating;
potentialSales += 10;
console.log ("Chiffre d'affaires potentiel :", potentialSales, currency);

console.log (welcomeMessage + ", il reste " + tablesRemaining + " tables");