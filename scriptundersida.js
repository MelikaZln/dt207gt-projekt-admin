
// Funktion för att logga ut admin  
function logoutUser() {
    localStorage.removeItem('token');
    window.location.href = "index.html";
}

// Funktion för att hämta JWT-token från localStorage
function getToken() {
    return localStorage.getItem('token');
}
// Funktion för att generera en "Ta bort" -knapp för menyalternativ
function createDeleteButton(itemId, category) {
    const button = document.createElement("button");
    button.textContent = "Ta bort";
    button.onclick = function() {
        deleteMenuItem(itemId, category);
    };
    return button;
}
        // Funktion för att ta bort menyalternativ
        function deleteMenuItem(id, category) {
            fetch(`http://localhost:3001/api/menu/${category}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Kunde inte ta bort menyalternativ.');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                getMenu();
            })
            .catch(error => {
                console.error(error);
            });
        }

// Funktion för att generera en "Uppdatera" -knapp för menyalternativ
function createUpdateButton(itemId, category) {
    const button = document.createElement("button");
    button.textContent = "Uppdatera";
    button.onclick = function() {
        updateMenuItem(itemId, category);
    };
    return button;
}


// Funktion för att uppdatera menyalternativ
function updateMenuItem(id, category) {
    // Hämta menyalternativet från servern baserat på dess ID och kategori
    fetch(`http://localhost:3001/api/menu/${category}/${id}`, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Kunde inte hämta menyalternativ med ID ${id} och kategori ${category}.`);
            }
            return response.json();
        })
        .then(menuItem => {
            // Visa en formulärlayout för att ändra menyalternativet med de aktuella värdena
            const name = prompt("Ange nytt namn:", menuItem.name);
            const price = prompt("Ange nytt pris:", menuItem.price);
            const ingredients = prompt("Ange nya ingredienser:", menuItem.ingredients);

            // Skicka ändringarna till servern och uppdatera menyn
            if (name !== null && price !== null && ingredients !== null) {
                fetch(`http://localhost:3001/api/menu/${category}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + getToken()
                    },
                    body: JSON.stringify({ name, price, ingredients })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Kunde inte uppdatera menyalternativ.');
                    }
                    return response.json();
                })
                .then(data => {
                    alert(data.message);
                    getMenu(); // Uppdatera menyn efter uppdatering
                })
                .catch(error => {
                    console.error(error);
                });
            }
        })
        .catch(error => {
            console.error(error);
        });
}


// Uppdatera getMenu-funktionen för att inkludera uppdatera-knappar för varje menyalternativ
function getMenu() {
    const categories = ['alkoholfritt', 'efterratt', 'forratt', 'huvudratt', 'vin'];
    categories.forEach(category => {
        fetch(`http://localhost:3001/api/menu/${category}`, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Kunde inte hämta menyalternativ för ${category}.`);
            }
            return response.json();
        })
        .then(menuItems => {
            const menuList = document.getElementById(`menu${capitalize(category)}`);
            if (!menuList) {
                console.error(`Element with id 'menu${capitalize(category)}' not found.`);
                return;
            }
            menuList.innerHTML = '';
            menuItems.forEach(item => {
                const listItem = document.createElement("li");
                const itemContainer = document.createElement("div");
                itemContainer.className = "menu-item";

                const nameElement = document.createElement("span");
                nameElement.className = "menu-item-name";
                nameElement.textContent = item.name;

                const ingredientsElement = document.createElement("span");
                ingredientsElement.className = "menu-item-ingredients";
                ingredientsElement.textContent = item.ingredients;

                const priceElement = document.createElement("span");
                priceElement.className = "menu-item-price";
                priceElement.textContent = ` ${item.price}Kr `;

                // Lägg till "Ta bort" - och "Uppdatera" -knappar för varje menyalternativ
                const deleteButton = createDeleteButton(item.id, category);
                const updateButton = createUpdateButton(item.id, category);
                itemContainer.appendChild(nameElement);
                itemContainer.appendChild(ingredientsElement);
                itemContainer.appendChild(priceElement);
                itemContainer.appendChild(deleteButton);
                itemContainer.appendChild(updateButton);

                listItem.appendChild(itemContainer);
                menuList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error(error);
        });
    });
}


// Funktion för att kontrollera om användaren är inloggad
function checkLoggedIn() {
    const token = getToken();
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "undersida.html" && !token) {
        window.location.href = "index.html";
    } else if (token) {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const username = tokenPayload.username;
        document.getElementById("welcomeMessage").textContent = "Hej " + username + ", välkommen till din sida!";
    }
}

// Funktion för att lägga till nytt menyalternativ
function addMenuItem() {
    const name = document.getElementById("menuName").value;
    const price = document.getElementById("menuPrice").value;
    const ingredients = document.getElementById("menuIngredients").value;
    const category = document.getElementById("menuCategory").value;

    fetch(`http://localhost:3001/api/menu/${category}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({ name, price, ingredients })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Kunde inte lägga till menyalternativ.');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        getMenu();
        document.getElementById("menuForm").reset();
    })
    .catch(error => {
        console.error(error);
    });
}



// Funktion för att hämta bokningar från servern och visa dem på sidan
function getBookings() {
    const token = getToken();
    if (token) {
        fetch('http://localhost:3001/api/bookings', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Kunde inte hämta bokningar.');
            }
            return response.json();
        })
        .then(bookings => {
            const bookingList = document.getElementById("bookingList");
            bookings.forEach(booking => {
                const listItem = document.createElement("li");
                listItem.textContent = `Namn: ${booking.name}, Antal gäster: ${booking.number_of_guests}, Telefon: ${booking.phone}, Datum: ${booking.date}, Tid: ${booking.time}`;
                bookingList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error(error);
        });
    }
}

// Hjälpfunktion för att kapitalisera första bokstaven
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Kör funktioner när sidan laddas
document.addEventListener("DOMContentLoaded", function() {
    getMenu();
    checkLoggedIn();
    getBookings();


    document.getElementById("menuForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addMenuItem();
    });
});
