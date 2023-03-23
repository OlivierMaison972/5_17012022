//----------------- fonction d'affiohage des produits --------
fetch('http://localhost:3000/api/products')
    .then( data => data.json() )
    .then( jsonListProducts => {    
        for(let article of jsonListProducts){
            document.querySelector("#items").innerHTML += `
                <a href="./product.html?id=${article._id}">
                    <article>
                        <img src="${article.imageUrl}" alt="${article.altTxt}">
                        <h3 class="productName">${article.name}</h3>
                        <p class="productDescription">${article.description}</p>
                    </article>
               </a>`;
        }
    });

    
