/* J'ai jamais joué a pokemon mais bon vas-y lets go c'est parti */

const DomPageButtons = document.getElementById("PageButtons");
const DomPageNumber = document.getElementById("PageNumber");
const DomPageTotal = document.getElementById("PageTotal");
const DomMain = document.querySelector("main");
const PageLeft = document.getElementById("PageLeft");
const PageRight = document.getElementById("PageRight");
const DetailsWindow = document.getElementById("Details");
const SearchBar = document.getElementById("SearchBar");
SearchBar.addEventListener("keydown", SearchBarSearch);
document.getElementById("SearchButton").addEventListener("click", SearchBarSearch);
document.getElementById("Favorite").addEventListener("click", DisplayFavoriteList);
document.getElementById("FiltersMenu").addEventListener("submit", DisplayFilterList);
document.getElementById("FiltersButton").addEventListener("click", () => {
    if (WindowIsOpen) return;
    const Menu = document.getElementById("FiltersMenu");
    if (Menu.style.display == "none") {
        Menu.style.display = "flex";
    } else {
        Menu.style.display = "none";
    }
});


let WindowIsOpen = false;
let IsListingFavorites = false;
let Data;
let FilteredData;
let SearchData;
let PageIndex = 0;
let PageLength = 18;
let PagesMax;
let CheckLocalStorageError = false;

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
DomPageNumber.addEventListener("keyup", (event) => {
    if (event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40) ChangePageNumber();
});

function SearchBarSearch(event) {
    if (WindowIsOpen) return;
    if (event.keyCode == 13) {
        SearchPokemon(this.value);
    } else if (event.detail == 1) {
        SearchPokemon(SearchBar.value);
    }
}

async function ChangePageNumber() {
    if (WindowIsOpen) return;
    PageIndex = DomPageNumber.value-1;
    if (PageIndex < 0) {
        PageIndex = 0;
        DomPageNumber.value = 1;
    } else if (PageIndex > PagesMax) {
        PageIndex = PagesMax;
        DomPageNumber.value = PagesMax+1;
    } else {
        if (PageIndex == 0) PageLeft.disabled = true;
        else PageLeft.disabled = false;
        if (PageIndex >= PagesMax) PageRight.disabled = true;
        else PageRight.disabled = false;
        await CreatePokemonCardList();
    }
}

function ShowError(text) {
    const CloseWindowButton = document.createElement("div");
    CloseWindowButton.className = "WindowButtonRight";
    CloseWindowButton.innerHTML = (`<img class="DetailsClose" id="Hide0" src="./icons/x-circle-fill.svg" alt="Icône fermer la fenêtre">`);
    CloseWindowButton.addEventListener("click", HidePokemonDetails);
    DetailsWindow.style.display = "flex";
    DetailsWindow.innerHTML = `
            <div class="DetailsWindowBody">
                <div class="DetailsBottomDiv"><h1>${text}</h1></div>
            </div>
    `;
    DetailsWindow.append(CloseWindowButton);
    WindowIsOpen = true;
}
function ShowPokemonDetails(event, id = null) {
    if (WindowIsOpen) return;
    const DetailsCardAnimation = " DetailsCardAnimation";
    const FavoritePokemon = JSON.parse(localStorage.getItem ("FavoritePokemon"));
    
    if (id == null) {
        const element = this;
        id = element.id;
        element.className += DetailsCardAnimation;
    }
    if (id == null || id == undefined) return;
    if (event == null) {
        const element = document.getElementById(id);
        id = element.id;
        element.className += DetailsCardAnimation;
    }
    id = parseInt(id);
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
    const CloseWindowButton = document.createElement("div");
    CloseWindowButton.className = "WindowButtonRight";
    CloseWindowButton.innerHTML = (`<img class="DetailsClose" id="Hide${id}" src="./icons/x-circle-fill.svg" alt="Icône fermer la fenêtre">`);
    CloseWindowButton.addEventListener("click", HidePokemonDetails);
    const FavouriteWindowButton = document.createElement("div");
    FavouriteWindowButton.className = "WindowButtonLeft";
    FavouriteWindowButton.innerHTML = (`<img class="DetailsFavourite" id="Favorite${id}" src="${FavoritePokemon.PokemonList.includes(id) ? './icons/star-fill.svg' : './icons/star.svg'}" alt="Icône favoris">`);
    FavouriteWindowButton.addEventListener("click", PokemonToFavorite);

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
    DetailsWindow.append(FavouriteWindowButton);
    WindowIsOpen = true;
}
function HidePokemonDetails(event, id = null) {
    const DetailsCardAnimation = " DetailsCardAnimation";
    if (id == null) {
        const element = this.firstChild;
        id = parseInt(element.id.replace("Hide", ""));
    }
    if (id == null || id == undefined) {
        return;
    }
    if (event != null && id != 0) {
        const element = document.getElementById(id);
        element.className = element.className.replace(DetailsCardAnimation, "");
    }
    
    DetailsWindow.style.display = "none";
    DetailsWindow.innerHTML = "";
    WindowIsOpen = false;
}

function PokemonToFavorite () {
    if (CheckLocalStorageError) return;
    const element = this.firstChild;
    const id = parseInt(element.id.replace("Favorite", ""));
    let FavoritePokemon = JSON.parse(localStorage.getItem ("FavoritePokemon"));
    if (FavoritePokemon.PokemonList.includes(id)) {
        FavoritePokemon.PokemonList = RemoveArrayData(FavoritePokemon.PokemonList, id);
        element.src="./icons/star.svg";
    }
    else {
        FavoritePokemon.PokemonList.push(id);
        element.src="./icons/star-fill.svg";
    }
    localStorage.setItem ("FavoritePokemon", JSON.stringify(FavoritePokemon));
    CreatePokemonCardList();
}

async function GetRandomPokemon () {
    if (WindowIsOpen) return;
    ResetList();
    let rndId = Math.round(Math.random() * FilteredData.length);
    DomPageNumber.value = Math.floor(rndId/PageLength) + 1;
    await ChangePageNumber();
    ScrollToCard(rndId);
    ShowPokemonDetails(null, rndId);
}
async function GoToPokemon (id) {
    if (WindowIsOpen == true) HidePokemonDetails(null, id);
    ResetList();
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
    const FavoritePokemon = JSON.parse(localStorage.getItem ("FavoritePokemon"));
    const SlicedData = FilteredData.slice(ArrayOffset, ArrayOffset + PageLength);
    
    let CardList = document.createElement("section");
    CardList.id = "CardList";
    let Card = "";
    SlicedData.forEach(element => {
        let Id = element.id;
        let Name = element.name;
        let HP = element.stats.HP;
        let Image = element.image;
        let Type = element.apiTypes[0].name;
        let TypeImage = element.apiTypes[0].image;
        Card = document.createElement("div");
        Card.id = Id;
        Card.className = `Card Type${Type}`;
        Card.innerHTML = `
                <img class="CardImage" src="${Image}" loading="lazy" width="250px" height="250px" alt="Illustration Du Pokedex">
                ${FavoritePokemon.PokemonList.includes(Id) ? Star : ""}
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
    const OldList = document.getElementById("CardList");
    const OldTitle = document.querySelector("h1");
    DomMain.replaceChild(CardList, OldList);
    DomMain.replaceChild(ListTitle, OldTitle);
}

async function SearchPokemon(name = undefined) {
    if (name == undefined || name == "") {
        return;
    }
    FilteredData = [...Data];
    fetch("https://pokebuildapi.fr/api/v1/pokemon/"+name)
        .then(data => {
            if (data.ok) return data.json();
            else if (data.status === 500) ShowError("Ce pokémon n'existe pas.");
        })
        .then(json => {
            SearchData = JSON.parse(JSON.stringify(json));
            GoToPokemon(SearchData.id);
        })
        .catch(error => {
            console.log(error);
        });
}
function DisplayFavoriteList() {
    if (WindowIsOpen) return;
    if (IsListingFavorites) {
        ResetList();
        return;
    }
    IsListingFavorites = true;
    const FavoritePokemon = JSON.parse(localStorage.getItem ("FavoritePokemon"));
    FilteredData = [];
    for (let i = 0; i < FavoritePokemon.PokemonList.length; i++) {
        FilteredData.push(Data[FavoritePokemon.PokemonList[i] - 1]);
    }
    UpdatePageList("Pokémon favoris ");
}
function DisplayFilterList (event) {
    event.preventDefault();
    if (WindowIsOpen) return;
    IsListingFavorites = false;
    this.style.display = "none";
    const FiltersData = new FormData(this);
    const OrderBy = FiltersData.get("OrderBy");
    const Filter = FiltersData.get("FilterType");
    const FilterValue = Filter.replace("Filter", "")
    FilteredData = [...Data];
    if ((OrderBy == "OrderById") && (Filter == "FilterAll")) {
        ResetList();
        return;
    }
    if (OrderBy == "OrderById") FilteredData.sort((A, B) => A.id - B.id);
    if (OrderBy == "OrderByName") FilteredData.sort((A, B) => A.name.localeCompare(B.name));
    if (!(Filter == "FilterAll")) FilteredData = FilteredData.filter((E) => E.apiTypes.some(F => F.name === FilterValue));
    UpdatePageList("Pokémon filtrées et ordonées ");
}

function ResetList() {
    IsListingFavorites = false;
    FilteredData = [...Data];
    UpdatePageList();
}
function UpdatePageList(text = null) {
    PagesMax = Math.floor(FilteredData.length / PageLength);
    DomPageTotal.textContent = "/ " + (PagesMax + 1);
    DomPageNumber.max = PagesMax+1;
    if (text == null) document.getElementById("ListTitle").textContent = "Tous les Pokémons ("+Data.length+") :";
    else document.getElementById("ListTitle").textContent = text+"("+FilteredData.length+") :";
    CreatePokemonCardList();
    DomPageNumber.value = 1;
    ChangePageNumber();
}

function CheckLocalStorageFavorite() {
    let FavoriteList = localStorage.getItem ("FavoritePokemon");
    if (!FavoriteList) localStorage.setItem ("FavoritePokemon", '{"PokemonList":[]}');
    if (IsJsonString(FavoriteList) == false) {
        if (CheckLocalStorageError) return;
        CheckLocalStorageError = true;
        localStorage.setItem ("FavoritePokemon", '{"PokemonList":[]}');
        CheckLocalStorageFavorite();
    }
    CheckLocalStorageError = false;
    FavoriteList = JSON.parse(FavoriteList);
    if (!("PokemonList" in FavoriteList) || !(Array.isArray(FavoriteList.PokemonList))) {
        if (CheckLocalStorageError) return;
        CheckLocalStorageError = true;
        localStorage.setItem ("FavoritePokemon", '{"PokemonList":[]}');
        CheckLocalStorageFavorite();
    }
    for(let i = 0; i < FavoriteList.PokemonList.length; i++) {
        if (FavoriteList.PokemonList[i] <= 0 || FavoriteList.PokemonList[i] > Data.length) FavoriteList.PokemonList.splice(i, 1);
        
    }
    localStorage.setItem ("FavoritePokemon", JSON.stringify(FavoriteList));
    CheckLocalStorageError = false;
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function RemoveArrayData(array, value) {
    let index = array.indexOf(value);
    if (index !== -1) {
        array.splice(index, 1);
        return array;
    }
}

function Start() {
    // fetch("https://pokebuildapi.fr/api/v1/pokemon")
    fetch ("./pokemon.json")
    .then(data => {
        if (data.ok) return data.json();
        else ShowError("Erreur de connexion avec l'api, veuillez réessayer plus tard.");
    })
    .then(json => {
        Data = JSON.parse(JSON.stringify(json));
        FilteredData = [...Data];
        CheckLocalStorageFavorite();
        UpdatePageList();
    })
    .catch(error => console.log(error));
}
Start();

