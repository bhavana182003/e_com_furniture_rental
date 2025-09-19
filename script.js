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

// ---------- INIT CART ----------
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

// ---------- RENDER PRODUCTS ----------
function renderProducts() {
  productsGrid.innerHTML = "";
  products.forEach(product => {
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

// ---------- RENDER CART ----------
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
  cartBtn.style.display = "inline-block";
});

// ---------- TOAST ----------
function showToast(message, isError = false) {
  toast.innerText = message;
  toast.style.background = isError ? "#e74c3c" : "#2ecc71";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ---------- CHECKOUT WITH SUCCESS ANIMATION ----------
checkoutBtn.addEventListener("click", () => {
  if(cart.length === 0){
    showToast("Cart is empty!");
    return;
  }

  // Clear cart items
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  cartContainer.innerHTML = "";
  cartTotal.textContent = "Total Monthly Rent: Rs.0";
  updateCartCount();

  // Create success overlay inside drawer
  const overlay = document.createElement("div");
  overlay.classList.add("order-success");
  overlay.innerHTML = `
    <h2>Order Successful!</h2>
    <p>Thank you for your purchase.</p>
  `;
  cartDrawer.appendChild(overlay);

  // Animate overlay
  overlay.classList.add("show");

  setTimeout(() => {
    overlay.classList.remove("show");
    cartDrawer.removeChild(overlay); // remove overlay
    cartDrawer.classList.remove("open"); // close drawer
    cartBtn.style.display = "inline-block"; // keep cart button visible
  }, 2000);
});

// ---------- INITIALIZE ----------
renderProducts();
renderCart();
