let productForm = document.getElementById("FormNewProduct");
let articleShippingCostInput = document.getElementById("ArticleShippingCostInput");
document.querySelector("#NoFee").addEventListener("click", () => articleShippingCostInput.style.visibility="hidden");
document.querySelector("#Fee").addEventListener("click", () => articleShippingCostInput.style.visibility="visible");

productForm.addEventListener("submit", function(eventInfos) {
    eventInfos.preventDefault();
    let productName = document.getElementById("ArticleName");
    let productDescription  = document.getElementById("ArticleDescription");
    let productImageInput = document.getElementById("ArticleImage");
    let productColors = document.getElementById("ArticleColors");
    let productPrice = document.getElementById("ArticlePrice");
    let productMaterial = document.getElementById("ArticleTextile");
    let productShipmentFee = document.getElementById("ArticleShippingCost");
    let productSizes = document.querySelectorAll('input[name="ArticleSizes"]:checked');
    let errorCode;

    if (productName.value === '') errorCode="Veuillez donner un nom a l'article";
    if (productDescription.value === '') errorCode="Veuillez donner une description a l'article";
    if (productPrice.value < 1 || productPrice.value > 500) errorCode="Le prix doit être entre 1€ et 500€";
    if ((productShipmentFee.value < 1|| productShipmentFee.value > 500) && articleShippingCostInput.style.visibility==="visible") errorCode="Le prix de livraison doit être entre 1€ et 500€";
    if (productImageInput.files.length === 0) errorCode="Veuillez sélectionner au moins une image";
    if (productSizes.length === 0) errorCode="Veuillez indiquer au moins une taille";

    if (errorCode != undefined) {
        document.getElementById("ErrorSpan").textContent=errorCode;
        document.getElementById("ErrorSpan").style.color="red";
        return;
    }
    if (articleShippingCostInput.style.visibility==="hidden") productShipmentFee.value = 0;
    let productImages = [];
    for (let i = 0; i < productImageInput.files.length; i++) {
        productImages.push(productImageInput.files[i].name);
    }
    document.getElementById("ErrorSpan").textContent="OK";
    document.getElementById("ErrorSpan").style.color="green";

    //.replace("<script>", "") Pour ne pas avoir XSS
    let checkTable = `
        <table>
            <tbody>
                <tr>
                    <td>Nom de l'article</td>
                    <td>${productName.value.replace("<script>", "")}</td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>${productDescription.value.replace("<script>", "")}</td>
                </tr>
                <tr>
                    <td>Images</td>
                    <td>${productImages.replace("<script>", "")}</td>
                </tr>
                <tr>
                    <td>Couleurs</td>
                    <td>${(productColors.value === '') ? "Aucune couleur" : productColors.value.replace("<script>", "")}</td>
                </tr>
                <tr>
                    <td>Prix</td>
                    <td>${productPrice.value.replace("<script>", "")} €</td>
                </tr>
                <tr>
                    <td>Matière</td>
                    <td>${productMaterial.value.replace("<script>", "")}</td>
                </tr>
                <tr>
                    <td>Livraison</td>
                    <td>${productShipmentFee.value.replace("<script>", "")} €</td>
                </tr>
                 <tr>
                    <td>Tailles</td>
                    <td>${productSizes.value.replace("<script>", "")}</td>
                </tr>
            </tbody>
        </table>
    `;
    document.getElementById("CheckTable").innerHTML = checkTable;
});