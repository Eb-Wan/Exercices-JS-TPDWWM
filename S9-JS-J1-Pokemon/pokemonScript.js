/* J'ai jamais joué a pokemon mais bon vas-y lets go c'est parti */

//api/v1/pokemon/limit/100

//Do Details
//Do Favorites
//Do Search
//Error Handler

RequestPokemonApi();

const DomPageButtons = document.getElementById("PageButtons");
const DomPageNumber = document.getElementById("PageNumber");
const DomPageTotal = document.getElementById("PageTotal");
const DomMain = document.querySelector("main");
const PageLeft = document.getElementById("PageLeft");
const PageRight = document.getElementById("PageRight");

let Data;
let PageIndex = 0;
let PageLength = 18;
let PagesMax;

InitialApiCall();

document.getElementById("RandomPokemon").addEventListener("click", GetRandomPokemon);

PageLeft.disabled = true;
PageLeft.addEventListener("click", () => {
    DomPageNumber.value--;
    ChangePageNumber();
});
PageRight.addEventListener("click", () => {
    DomPageNumber.value++;
    ChangePageNumber();
});
DomPageNumber.value = 1;
DomPageNumber.addEventListener("focusout", ChangePageNumber);
DomPageNumber.addEventListener("keyup", (event) => {
    if (event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) ChangePageNumber();
});

async function ChangePageNumber() {
    PageIndex = DomPageNumber.value-1;
    console.log(PageIndex);
    if (PageIndex < 0) {
        PageIndex = 0;
        DomPageNumber.value = 1;
    }
    else if (PageIndex > PagesMax) {
        PageIndex = PagesMax;
        DomPageNumber.value = PagesMax+1;
    } else if (PageIndex == 0) {
        PageLeft.disabled = true;
        await CreatePokemonCardList();
    } else if (PagesMax == 0) {
        PageRight.disabled = true;
        await CreatePokemonCardList();
    } else {
        PageLeft.disabled = false;
        PageRight.disabled = false;
        await CreatePokemonCardList();
    }
}

function DisplayHomePage() {
    CreatePokemonCardList();
}

function ShowPokemonDetails(envent, id = null) {
    if (id == null) {
        const DetailsCardAnimation = " DetailsCardAnimation";
        const element = this;
        id = element.id;
        element.className += DetailsCardAnimation;
    }
    if (id != null || id != undefined) {
       //
       ScrollToCard(id);

    }
    console.log(id);
}
function HidePokemonDetails(id) {
    const DetailsCardAnimation = " DetailsCardAnimation";
    const element = document.getElementById(id);
    element.className = element.className.replace(DetailsCardAnimation, "");
    console.log("OK2!");
}

async function GetRandomPokemon () {
    let rndId = Math.round(Math.random() * Data.length);
    DomPageNumber.value = Math.floor(rndId/PageLength) + 1;
    await ChangePageNumber();
    ScrollToCard(rndId);
    ShowPokemonDetails(rndId)
}
function ScrollToCard(id) {
    document.getElementById(id.toString()).scrollIntoView({behavior: "smooth", block: "center"});
}

async function CreatePokemonCardList(filters=null) {
    Data = await RequestPokemonApi();

    const Star = `<img class="IconButton CardFavorite" src="./icons/star-fill.svg" alt="Icône étoile">`;
    let ArrayOffset = PageIndex * PageLength;
    let SlicedData = Data.slice(ArrayOffset, ArrayOffset + PageLength);;

    let CardList = document.createElement("section");
    CardList.id = "CardList";
    let Card = "";

    let Id;
    let Name;
    let HP;
    let Image;
    let Type;
    let TypeImage;
    
    SlicedData.forEach(element => {
        Id = element.id;
        Name = element.name;
        HP = element.stats.HP;
        Image = element.image;
        Type = element.apiTypes[0].name;
        TypeImage = element.apiTypes[0].image;
        Card = document.createElement("div");
        Card.id = Id;
        Card.className = `Card Type${Type}`;
        Card.innerHTML = `
                <img class="CardImage" src="${Image}" loading="lazy" width="250px" height="250px" alt="Illustration Du Pokedex">
                ${false ? Star : ""}
                <div class="CardLine">
                    <p class="CardName">${Name}</p>
                    <p><span class="LargerText">${HP}</span> PV</p>
                </div>
                <div class="CardLine">
                    <img class="IconType" loading="lazy" width="40px" height="40px" src="${TypeImage}" alt="Type de Pokémon">
                    <p>${Type}</p>
                </div>
        `;
        Card.addEventListener("click", ShowPokemonDetails);
        CardList.appendChild(Card);
    });
    DomMain.removeChild(DomMain.firstChild);
    DomMain.prepend(CardList);
}

function RequestPokemonApi() {
    return new Promise((resolve) => {
        fetch("./pokemon.json")
        .then(data => resolve (data.json()))
        // .then(json =>  (JSON.stringify(json)))
        .catch(error => console.log(error));
    });
}
function InitialApiCall() {
    fetch("./pokemon.json")
    .then(data => data.json())
    .then(json => {
        Data = JSON.parse(JSON.stringify(json));
        PagesMax = Math.floor(Data.length / PageLength);
        DomPageTotal.textContent = "/ " + (PagesMax + 1);
        DomPageNumber.max = PagesMax+1;
    })
    .catch(error => console.log(error));
}
RequestPokemonApi();
DisplayHomePage();