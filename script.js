// ---------- DATA ----------
const products = [
  { year: 2023, name: "Yellow Lawson - Single", rent: "Rs.600", img: "2.png", location: "Delhi" },
  { year: 2023, name: "Blue High Lawson - Single", rent: "Rs.700", img: "3.png", location: "Mumbai" },
  { year: 2022, name: "Off White Storage Cabinet", rent: "Rs.500", img: "4.png", location: "Bangalore" },
  { year: 2022, name: "3 Drawer Storage Cabinet", rent: "Rs.300", img: "5.png", location: "Chennai" },
  { year: 2024, name: "Royal Queen Bed", rent: "Rs.1500", img: "6.png", location: "Delhi" },
  { year: 2024, name: "Maroon ChesterField", rent: "Rs.1500", img: "7.png", location: "Mumbai" },
  { year: 2023, name: "Dining Table - 6 Seater", rent: "Rs.1200", img: "8.jpg", location: "Hyderabad" },
  { year: 2023, name: "Office Chair", rent: "Rs.400", img: "9.png", location: "Pune" },
  { year: 2021, name: "Bookshelf", rent: "Rs.350", img: "10.png", location: "Kolkata" },
  { year: 2022, name: "Sofa Set", rent: "Rs.2000", img: "11.png", location: "Delhi" },
  { year: 2023, name: "Coffee Table", rent: "Rs.450", img: "12.png", location: "Mumbai" },
  { year: 2023, name: "Recliner Chair", rent: "Rs.900", img: "13.png", location: "Bangalore" },
  { year: 2024, name: "Study Desk", rent: "Rs.600", img: "14.png", location: "Chennai" },
  { year: 2022, name: "Wooden Wardrobe", rent: "Rs.1100", img: "15.png", location: "Hyderabad" },
  { year: 2021, name: "Single Mattress", rent: "Rs.500", img: "16.png", location: "Pune" },
  { year: 2023, name: "Double Mattress", rent: "Rs.800", img: "17.png", location: "Kolkata" },
  { year: 2024, name: "Corner Sofa", rent: "Rs.2200", img: "18.png", location: "Delhi" },
  { year: 2022, name: "Rocking Chair", rent: "Rs.550", img: "19.png", location: "Mumbai" },
  { year: 2021, name: "Kids Bed", rent: "Rs.700", img: "20.png", location: "Bangalore" },
  { year: 2024, name: "Modular Kitchen Rack", rent: "Rs.1300", img: "21.png", location: "Chennai" },
  { year: 2023, name: "TV Stand", rent: "Rs.750", img: "22.png", location: "Hyderabad" },
  { year: 2023, name: "Bean Bag", rent: "Rs.300", img: "23.png", location: "Pune" },
  { year: 2022, name: "Shoe Rack", rent: "Rs.400", img: "24.png", location: "Kolkata" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------- DOM ELEMENTS ----------
const productsGrid = document.getElementById("productsGrid");
const cartBtn = document.getElementById("cartToggle");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartContainer = document.getElementById("cartContainer");
const cartTotal = document.getElementById("cartTotal");
const closeCart = document.getElementById("closeCart");
const toast = document.getElementById("toast");
const signupModal = document.getElementById("signupModal");
const signinModal = document.getElementById("signinModal");
const signupBtn = document.querySelector(".transparent-btn");
const signinBtn = document.querySelector(".blue-btn");
const signupClose = document.getElementById("signupClose");
const signinClose = document.getElementById("signinClose");
const locationButtons = document.querySelectorAll("#locationFilter button");
const searchInput = document.getElementById("searchLocation");
const searchBtn = document.getElementById("searchBtn");

// ---------- FILTER FUNCTION ----------
function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();
  let filtered = products;

  if (query) filtered = filtered.filter(p => p.location.toLowerCase().includes(query));

  const activeButton = document.querySelector("#locationFilter button.active");
  if (activeButton && activeButton.dataset.location !== "All") {
    filtered = filtered.filter(p => p.location === activeButton.dataset.location);
  }

  renderProducts(filtered);
}

// Search input realtime
searchInput.addEventListener("input", filterProducts);

// Location buttons
locationButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    locationButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterProducts();
  });
});

// ---------- PRODUCT RENDER ----------
function renderProducts(list = products) {
  productsGrid.innerHTML = "";

  list.forEach(product => {
    const box = document.createElement("div");
    box.classList.add("box");

    const inCart = cart.find(item => item.name === product.name);

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

      if (index === -1) {
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

// ---------- CART RENDER ----------
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
      if (item.quantity > 1) item.quantity--;
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

  cartTotal.innerText = `Total Monthly Rent: Rs.${total}`;
  updateCartCount();
}

// ---------- CART COUNT ----------
function updateCartCount() {
  cartCount.textContent = cart.length;
  cartCount.style.display = cart.length === 0 ? "none" : "inline-block";
}

// ---------- CART TOGGLE ----------
cartBtn.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartBtn.style.display = "none";
  renderCart();
});

closeCart.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  cartBtn.style.display = "block";
});

// ---------- TOAST ----------
function showToast(message, isError = false) {
  toast.innerText = message;
  toast.style.background = isError ? "#e74c3c" : "#2ecc71";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ---------- MODALS ----------
signupBtn.onclick = () => signupModal.style.display = "block";
signinBtn.onclick = () => signinModal.style.display = "block";
signupClose.onclick = () => signupModal.style.display = "none";
signinClose.onclick = () => signinModal.style.display = "none";
window.onclick = (e) => {
  if (e.target === signupModal) signupModal.style.display = "none";
  if (e.target === signinModal) signinModal.style.display = "none";
};

// ---------- SIGNUP ----------
document.querySelector("#signupModal form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = this.querySelector('input[type="text"]').value;
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some(u => u.email === email)) { showToast("Email already registered!", true); return; }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  showToast("Sign Up Successful!");
  this.reset();
  setTimeout(() => signupModal.style.display = "none", 1500);
});

// ---------- SIGNIN ----------
document.querySelector("#signinModal form").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    document.getElementById("welcomeUser").innerText = `Hi, ${user.name}`;
    document.getElementById("logoutBtn").style.display = "inline-block";
    showToast(`Welcome back, ${user.name}!`);
    this.reset();
    signinModal.style.display = "none";
  } else showToast("Invalid email or password!", true);
});

// ---------- LOGOUT ----------
document.getElementById("logoutBtn").addEventListener("click", () => {
  document.getElementById("welcomeUser").innerText = "";
  document.getElementById("logoutBtn").style.display = "none";
  showToast("You have logged out!");
});

// ---------- INIT ----------
renderProducts();
renderCart();
