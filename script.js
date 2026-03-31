// 1. Cart State (Array to hold items)
let cart = JSON.parse(localStorage.getItem('userCart')) || [];

// 2. Elements Selectors
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.querySelector('.cart-items');
const subtotalElement = document.querySelector('.subtotal span:last-child');

// --- FUNCTIONS ---

// A. Cart ko Screen par dikhana (Render)
function renderCart() {
    cartItemsContainer.innerHTML = ''; // Pehle list saaf karein
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
        subtotalElement.innerText = 'Rs. 0';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            cartItemsContainer.innerHTML += `
                <div class="cart-item" style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center;">
                    <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border: 1px solid #333;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 14px; margin: 0;">${item.name}</h4>
                        <p style="font-size: 13px; color: #888; margin: 5px 0;">Rs. ${item.price}</p>
                        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4444; cursor:pointer; font-size:12px; padding:0;">Remove</button>
                    </div>
                </div>
            `;
        });
        subtotalElement.innerText = `Rs. ${total.toLocaleString()}`;
    }
    
    // LocalStorage update karein taaki Checkout page data utha sake
    localStorage.setItem('userCart', JSON.stringify(cart));
}

// B. Naya Item Add Karna
// Naya addToCart function (Quantity logic ke sath)
function addToCart(name, price, image) {
    // Check karein kya item pehle se cart mein hai?
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1; // Agar hai, toh sirf quantity +1
    } else {
        cart.push({ name, price: parseInt(price), image, quantity: 1 }); // Naya item
    }
    
    localStorage.setItem('userCart', JSON.stringify(cart));
    renderCart();
    openCart();
}

// Cart Drawer mein +/- buttons dikhane ke liye renderCart update:
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += (item.price * item.quantity);
        cartItemsContainer.innerHTML += `
            <div class="cart-item" style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
                <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover;">
                <div style="flex: 1;">
                    <h4 style="margin: 0; font-size: 13px;">${item.name}</h4>
                    <div style="display: flex; gap: 10px; align-items: center; margin-top: 5px;">
                        <button onclick="changeQuantity(${index}, -1)" style="border:none; cursor:pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="border:none; cursor:pointer;">+</button>
                    </div>
                </div>
                <p style="font-size: 13px;">Rs. ${item.price * item.quantity}</p>
            </div>
        `;
    });
    subtotalElement.innerText = `Rs. ${total.toLocaleString()}`;
}

// Quantity change karne ka function
window.changeQuantity = function(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1); // 0 hone par remove
    renderCart();
    localStorage.setItem('userCart', JSON.stringify(cart));
};

// C. Item Remove Karna
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    renderCart();
};

// D. Drawer Open/Close Logic
function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.style.display = 'block';
}

function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.style.display = 'none';
}

// --- EVENT LISTENERS ---

// 1. Add to Cart Buttons par click
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const image = button.getAttribute('data-image'); // Button ke data-image se link uthayega
        
        addToCart(name, price, image);
    });
});

// 2. Navbar Cart Icon click
document.getElementById('cart-icon-btn').addEventListener('click', openCart);

// 3. Close Button click
document.getElementById('close-cart').addEventListener('click', closeCart);

// 4. Overlay (Bahar click karne par) click
cart