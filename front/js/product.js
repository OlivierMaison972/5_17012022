const colorsMenu = document.querySelector("#colors");
const quantity = document.querySelector("#quantity");
const addToCartButton = document.querySelector("#addToCart");

// message de confirmations d'ajout au panier 
function confirmation()  {

        var result = confirm("Le produit a bien été ajouté au panier, continuer?");

        if(result)  {
            alert("OK");
        } else {
            alert("abandon");
        }
        document.querySelector("#addToCart") = `<button onclick="confirmation()"></button>`;
};
// ---------------selection de l'id du produit---------------------
const Search_url_id = window.location.search;
let params = new URLSearchParams(Search_url_id);
let id = params.get("id");
console.log(id);
// ---------------affichage du produit sélectionné----------------
fetch(`http://localhost:3000/api/products/${id}`)
        .then((data) => data.json())
        .then((jsonProduct) => {
                document.querySelector(".item__img").innerHTML = `<img src="${jsonProduct.imageUrl}" alt="${jsonProduct.altTxt}">`;
                document.querySelector("#price").innerHTML = `${jsonProduct.price}`;
                document.querySelector("#title").innerHTML = `${jsonProduct.name}`;
                document.querySelector("#description").innerHTML = `${jsonProduct.description}`;

                // ------------choix de la couleur du canapé------------

                for (let kanapColor of jsonProduct.colors) {
                        colorsMenu.innerHTML += `<option value="${kanapColor}">${kanapColor}</option>`;
                }

                // ----------ajouter un produit dans le panier ------------

                addToCartButton.addEventListener("click", function () {
                        if (quantity.value > 0 && colorsMenu.value !== "") {
                                let ProductsInCart = [];
                                let productAdded = {
                                        id: id,
                                        name: jsonProduct.name,
                                        color: colorsMenu.value,
                                        price: jsonProduct.price,
                                        imageUrl: jsonProduct.imageUrl,
                                        altTxt: jsonProduct.altTxt,
                                        quantity: quantity.value,
                                };
                                console.log(productAdded)
                                // ---Si le local storage est vide, on ajoute le produit-----
                                if (localStorage.getItem("products") == null) {
                                        ProductsInCart.push(productAdded);
                                        localStorage.setItem("products", JSON.stringify(ProductsInCart));

                                        
                                } else {
                                        //-----Si le local storage a déjà des éléments, on extrait le local storage dans le tableau---------
                                        ProductsInCart = JSON.parse(localStorage.getItem("products"));
                                        for (let item of ProductsInCart) {
                                                item.quantity = parseInt(item.quantity);
                                        }

                                        const productIndex = ProductsInCart.findIndex(
                                                (product) =>
                                                        product.id === productAdded.id &&
                                                        product.color === productAdded.color
                                        );

                                        if (productIndex === -1) {
                                                // Si aucun élément identique n'est présent, ajout d'un nouvel élément
                                                ProductsInCart.push(productAdded);
                                                localStorage.setItem("products", JSON.stringify(ProductsInCart));
                
                                        } else {
                                                // Si un élément identique est déjà présent, augmenter la quantité
                                                ProductsInCart[productIndex].quantity = parseInt(ProductsInCart[productIndex].quantity)
                                                productAdded.quantity = parseInt(productAdded.quantity)

                                                ProductsInCart[productIndex].quantity += productAdded.quantity;
                                                localStorage.setItem("products", JSON.stringify(ProductsInCart));
                                        }
                                        
                                }
                        }
                        
                confirmation();        
                });
                
        });


        
        
