// afficher le produit 
let ProductsInCart = JSON.parse(localStorage.getItem("products"))

function DisplayCart(){
    let totalQuantity = quantityInCart.reduce((a, b) => a + b, 0);
    document.querySelector("#totalQuantity").innerHTML = totalQuantity;
    let totalPrice = itemsPrice.reduce((a, b) => a + b, 0);
    document.querySelector("#totalPrice").innerHTML = totalPrice;
    }

// calculer la quantité totale d'articles et le prix du panier
let quantityInCart = [];
let itemsPrice = [];

// Afficher les produits présents dans le panier
function displayCartElements(){
    
    if (ProductsInCart !== null){

        fetch(`http://localhost:3000/api/products`)
            .then((data) => data.json())
            .then((jsonProduct) =>{
                for (let item of ProductsInCart){
                    for (let itemJson of jsonProduct){
                        if (item.id == itemJson._id){

                        item.quantity = parseInt(item.quantity);       
                        let itemTotalPrice = itemJson.price*item.quantity;
            
                        document.querySelector('#cart__items').innerHTML += 
                        `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
                            <div class="cart__item__img">
                                <img src="${itemJson.imageUrl}" alt="${itemJson.altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__titlePrice">
                                    <h2>${itemJson.name}</h2>
                                    <p>${item.color}</p>
                                    <p>${itemTotalPrice} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté :</p>
                                        <input type="number" class="itemQuantity" data-price ="${itemJson.price}" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>`;
                    
                    
                        quantityInCart.push(item.quantity);
                        itemsPrice.push(itemTotalPrice);
            
                        }
                    };
                };
            DisplayCart();
            deleteProduct();   
            DisplayChangeElements();    
            });
       
    };
};
displayCartElements();

// supprimer un article du panier 
function deleteProduct(){
    let deleteItemList = document.querySelectorAll(".deleteItem");
    
    for (let deleteButton of deleteItemList){
        deleteButton.addEventListener('click', function(){
            let deleteArticle = deleteButton.closest("article");
            let dataId = deleteArticle.getAttribute("data-id");

            let deleteColor = deleteButton.closest("article > div");
            let dataColor = deleteColor.getElementsByTagName("p")[0];
        
        //  mise à jour du local storage
            let productIndex = ProductsInCart.findIndex((product)=>
            product.id === dataId && product.color === dataColor.innerHTML);

            ProductsInCart.splice(productIndex,1);
            localStorage.setItem("products", JSON.stringify(ProductsInCart));

            quantityInCart.splice(productIndex,1);
            itemsPrice.splice(productIndex,1);
            deleteArticle.remove();

            DisplayCart();
        });
    };
};


// Modifier l'affichage de la quantité des éléments
function DisplayChangeElements(){
    let quantityButtonsList = document.querySelectorAll('.itemQuantity');

    for (let quantityButton of quantityButtonsList){
        quantityButton.addEventListener("change", function(event){
            let modifyArticle = quantityButton.closest("article");
            let dataId = modifyArticle.getAttribute("data-id");

            let modifyColor = quantityButton.closest("article > div");
            let dataColor = modifyColor.getElementsByTagName("p")[0];

            let productIndex = ProductsInCart.findIndex((product)=>
            product.id === dataId && product.color === dataColor.innerHTML);
            ProductsInCart[productIndex].quantity = parseInt(quantityButton.value);

            localStorage.setItem("products", JSON.stringify(ProductsInCart));

            quantityInCart[productIndex] = parseInt(quantityButton.value);
            itemsPrice[productIndex] = parseInt(quantityButton.value)* parseInt(event.target.getAttribute("data-price"));

            // mise à jour du code HTML automatiquement
            let changePrice = modifyColor.getElementsByTagName("p")[1];
            changePrice.innerHTML = `${itemsPrice[productIndex]} €`;
            
            DisplayCart();
        })
    }
    
}




// Validation des éléments du formulaire
let firstNameInput = document.getElementById("firstName");
let firstNameError = document.getElementById("firstNameErrorMsg");
let lastNameInput = document.getElementById("lastName");
let lastNameError = document.getElementById("lastNameErrorMsg");
let cityInput= document.getElementById("city");
let cityError= document.getElementById("cityErrorMsg");
let emailInput = document.getElementById("email");
let emailError = document.getElementById("emailErrorMsg");
let addressInput = document.getElementById("address");
let addressError = document.getElementById("addressErrorMsg");

function ValidationMail()
{

    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value)){

        emailError.innerText = "";

        return true;

    } else {

        emailError.innerText = "L'adresse email renseignée est erronée.";

    }
}

function ValidationAddress()
{
    if (/^[-'a-zA-Z0-9À-ÖØ-öø-ÿ\s]{3,}$/.test(addressInput.value)){
        addressError.innerText = "";
        return true;

    }else{
        addressError.innerText = "L'adresse renseignée n'est pas une adresse valide"
    }
}

function ValidationName(name, nameError){
    if (/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(name.value)){
        nameError.innerText = "";
        return true;

    }else{
        nameError.innerText = "L'élément renseigné n'est pas conforme"
    }
}

function ValidationCity(){
    if (/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(cityInput.value)){
        cityError.innerText = "";
        return true;

    }else{
        cityError.innerText = "La ville renseignée n'est pas une ville valide"
    }
}

function VerifyInputs()
{
    ValidationName(firstNameInput, firstNameError);
    ValidationName(lastNameInput, lastNameError);
    ValidationAddress();
    ValidationCity();
    ValidationMail();
};

function sendOrder(){
    let orderButton = document.getElementById("order");
    
    orderButton.addEventListener("click", function (event){

        event.preventDefault();

        // Verifier les données entrées
        VerifyInputs();

        if (ValidationName(firstNameInput, firstNameError) && ValidationName(lastNameInput, lastNameError) && ValidationCity() && ValidationMail() && ValidationAddress()) {
            
            let products = [];

            for (let item of JSON.parse(localStorage.getItem("products"))){

                products.push(item.id);

            };
            // Créer les données à envoyer
            let orderToSend = {
                contact: {
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                address: addressInput.value,
                city: cityInput.value,
                email: emailInput.value,
                },
                products,
            };

            // fonction pour envoyer les infos à l'API
            function send() {
                fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderToSend),
                })
                .then(function(res) {
                if (res.ok) {
                    return res.json();
                }
                })
                .then(function(value) {
                    localStorage.clear();
                    window.location = "confirmation.html?id=" + value.orderId;
                });
            };

            send();

        } else{

            console.log("erreur");

        };
    });
};
sendOrder();