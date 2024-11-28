/* J'ai jamais joué a pokemon mais bon vas-y lets go c'est parti */

//api/v1/pokemon/limit/100

//Do Details
//Do Favorites
//Do Search
//Error Handler

const DomPageButtons = document.getElementById("PageButtons");
const DomPageNumber = document.getElementById("PageNumber");
const DomPageTotal = document.getElementById("PageTotal");
const DomMain = document.querySelector("main");
const PageLeft = document.getElementById("PageLeft");
const PageRight = document.getElementById("PageRight");
const DetailsWindow = document.getElementById("Details");
const SearchBar = document.getElementById("SearchBar")
SearchBar.addEventListener("keydown", SearchBarSearch);
document.getElementById("SearchButton").addEventListener("click", SearchBarSearch);

function SearchBarSearch(event) {
    if (event.keyCode == 13) {
        SearchPokemon(this.value);
    } else if (event.detail == 1) {
        SearchPokemon(SearchBar.value);
    }
}

let Data;
let FilteredData;
let PageIndex = 0;
let PageLength = 18;
let PagesMax;

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
function ShowError() {
    const CloseWindowButton = document.createElement("img");
    CloseWindowButton.className = "DetailsClose";
    CloseWindowButton.id = "Show" + 1;
    CloseWindowButton.src = "./icons/x-circle-fill.svg";
    CloseWindowButton.alt="Icône fermer la fenêtre";
    CloseWindowButton.addEventListener("click", HidePokemonDetails);
    DetailsWindow.style.display = "flex";
    DetailsWindow.innerHTML = `
            <div class="DetailsWindowBody">
                <div class="DetailsBottomDiv"><h1>Ce pokémon n'existe pas</h1></div>
            </div>
    `;
    DetailsWindow.append(CloseWindowButton);
}
function ShowPokemonDetails(event, id = null) {
    const DetailsCardAnimation = " DetailsCardAnimation";
    if (id == null) {
        const element = this;
        id = element.id;
        element.className += DetailsCardAnimation;
    }
    if (id == null || id == undefined) {
        return;
    }
    if (event == null) {
        const element = document.getElementById(id);
        id = element.id;
        element.className += DetailsCardAnimation;
    }
    ScrollToCard(id);
    const element = Data[id - 1];
    let Types = "";
    let Evolutions = "";
    for (let i = 0; i < element.apiTypes.length; i++) {
        Types += `<li><img class="Icon" src="${element.apiTypes[i].image}" alt="${element.apiTypes[i].name}">${element.apiTypes[i].name}</li>`;
    }
    for (let i = 0; i < element.apiEvolutions.length; i++) {
        Evolutions += `<li class="Link" id="" onClick="GoToPokemon(${element.apiEvolutions[i].pokedexId})">${element.apiEvolutions[i].name}</li>`;
    }

    const CloseWindowButton = document.createElement("img");
    CloseWindowButton.className = "DetailsClose";
    CloseWindowButton.id = "Show" + id;
    CloseWindowButton.src = "./icons/x-circle-fill.svg";
    CloseWindowButton.alt="Icône fermer la fenêtre";
    CloseWindowButton.addEventListener("click", HidePokemonDetails);
    DetailsWindow.style.display = "flex";
    DetailsWindow.innerHTML = `
            <div class="DetailsWindowBody">
                <div class="DetailsTopDiv">
                    <img class="DetailsImage" src="${element.image}"></img>
                    <div class="DetailsDescription">
                        <p>${element.name}</p>
                        <ul>
                            <li>Id: ${element.id}</li>
                            <li>Generation: ${element.apiGeneration}</li>
                            <li>PV: ${element.stats.HP}</li>
                            <li>Attaque: ${element.stats.attack}</li>
                            <li>Défense: ${element.stats.defense}</li>
                        </ul>
                        <p>Types</p>
                        <ul class="DetailsType">
                            ${Types}
                        </ul>
                        
                    </div>
                </div>
                <div class="DetailsBottomDiv">
                    <hr>
                    <p>Évolution(s)</p>
                    <ul>
                        ${Evolutions != "" ? Evolutions : "Aucune autre évolution"}
                    </ul>
                </div>
            </div>
    `;
    DetailsWindow.append(CloseWindowButton);
}
function HidePokemonDetails(event, id = null) {
    const DetailsCardAnimation = " DetailsCardAnimation";
    if (id == null) {
        const element = this;
        id = parseInt(element.id.replace("Show", ""));
    }
    if (id == null || id == undefined) {
        return;
    }
    if (event != null) {
        const element = document.getElementById(id);
        element.className = element.className.replace(DetailsCardAnimation, "");
    }
    
    DetailsWindow.style.display = "none";
    DetailsWindow.innerHTML = "";
}

async function GetRandomPokemon () {
    let rndId = Math.round(Math.random() * Data.length);
    DomPageNumber.value = Math.floor(rndId/PageLength) + 1;
    await ChangePageNumber();
    ScrollToCard(rndId);
    ShowPokemonDetails(null, rndId);
}
async function GoToPokemon (id) {
    HidePokemonDetails(null, id);
    if (id%PageLength == 0) DomPageNumber.value = Math.floor((id-1)/PageLength) + 1;
    else DomPageNumber.value = Math.floor(id/PageLength) + 1;
    await ChangePageNumber();
    ScrollToCard(id);
    ShowPokemonDetails(null, id);
}
function ScrollToCard(id) {
    document.getElementById(id.toString()).scrollIntoView({behavior: "smooth", block: "center"});
}

async function CreatePokemonCardList() {
    const Star = `<img class="IconButton CardFavorite" src="./icons/star-fill.svg" alt="Icône étoile">`;
    let ArrayOffset = PageIndex * PageLength;
    const SlicedData = Data.slice(ArrayOffset, ArrayOffset + PageLength);
    
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

async function SearchPokemon(name = undefined) {
    if (name == undefined || name == "") {
        return;
    }
    fetch("https://pokebuildapi.fr/api/v1/pokemon/"+name)
        .then(data => {
            if (data.ok) return data.json();
            else if (data.status === 500) ShowError();
        })
        .then(json => {
            FilteredData = JSON.parse(JSON.stringify(json));
            GoToPokemon(FilteredData.id);
        })
        .catch(error => {
            console.log(error);
        });
    
}
function Start() {
    //fetch("https://pokebuildapi.fr/api/v1/pokemon")
    fetch("./pokemon.json")
    .then(data => data.json())
    .then(json => {
        Data = JSON.parse(JSON.stringify(json));
        PagesMax = Math.floor(Data.length / PageLength);
        DomPageTotal.textContent = "/ " + (PagesMax + 1);
        DomPageNumber.max = PagesMax+1;
        DisplayHomePage();
    })
    .catch(error => console.log(error));
}
Start();