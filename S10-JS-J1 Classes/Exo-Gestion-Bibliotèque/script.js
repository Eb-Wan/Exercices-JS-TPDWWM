//AFICHER UN LIVRE
//      Charger les données depuis le fichier JSON via fetch lors du chargement de la page
//      Afficher la liste des livres et pensez aux boutons d'action (Emprunter, Rendre, Supprimer)

//Ajouter un livre à l’aide d’un formulaire
//Emprunter un livre 
//Rendre un livre
//Supprimer un livre

const DomMain = document.querySelector("main");
const DefaultText = DomMain.innerHTML;
const DomBorrowButton = document.getElementById("IdBorrowButton");
const DomReturnButton = document.getElementById("IdReturnButton");
const DomAddButton = document.getElementById("IdAddButton");
const DomRemoveButton = document.getElementById("IdRemoveButton");

let JsonData;
let CallBackSave;
class MasterClass {
    async SetupLocalStorage() {
        try {
            let Response = await fetch("./BookList.json");
            if (!Response.ok) throw new Error(Response.status+", les données n'on pas été trouvées.");
            Response = await Response.json();
            localStorage.setItem("BookListLocalStorage", JSON.stringify(Response.data));
        } catch(Error) {alert(Error);}
    }
    GetJsonLocalStorage() {
        JsonData = JSON.parse(localStorage.getItem("BookListLocalStorage"));
    }
    SetJsonLocalStorage() {
        localStorage.setItem("BookListLocalStorage", JSON.stringify(JsonData));
    }
    OpenWindow() {
        MasterClassInstance.CreateWindow("Titre de fenêtre", "<p>Texte par défaut.</p>");
    }
    OpenWindowWithList(Title, IsBorrowed = null, CallBack) {
        let HtmlContent = `
            <p class="Larger">Veuillez sélectionner un livre.</p>
        `;
        MasterClassInstance.CreateWindowWidthList(Title, HtmlContent, IsBorrowed, CallBack);
    }
    CreateWindow(WindowTitle, HtmlContent) {
        DomMain.innerHTML = `
            <section class="Window">
                <div class="WindowHeader"><span>${WindowTitle}</span><button id="IdWindowClose">X</button></div>
                <div>
                    ${HtmlContent}
                </div>
            </section>
        `;
        document.getElementById("IdWindowClose").addEventListener("click", MasterClassInstance.CloseWindow);
    }
    CreateWindowWidthList(WindowTitle, HtmlContent, IsBorrowed = null, CallBack) {
        DomMain.innerHTML = `
            <section class="Window">
                <div class="WindowHeader"><span>${WindowTitle}</span><button id="IdWindowClose">X</button></div>
                <div>
                    <div class="WindowBodyLeft" style="width: 40%">
                    <input id="BookSearchInput${IsBorrowed}" type="text" placeholder="Rechercher un livre...">

                    </div>
                    <div class="WindowBodyRight" style="width: 60%">
                        ${HtmlContent}
                    </div>
                </div>
            </section>
        `;
        document.getElementById("BookSearchInput"+IsBorrowed).addEventListener("keyup", MasterClassInstance.CreateBookList);
        document.getElementById("IdWindowClose").addEventListener("click", MasterClassInstance.CloseWindow);
        MasterClassInstance.CreateBookList(null, null, IsBorrowed, CallBack);
    }
    CloseWindow(event, PopupMessage = undefined) {
        DomMain.innerHTML = DefaultText;
        if (PopupMessage != undefined) {
            const DomPopup = document.querySelector("PopupWindow");
            let Popup = document.createElement("div");
            Popup.className = "PopupWindow";
            Popup.textContent = PopupMessage;
            if (DomPopup != null) DomMain.removeChild(DomPopup);
            DomMain.appendChild(Popup);
            setTimeout(function() {
                if (document.contains(Popup)) DomMain.removeChild(Popup);
            }, 5000);
        }
    }
    
    CreateBookList(event = null, FilterByTitle = null, FilterIsBorrowed = null, CallBack) {
        const DomWindowBodyLeft = document.querySelector(".WindowBodyLeft");
        if (event != null) {
            FilterByTitle = event.target.value;
            FilterIsBorrowed = event.target.id;
            FilterIsBorrowed = FilterIsBorrowed.replace("BookSearchInput", "") == "true";
        }
        if (CallBack != undefined) CallBackSave = CallBack;
        console.log (CallBackSave)
        let BookList;
        let Result = document.createElement("div");
        Result.id = "IdBookList";

        if (FilterByTitle != null || FilterIsBorrowed != null) {
            if (FilterByTitle == null) FilterByTitle = "";
            BookList = (JsonData.filter((el) => (el.title.toLowerCase().includes(FilterByTitle.toLowerCase()) && FilterIsBorrowed == el.isBorrowed)));
        } else BookList = JsonData;
        BookList.forEach((element, id) => {
            let JsonId = JsonData.find(e => e.title == element.title).id - 1;
            if (CallBack == undefined)  CallBack = CallBackSave;
            Result.innerHTML += `
                <div onclick="${CallBack}(${JsonId})">
                    <span>${element.title}</span><span>${element.author} | ${element.year}</span>
                </div>
            `;
        });
        if (document.getElementById("IdBookList") != undefined) DomWindowBodyLeft.removeChild(document.getElementById("IdBookList"));
        if (BookList.length === 0) {
            Result.innerHTML = "Pas de résultats";
            DomWindowBodyLeft.appendChild(Result);
            return;
        }
        DomWindowBodyLeft.appendChild(Result);
    }
}


class BorrowBookClass extends MasterClass {
    OpenWindowWithList() {
        super.OpenWindowWithList("Emprunter un livre", false,"BorrowBook.ShowBook");
    }
    ShowBook (id) {
        const DomWindowBodyRight = document.querySelector(".WindowBodyRight");
        let HtmlContent = `
            <p class="Larger">${JsonData[id].title}</p>
            <p>Par ${JsonData[id].author} | En ${JsonData[id].year}</p>
            <p>${JsonData[id].shortDescription}</p>
            <button id="Borrow${id}">Emprunter</button>
        `;
        DomWindowBodyRight.innerHTML = HtmlContent;
        document.getElementById("Borrow"+id).addEventListener("click", this.BorrowBook);
    }
    BorrowBook (event) {
        const id = parseInt(event.target.id.replace("Borrow", ""));
        JsonData[id].isBorrowed = true;
        super.SetJsonLocalStorage();
        super.CloseWindow(event, "Le livre a été emprunté.")
    }
}
class ReturnBookClass extends MasterClass {
    OpenWindowWithList() {
        super.OpenWindowWithList("Rendre un livre", true,"ReturnBook.ShowBook");
    }
    ShowBook (id) {
        const DomWindowBodyRight = document.querySelector(".WindowBodyRight");
        let HtmlContent = `
            <p class="Larger">${JsonData[id].title}</p>
            <p>Par ${JsonData[id].author} | En ${JsonData[id].year}</p>
            <p>${JsonData[id].shortDescription}</p>
            <button id="Return${id}">Rendre</button>
        `;
        DomWindowBodyRight.innerHTML = HtmlContent;
        document.getElementById("Return"+id).addEventListener("click", this.ReturnBook);
    }
    ReturnBook (event) {
        const id = parseInt(event.target.id.replace("Return", ""));
        JsonData[id].isBorrowed = false;
        super.SetJsonLocalStorage();
        super.CloseWindow(event, "Le livre a été rendu.")
    }
}
class RemoveBookClass extends MasterClass {
    OpenWindowWithList() {
        super.OpenWindowWithList("Retirer un livre", null,"RemoveBook.ShowBook");
    }
    ShowBook (id) {
        const DomWindowBodyRight = document.querySelector(".WindowBodyRight");
        let HtmlContent = `
            <p class="Larger">${JsonData[id].title}</p>
            <p>Par ${JsonData[id].author} | En ${JsonData[id].year}</p>
            <p>${JsonData[id].shortDescription}</p>
            <button id="Remove${id}">Retirer</button>
        `;
        DomWindowBodyRight.innerHTML = HtmlContent;
        document.getElementById("Remove"+id).addEventListener("click", this.RemoveBook);
    }
    RemoveBook (event) {
        const id = parseInt(event.target.id.replace("Remove", ""));
        JsonData.splice(id, 1);
        super.SetJsonLocalStorage();
        super.CloseWindow(event, "Le livre a été retiré.")
    }
}
class AddBookClass extends MasterClass {
    OpenWindow() {
        let HtmlContent = `
            <form method="post" class="WindowBodyLeft" style="width: 50%">
                <input type="text" name="BookTitleForm">
                <textarea name="BookDescriptionForm"></textarea>
                <input type="text" name="BookAuthorForm">
                <input type="number" name="BookDateForm">
            </form>
            <div class="WindowBodyRight" style="width: 50%">Veulliez sélectionner un livre.</div>
        `;
        super.CreateWindow("Ajouter un livre", HtmlContent);
    }
    ShowBook (id) {
        const DomWindowBodyRight = document.querySelector(".WindowBodyRight");
        let HtmlContent = `
            <p class="Larger">${JsonData[id].title}</p>
            <p>Par ${JsonData[id].author} | En ${JsonData[id].year}</p>
            <p>${JsonData[id].shortDescription}</p>
            <button id="Remove${id}">Retirer</button>
        `;
        DomWindowBodyRight.innerHTML = HtmlContent;
        document.getElementById("Remove"+id).addEventListener("click", this.RemoveBook);
    }
    RemoveBook (event) {
        const id = parseInt(event.target.id.replace("Remove", ""));
        JsonData.splice(id, 1);
        super.SetJsonLocalStorage();
        super.CloseWindow(event, "Le livre a été retiré.")
    }
}

let MasterClassInstance = new MasterClass();
let BorrowBook = new BorrowBookClass();
let ReturnBook = new ReturnBookClass();
let RemoveBook = new RemoveBookClass();
let AddBook = new AddBookClass();

//MasterClassInstance.SetupLocalStorage();
MasterClassInstance.GetJsonLocalStorage();

DomBorrowButton.addEventListener("click", BorrowBook.OpenWindowWithList);
DomReturnButton.addEventListener("click", ReturnBook.OpenWindowWithList);
DomRemoveButton.addEventListener("click", RemoveBook.OpenWindowWithList);
DomAddButton.addEventListener("click", AddBook.OpenWindow);