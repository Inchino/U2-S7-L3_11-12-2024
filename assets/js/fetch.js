const booksWrapper = document.querySelector("#books-wrapper");
const shoppingCart = document.querySelector("#shopping-cart");

let outerBooks = [];
let shoppingCartList = JSON.parse(localStorage.getItem("shoppingCart")) || [];

/* Al caricamento della pagina viene creata la libreria dei film e la lista del carrello */
window.onload = () => {
  loadBooks();
  loadShoppingCart();
};
/* Importazione e lettura del nostro file json */
const loadBooks = () => {
  fetch("https://striveschool-api.herokuapp.com/books")
    .then((resp) => resp.json())
    .then((books) => {
      // using books right away here
      displayBooks(books);
      // Saving a reference for later use, without needing to fetch again
      outerBooks = books;
    })
    .catch((err) => console.error(err.message));
};

/* Creazione delle cards*/
function displayBooks(books) {
  booksWrapper.innerHTML = "";

/* Iterazione sull'array books*/  
  books.forEach((book) => {
    const isBookInCart =
      shoppingCartList.findIndex(
        (cartBook) => cartBook.title === book.title
      ) !== -1;  /* Creazione della lista del Carrello tramite il titolo del film */

      /* Creazione Bootstrap della Card che si differenziano tramite gli attributi dell'oggetto in json */
    booksWrapper.innerHTML += `
            <div class="col">
              <div class="card shadow-sm h-100 ${
                isBookInCart ? "selected" : ""
              }">
                <img src="${book.img}" class="img-fluid card-img-top" alt="${
      book.title
    }">
                <div class="card-body">
                  <h5 class="card-title">${book.title}</h5>
                  <p class="card-text badge rounded-pill bg-dark mb-2">${
                    book.category
                  }</p>
                  <p class="fs-4">${book.price}€</p>
                  <div>
                      <button class="btn btn-danger" onclick="addToCart(event, '${
                        book.asin
                      }')">Compra ora</button>
                      <button class="btn btn-outline-danger" onclick="skipMe(event)">
                        Scarta
                      </button>
                  </div>
                </div>
              </div>
            </div>
          `;
  });
}

/* Permette al bottone SCARTA di nascondere la colonna premuta e rimuoverla dalla libreria */
const skipMe = (event) => {
  event.target.closest(".col").remove();
};

/* Permette al bottone COMPRA ORA di aggiungere il film alla lista del Carrello*/
const addToCart = (event, asin) => {
  console.log(asin);
  // const book = outerBooks.filter( book => book.asin === asin)[0]
  const book = outerBooks.find((book) => book.asin === asin);
  /* Creazione di un array composto dai libri scelti*/
  shoppingCartList.push(book);
  console.log(shoppingCartList);
  /* Salvataggio dell'array di oggetti in local storage */
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCartList));

  loadShoppingCart();

  event.target.closest(".card").classList.add("selected");
};

/* Creazione dell'icona e della lista del Carrello*/
const loadShoppingCart = () => {
  shoppingCart.innerHTML = "<h3>Carrello</h3>";

  /* La lista è composta dalle cards rimpicciolite e con informazioni ridotte*/
  shoppingCartList.forEach((book) => {
    shoppingCart.innerHTML += `
            <div class="shopping-item">
              <div class="d-flex align-items-start gap-2">
                    <img src=${book.img}  class="img-fluid" width="60" />
                  <div class="flex-grow-1">
                      <p class="mb-2">
                        ${book.title}
                      </p>
                      <div class="d-flex justify-content-between">
                          <p class="fw-bold">
                            ${book.price}€
                          </p>
                          <div>
                              <div>
                                <button class="btn btn-danger" onclick="deleteItem('${book.asin}')">Elimina </button>
                              </div>
                          </div>
                      </div >
                  </div >
              </div >
            </div>
          `;
  });
};

/* Elimina gli elementi dalla lista del Carrello */
function deleteItem(asin) {
  const index = shoppingCartList.findIndex((book) => book.asin === asin);

  if (index !== -1) {
    shoppingCartList.splice(index, 1);
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCartList));
  }

  loadShoppingCart();
}
