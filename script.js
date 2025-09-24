// ---------- DATA ----------
const products = [
  { year: 2023, name: "Yellow Lawson - Single", category: "Sofa", rent: "Rs.600", img: "2.png", location: "Delhi" },
  { year: 2023, name: "Blue High Lawson - Single", category: "Sofa", rent: "Rs.700", img: "3.png", location: "Mumbai" },
  { year: 2022, name: "Off White Storage Cabinet", category: "Storage", rent: "Rs.500", img: "4.png", location: "Bangalore" },
  { year: 2022, name: "3 Drawer Storage Cabinet", category: "Storage", rent: "Rs.300", img: "5.png", location: "Chennai" },
  { year: 2024, name: "Royal Queen Bed", category: "Bed", rent: "Rs.1500", img: "6.png", location: "Delhi" },
  { year: 2024, name: "Maroon ChesterField", category: "Sofa", rent: "Rs.1500", img: "7.png", location: "Mumbai" },
  { year: 2023, name: "Dining Table - 6 Seater", category: "Table", rent: "Rs.1200", img: "8.jpg", location: "Hyderabad" },
  { year: 2023, name: "Office Chair", category: "Chair", rent: "Rs.400", img: "9.png", location: "Pune" },
  { year: 2021, name: "Bookshelf", category: "Storage", rent: "Rs.350", img: "10.png", location: "Kolkata" },
  { year: 2022, name: "Sofa Set", category: "Sofa", rent: "Rs.2000", img: "11.png", location: "Hyderabad" },
  { year: 2023, name: "Coffee Table", category: "Table", rent: "Rs.450", img: "12.png", location: "Mumbai" },
  { year: 2023, name: "Recliner Chair", category: "Chair", rent: "Rs.900", img: "13.png", location: "Bangalore" },
  { year: 2024, name: "Study Desk", category: "Table", rent: "Rs.600", img: "14.png", location: "Chennai" },
  { year: 2022, name: "Wooden Wardrobe", category: "Storage", rent: "Rs.1100", img: "15.png", location: "Hyderabad" },
  { year: 2021, name: "Single Mattress", category: "Bed", rent: "Rs.500", img: "16.png", location: "Pune" },
  { year: 2023, name: "Double Mattress", category: "Bed", rent: "Rs.800", img: "17.png", location: "Kolkata" },
  { year: 2024, name: "Corner Sofa", category: "Sofa", rent: "Rs.2200", img: "18.png", location: "Delhi" },
  { year: 2022, name: "Rocking Chair", category: "Chair", rent: "Rs.550", img: "19.png", location: "Mumbai" },
  { year: 2021, name: "Kids Bed", category: "Bed", rent: "Rs.700", img: "20.png", location: "Bangalore" },
  { year: 2024, name: "Modular Kitchen Rack", category: "Storage", rent: "Rs.1300", img: "21.png", location: "Chennai" },
  { year: 2023, name: "TV Stand", category: "Storage", rent: "Rs.750", img: "22.png", location: "Hyderabad" },
  { year: 2023, name: "Bean Bag", category: "Chair", rent: "Rs.300", img: "23.png", location: "Pune" },
  { year: 2022, name: "Shoe Rack", category: "Storage", rent: "Rs.400", img: "24.png", location: "Kolkata" }
];

// ---------- CART ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------- DOM ELEMENTS ----------
const productsGrid = document.getElementById("productsGrid");
const cartBtn = document.getElementById("cartToggle");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartContainer = document.getElementById("cartContainer");
const cartTotal = document.getElementById("cartTotal");
const closeCart = document.getElementById("closeCart");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");

// ---------- RENDER CATEGORIES ----------
const categories = ["All", "Sofa", "Bed", "Chair", "Table", "Storage"];
const categoryContainer = document.createElement("div");
categoryContainer.classList.add("categories");

categories.forEach(cat => {
  const box = document.createElement("div");
  box.classList.add("category-box");
  box.dataset.category = cat;
  box.innerHTML = `<h3>${cat}</h3>`; // Replace with image if you want
  categoryContainer.appendChild(box);

  box.addEventListener("click", () => {
    renderProducts(cat);
  });
});

document.querySelector(".availableOnRent").prepend(categoryContainer);

// ---------- RENDER PRODUCTS ----------
function renderProducts(filterCategory = "All") {
  productsGrid.innerHTML = "";

  const filteredProducts = products.filter(product => {
    if(filterCategory === "All") return true;
    return product.category === filterCategory;
  }).filter(product => {
    const query = searchInput.value.toLowerCase();
    return product.name.toLowerCase().includes(query) || product.location.toLowerCase().includes(query);
  });

  filteredProducts.forEach(product => {
    const inCart = cart.find(item => item.name === product.name);
    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = `
      <div class="box-img">
        <img src="${product.img}" alt="${product.name}">
      </div>
      <div class="product-meta">
        <span class="year">${product.year}</span>
        <span class="location">${product.location}</span>
      </div>
      <h3>${product.name}</h3>
      <h2>${product.rent} <span>/month</span></h2>
      <button class="btn ${inCart ? "added" : ""}">
        ${inCart ? "✔ Added" : "Rent Now"}
      </button>
    `;
    const btn = box.querySelector(".btn");
    btn.addEventListener("click", () => {
      const index = cart.findIndex(item => item.name === product.name);
      if(index === -1) {
        cart.push({ ...product, quantity: 1 });
        btn.innerText = "✔ Added";
        btn.classList.add("added");
        showToast(`${product.name} added to cart!`);
      } else {
        cart.splice(index, 1);
        btn.innerText = "Rent Now";
        btn.classList.remove("added");
        showToast(`${product.name} removed from cart!`, true);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
    productsGrid.appendChild(box);
  });
}

// ---------- SEARCH ----------
searchInput.addEventListener("input", () => {
  renderProducts(); // filtering happens inside renderProducts
});

// ---------- CART FUNCTIONS ----------
function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-details">
        <h4>${item.name}</h4>
        <p>Rent: ${item.rent}/month</p>
        <div class="quantity">
          <button class="minus">-</button>
          <span>${item.quantity}</span>
          <button class="plus">+</button>
        </div>
      </div>
      <button class="remove-item">&times;</button>
    `;

    const rentValue = parseInt(item.rent.replace("Rs.", ""));
    total += rentValue * item.quantity;

    div.querySelector(".plus").addEventListener("click", () => {
      item.quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      renderProducts();
    });

    div.querySelector(".minus").addEventListener("click", () => {
      if(item.quantity > 1) item.quantity--;
      else cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      renderProducts();
    });

    div.querySelector(".remove-item").addEventListener("click", () => {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      renderProducts();
    });

    cartContainer.appendChild(div);
  });

  cartTotal.textContent = `Total Monthly Rent: Rs.${total}`;
  updateCartCount();
}

function updateCartCount() {
  cartCount.textContent = cart.length;
  cartCount.style.display = cart.length === 0 ? "none" : "inline-block";
}

cartBtn.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartBtn.style.display = "none";
  renderCart();
});

closeCart.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  cartBtn.style.display = "inline-block";
});

// ---------- TOAST ----------
function showToast(message, isError = false) {
  toast.innerText = message;
  toast.style.background = isError ? "#e74c3c" : "#2ecc71";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ---------- CHECKOUT ----------
checkoutBtn.addEventListener("click", () => {
  if(cart.length === 0){
    showToast("Cart is empty!");
    return;
  }

  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  cartContainer.innerHTML = "";
  cartTotal.textContent = "Total Monthly Rent: Rs.0";
  updateCartCount();
  renderProducts();

  const overlay = document.createElement("div");
  overlay.classList.add("order-success");
  overlay.innerHTML = `<h2>Order Successful!</h2><p>Thank you for your purchase.</p>`;
  cartDrawer.appendChild(overlay);

  overlay.classList.add("show");

  setTimeout(() => {
    overlay.classList.remove("show");
    cartDrawer.removeChild(overlay);
    cartDrawer.classList.remove("open");
    cartBtn.style.display = "inline-block";
  }, 2000);
});

// ---------- INITIALIZE ----------
renderProducts();
renderCart();
