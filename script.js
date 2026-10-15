
/* SAMPLE SELLER DATA */

const sellers = {
    john: {
        username: "John Porkins",
        email: "john@example.com",
        bio: "I am buying and selling collectibles as a hobby. I have a variety of items for sale, including books and other collectibles.",
        facebook: "https://facebook.com/johnporkins",
        instagram: "@johnporkins",
        picture: "img/johnpk.jpg",
        products: [ 
            {
                name: "Harry Potter and the Philosopher's Stone",
                price: "₱1,000",
                image: "img/harrypotter.jpg",
                description: "J. K. Rowling · 1997" 
            },
            {
                name: "Eyes of the Dragon",
                price: "₱5,500",
                image: "img/eyesofthedragon.jpg",
                description: "Stephen King · 1984"
            }
        ]
    },

    maria: {
        username: "Mariandrea",
        email: "maria@example.com",
        bio: "I love cute things.",
        facebook: "https://facebook.com/mariandrea",
        instagram: "@mariareads",
        picture: "img/mariandrea.jpg",
        products: [
            {
                name: "Hatsune Miku: 1/7 Scale Figure",
                price: "₱18,500",
                image: "img/hatsunemiku.jpg",
                description: "Hatsune Miku 1/7 scale figure Yoneyama Mai by Good Smile Company."
            },
            {
                name: "Midnights| Taylor Swift",
                price: "₱3,050",
                image: "img/midnights.jpg",
                description: "Midnights| Taylor Swift, 2022."
            }
        ]
    },

    keith: {
        username: "Keith",
        email: "keith@example.com",
        bio: "Selling random shi,with my partner Veritas. Together we will farm aura.",
        facebook: "https://facebook.com/keith",
        instagram: "@keithos",
        picture: "img/sellerkeith.jpg",
        products: [
            {
                name: "The Master of Aura Farming",
                price: "₱999",
                image: "img/aurakeithcard.jpg",
                description: "Feel My Aura. The Master of Aura Farming photocard."
            },
            {
                name: "Monkey D Luffy: Alt Card",
                price: "₱226,132",
                image: "img/dluffy.jpg",
                description: "Monkey D Luffy: Alt Card. One Piece."
            }
        ]
    }
};

/* STORAGE KEYS */

const CART_KEY = "cart";
const SELLER_PRODUCTS_KEY = "lunarisSellerProducts";

let cart = loadCart();
let editMode = false;

/* SAFE LOCAL STORAGE HELPERS */

function readStorage(key, fallback = []) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value === null ? fallback : value;
    } catch (error) {
        console.error("Could not read storage:", key, error);
        return fallback;
    }
}

function loadCart() {
    const savedCart = readStorage(CART_KEY, []);
    return Array.isArray(savedCart) ? savedCart : [];
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadSellerProducts() {
    const products = readStorage(SELLER_PRODUCTS_KEY, []);
    return Array.isArray(products) ? products : [];
}

/* PRODUCT DETAILS MODAL */

function openProductModal(title, description, price, image) {
    const modal = document.getElementById("productModal");
    if (!modal) {
        console.error("Missing #productModal in product.html");
        return;
    }

    const titleElement = document.getElementById("modalTitle");
    const descriptionElement = document.getElementById("modalDescription");
    const priceElement = document.getElementById("modalPrice");
    const imageElement = document.getElementById("modalImage");
    const cartButton = document.getElementById("modalCartBtn");

    if (titleElement) titleElement.textContent = title;
    if (descriptionElement) descriptionElement.textContent = description;
    if (priceElement) priceElement.textContent = price;

    if (imageElement) {
        imageElement.src = image || "https://placehold.co/250x300";
        imageElement.alt = title;
    }

    if (cartButton) {
        cartButton.onclick = function () {
            addToCart(title, price, image);
            closeProductModal();
        };
    }

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
    const modal = document.getElementById("productModal");

    if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }
}

/* SELLER PROFILE MODAL */

function openSeller(sellerID) {
    const seller = sellers[sellerID];

    if (!seller) {
        alert("Seller not found.");
        console.error("Unknown seller ID:", sellerID);
        return;
    }

    const modal = document.getElementById("sellerModal");
    const username = document.getElementById("profileUsername");
    const bio = document.getElementById("profileBio");
    const email = document.getElementById("profileEmail");
    const picture = document.getElementById("profilePicture");
    const facebook = document.getElementById("profileFacebook");
    const instagram = document.getElementById("profileInstagram");
    const productContainer = document.getElementById("sellerProducts");

    if (!modal || !productContainer) {
        console.error(
            "Seller modal is missing. Add the seller modal HTML to product.html."
        );
        alert("Seller profile could not open. Please check product.html.");
        return;
    }

    if (username) username.textContent = seller.username;
    if (bio) bio.textContent = seller.bio;
    if (email) email.textContent = seller.email;

    if (picture) {
        picture.src = seller.picture;
        picture.alt = seller.username;
    }

    setSocialLink(facebook, seller.facebook);
    setSocialLink(instagram, seller.instagram);

    productContainer.replaceChildren();

    seller.products.forEach(function (product) {
        const card = document.createElement("div");
        card.className = "seller-profile-product";

        const image = document.createElement("img");
        image.src = product.image || "https://placehold.co/250x300";
        image.alt = product.name;
        image.loading = "lazy";

        const title = document.createElement("h4");
        title.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.description || "";

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = product.price;

        const contactButton = document.createElement("button");
        contactButton.type = "button";
        contactButton.textContent = "Contact Seller";
        contactButton.addEventListener("click", function () {
            contactSeller(seller.email);
        });

        const cartButton = document.createElement("button");
        cartButton.type = "button";
        cartButton.textContent = "Add to Cart";
        cartButton.addEventListener("click", function () {
            addToCart(product.name, product.price, product.image);
        });

        card.append(
            image,
            title,
            description,
            price,
            contactButton,
            cartButton
        );

        productContainer.appendChild(card);
    });

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
}

function setSocialLink(element, value) {
    if (!element) return;

    element.replaceChildren();

    if (!value) {
        element.textContent = "Not provided";
        return;
    }
    // Show real URLs as clickable links
    if (/^https?:\/\//i.test(value)) {
        const link = document.createElement("a");
        link.href = value;
        link.textContent = value;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        element.appendChild(link);
    } else {
        element.textContent = value;
    }
}

function closeSellerModal() {
    const modal = document.getElementById("sellerModal");

    if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }
}

/* CONTACT SELLER */

function contactSeller(email) {
    if (!email) {
        alert("This seller has not provided an email.");
        return;
    }

    window.location.href = "mailto:" + email;
}

/* SEARCH AND CATEGORY FILTERS */

function initializeProductFilters() {
    const searchInput = document.getElementById("productSearch");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const productCards = document.querySelectorAll(".product-card");

    let selectedCategory = "all";

    function filterProducts() {
        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        productCards.forEach(function (product) {
            const title =
                product.querySelector("h3")?.textContent.toLowerCase() || "";

            const description =
                product.querySelector("p:last-of-type")?.textContent.toLowerCase() || "";

            const category = product.dataset.category || "all";

            const matchesSearch =
                title.includes(searchTerm) ||
                description.includes(searchTerm);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            product.style.display =
                matchesSearch && matchesCategory ? "" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    categoryButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            categoryButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");
            selectedCategory = button.dataset.category || "all";

            filterProducts();
        });
    });
}

/* DEMO LOGIN
   This is not real authentication
*/

function loginUser(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById("loginEmail");

    if (!emailInput || !emailInput.value.trim()) {
        alert("Please enter your email.");
        return;
    }

    const email = emailInput.value.trim();

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUserEmail", email);

    alert("Demo login successful for:\n" + email);

    const redirect = localStorage.getItem("redirectAfterLogin");

    if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirect;
    }
}

/* DEMO SELLER REGISTRATION */

function registerSeller(event) {
    if (event) event.preventDefault();

    const usernameInput = document.getElementById("registerUsername");
    const emailInput = document.getElementById("registerEmail");

    if (
        !usernameInput ||
        !emailInput ||
        !usernameInput.value.trim() ||
        !emailInput.value.trim()
    ) {
        alert("Please enter your username and email.");
        return;
    }

    alert(
        "Demo registration only.\n\n" +
        "Username: " + usernameInput.value.trim() + "\n" +
        "Email: " + emailInput.value.trim() + "\n\n" +
        "No account has been saved to a real database."
    );
}

/* SAVE PROFILE (SAMPLE SELLERS ONLY) */

function saveProfile(event) {
    if (event) event.preventDefault();

    const usernameInput = document.getElementById("editUsername");
    const bioInput = document.getElementById("editBio");

    if (!usernameInput || !bioInput) {
        alert("Profile form fields are missing.");
        return;
    }

    const username = usernameInput.value.trim();
    const bio = bioInput.value.trim();
    const email = localStorage.getItem("currentUserEmail");

    if (!username) {
        alert("Please enter a username.");
        return;
    }

    const sellerID = Object.keys(sellers).find(function (id) {
        return sellers[id].email === email;
    });

    if (!sellerID) {
        alert(
            "This demo profile is not linked to a sample seller. " +
            "A database is needed for real user profiles."
        );
        return;
    }

    sellers[sellerID].username = username;
    sellers[sellerID].bio = bio;

    alert("Profile updated for this page session.");
}

/* CART */

function addToCart(name, price, image = "") {
    if (!name || price === undefined || price === null) {
        alert("This product cannot be added to the cart.");
        return;
    }

    cart.push({
        id: Date.now().toString() + "-" + Math.random().toString(36).slice(2),
        name: name,
        price: price,
        image: image
    });

    saveCart();
    updateCart();

    alert(name + " added to cart!");
}

function toggleCartEdit() {
    editMode = !editMode;

    const controls = document.getElementById("cartEditControls");

    if (controls) {
        controls.style.display = editMode ? "flex" : "none";
    }

    updateCart();
}

function removeSelectedItems() {
    const selected = document.querySelectorAll(".cart-item-select:checked");

    const indexes = Array.from(selected)
        .map(function (item) {
            return Number(item.dataset.index);
        })
        .filter(Number.isInteger)
        .sort(function (a, b) {
            return b - a;
        });

    indexes.forEach(function (index) {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
        }
    });

    saveCart();
    updateCart();
}

function updateCart() {
    const counter = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");

    if (counter) {
        counter.textContent = cart.length;
    }

  
    function getPrice(price) {
        return Number(
            String(price ?? "").replace(/[^\d.-]/g, "")
        ) || 0;
    }

    const total = cart.reduce(function (sum, item) {
        return sum + getPrice(item.price);
    }, 0);

    if (totalElement) {
        totalElement.textContent = total.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2
        });
    }

    if (!cartItems) return;

    cartItems.replaceChildren();

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-cart";
        emptyMessage.textContent = "Your cart is empty.";
        cartItems.appendChild(emptyMessage);
        return;
    }

    cart.forEach(function (item, index) {
        const card = document.createElement("div");
        card.className = "cart-item";

     
        const imageWrap = document.createElement("div");
        imageWrap.className = "cart-item-image-wrap";

        if (editMode) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "cart-item-select";
            checkbox.dataset.index = index;
            checkbox.setAttribute(
                "aria-label",
                "Select " + item.name + " for removal"
            );
            imageWrap.appendChild(checkbox);
        }

        const image = document.createElement("img");
        image.className = "cart-item-image";
        image.src = item.image || "https://placehold.co/160x160?text=No+Image";
        image.alt = item.name || "Product image";
        image.loading = "lazy";

        image.onerror = function () {
            this.onerror = null;
            this.src = "https://placehold.co/160x160?text=No+Image";
        };

        imageWrap.appendChild(image);


        const info = document.createElement("div");
        info.className = "cart-item-info";

        const title = document.createElement("h3");
        title.textContent = item.name || "Unnamed Product";

        const description = document.createElement("p");
        description.className = "cart-item-description";
        description.textContent = item.description || "Collectible item";

        info.append(title, description);

        // Far right: price
        const price = document.createElement("div");
        price.className = "cart-item-price";
        price.textContent = getPrice(item.price).toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2
        });

        card.append(imageWrap, info, price);
        cartItems.appendChild(card);
    });
}

/* CHECKOUT */

function handleCheckout() {
    const message = document.getElementById("checkoutMessage");

    if (cart.length === 0) {
        if (message) {
            message.textContent =
                "Your cart is empty. Add a product before checking out.";
            message.style.display = "block";
        } else {
            alert("Your cart is empty.");
        }
        return;
    }

    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (!isLoggedIn) {
        if (message) {
            message.textContent =
                "Please log in before checking out.";
            message.style.display = "block";
        }

        localStorage.setItem("redirectAfterLogin", "checkout.html");
        window.location.href = "user-login.html";
        return;
    }

    window.location.href = "checkout.html";
}

/* CLOSE MODALS AND STARTUP */

document.addEventListener("click", function (event) {
    const productModal = document.getElementById("productModal");
    const sellerModal = document.getElementById("sellerModal");

    if (productModal && event.target === productModal) {
        closeProductModal();
    }

    if (sellerModal && event.target === sellerModal) {
        closeSellerModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeProductModal();
        closeSellerModal();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    initializeProductFilters();
    updateCart();
});

const video = document.getElementById("aboutSupportVideo");

if (video) {
    video.volume = 0.8;
}

document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("aboutSupportVideo");

  if (video) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    video.play().catch((error) => {
      console.log("Video autoplay was prevented:", error);
    });
  }
});
