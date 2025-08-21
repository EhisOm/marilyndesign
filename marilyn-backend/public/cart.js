// // cart.js

// // Add item to cart
// function addToCart(item) {
//     if (!item.id) {
//         // Generate a unique id if missing
//         item.id = Date.now() + Math.random().toString(16).slice(2);
//     }

//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const existingItem = cart.find(i => i.id === item.id);

//     if (existingItem) {
//         existingItem.quantity += 1;
//     } else {
//         cart.push({
//             ...item,
//             image: item.image || 'images/placeholder.png',
//             quantity: 1
//         });
//     }

//     localStorage.setItem('cart', JSON.stringify(cart));
//     alert(`${item.name} added to cart.`);

//     if (document.querySelector('#cart-table')) {
//         renderCart();
//     }
// }

// // Render cart
// function renderCart() {
//     const tbody = document.querySelector('#cart-table tbody');
//     if (!tbody) return;

//     const cart = JSON.parse(localStorage.getItem('cart')) || [];

//     tbody.innerHTML = '';

//     if (cart.length === 0) {
//         tbody.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
//         document.getElementById('total-quantity').textContent = 0;
//         document.getElementById('total-price').textContent = '0.00';
//         return;
//     }

//     let totalQuantity = 0;
//     let totalPrice = 0;

//     cart.forEach((item, index) => {
//         totalQuantity += item.quantity;
//         totalPrice += item.quantity * item.price;

//         const tr = document.createElement('tr');

//         // Image
//         const imgTd = document.createElement('td');
//         const img = document.createElement('img');
//         img.src = item.image;
//         img.alt = item.name;
//         img.width = 60;
//         img.onerror = () => { img.src = 'images/placeholder.png'; };
//         imgTd.appendChild(img);

//         // Name
//         const nameTd = document.createElement('td');
//         nameTd.textContent = item.name;

//         // Price
//         const priceTd = document.createElement('td');
//         priceTd.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

//         // Quantity
//         const qtyTd = document.createElement('td');
//         const qtyInput = document.createElement('input');
//         qtyInput.type = 'number';
//         qtyInput.min = 1;
//         qtyInput.value = item.quantity;

//         qtyInput.addEventListener('input', e => {
//             let newQty = parseInt(e.target.value);
//             if (isNaN(newQty) || newQty < 1) newQty = 1;

//             totalQuantity = totalQuantity - item.quantity + newQty;
//             totalPrice = totalPrice - (item.quantity * item.price) + (newQty * item.price);

//             item.quantity = newQty;
//             localStorage.setItem('cart', JSON.stringify(cart));

//             priceTd.textContent = `$${(newQty * item.price).toFixed(2)}`;
//             document.getElementById('total-quantity').textContent = totalQuantity;
//             document.getElementById('total-price').textContent = totalPrice.toFixed(2);
//         });

//         qtyTd.appendChild(qtyInput);

//         // Remove
//         const removeTd = document.createElement('td');
//         const removeBtn = document.createElement('span');
//         removeBtn.textContent = '×';
//         removeBtn.className = 'remove-btn';
//         removeBtn.addEventListener('click', () => {
//             totalQuantity -= item.quantity;
//             totalPrice -= item.quantity * item.price;

//             cart.splice(index, 1);
//             localStorage.setItem('cart', JSON.stringify(cart));

//             tr.remove();

//             document.getElementById('total-quantity').textContent = totalQuantity;
//             document.getElementById('total-price').textContent = totalPrice.toFixed(2);

//             if (cart.length === 0) {
//                 tbody.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
//             }
//         });
//         removeTd.appendChild(removeBtn);

//         tr.append(imgTd, nameTd, qtyTd, priceTd, removeTd);
//         tbody.appendChild(tr);
//     });

//     document.getElementById('total-quantity').textContent = totalQuantity;
//     document.getElementById('total-price').textContent = totalPrice.toFixed(2);
// }

// // Initialize cart on page load
// document.addEventListener('DOMContentLoaded', () => {
//     if (document.querySelector('#cart-table')) renderCart();

//     const makePaymentBtn = document.getElementById('makePaymentBtn');
//     if (makePaymentBtn) {
//         makePaymentBtn.addEventListener('click', () => {
//             const cart = JSON.parse(localStorage.getItem('cart')) || [];
//             if (cart.length === 0) {
//                 alert('Your cart is empty. Add items before making a payment.');
//                 return;
//             }
//             window.location.href = 'bankdetails.html';
//         });
//     }
// });










// cart.js

// ----- Add item to cart -----
function addToCart(item) {
    if (!item.id) {
        // Generate a unique id if missing
        item.id = Date.now() + Math.random().toString(16).slice(2);
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(i => i.name === item.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            price: parseFloat(item.price) || 0, // ensure price is number
            image: item.image || 'images/placeholder.png',
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${item.name} added to cart.`);

    if (document.querySelector('#cart-table')) {
        renderCart();
    }
}

// ----- Update cart icon count -----
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = totalCount;
}

// ----- Render cart table -----
function renderCart() {
    const tbody = document.querySelector('#cart-table tbody');
    if (!tbody) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    tbody.innerHTML = '';

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
        document.getElementById('total-quantity').textContent = 0;
        document.getElementById('total-price').textContent = '0.00';
        updateCartCount();
        return;
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalQuantity += item.quantity;
        totalPrice += item.quantity * item.price;

        const tr = document.createElement('tr');

        // Image
        const imgTd = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.width = 80;
        img.onerror = () => { img.src = 'images/placeholder.png'; };
        imgTd.appendChild(img);

        // Name
        const nameTd = document.createElement('td');
        nameTd.textContent = item.name;

        // Quantity
        const qtyTd = document.createElement('td');
        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = 1;
        qtyInput.value = item.quantity;
        qtyInput.addEventListener('input', e => {
            let newQty = parseInt(e.target.value);
            if (isNaN(newQty) || newQty < 1) newQty = 1;

            item.quantity = newQty;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart(); // re-render table and totals
        });
        qtyTd.appendChild(qtyInput);

        // Price
        const priceTd = document.createElement('td');
        priceTd.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        // Remove
        const removeTd = document.createElement('td');
        const removeBtn = document.createElement('span');
        removeBtn.textContent = '×';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', () => {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
        removeTd.appendChild(removeBtn);

        tr.append(imgTd, nameTd, qtyTd, priceTd, removeTd);
        tbody.appendChild(tr);
    });

    document.getElementById('total-quantity').textContent = totalQuantity;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
    updateCartCount();
}

// ----- Initialize cart on page load -----
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#cart-table')) renderCart();
    updateCartCount();

    const makePaymentBtn = document.getElementById('makePaymentBtn');
    if (makePaymentBtn) {
        makePaymentBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty. Add items before making a payment.');
                return;
            }
            window.location.href = 'bankdetails.html';
        });
    }
});
