/* ===== CART PAGE SCRIPT ===== */

// Render cart table with enlargeable product images
function renderCart() {
    const tbody = document.querySelector('#cartTable tbody');
    if (!tbody) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    tbody.innerHTML = '';

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
        const grandTotal = document.getElementById('grandTotal');
        if (grandTotal) grandTotal.textContent = '0.00';
        updateCartCount();
        return;
    }

    let grandTotalAmount = 0;

    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        grandTotalAmount += total;

        const tr = document.createElement('tr');

        // Image (clickable for enlarge)
        const imgTd = document.createElement('td');
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.width = 80;
        img.classList.add("cart-img");
        img.style.cursor = "pointer";
        img.onerror = () => { img.src = 'images/placeholder.png'; };
        img.addEventListener("click", () => openCartLightbox(item));
        imgTd.appendChild(img);

        // Name (include size + color)
        const nameTd = document.createElement('td');
        nameTd.textContent = `${item.name} (${item.size || 'One Size'}, ${item.color || 'Default'})`;

        // Price
        const priceTd = document.createElement('td');
        priceTd.textContent = `₦${item.price.toFixed(2)}`;

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
            renderCart();
        });
        qtyTd.appendChild(qtyInput);

        // Total
        const totalTd = document.createElement('td');
        totalTd.textContent = `₦${total.toFixed(2)}`;

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

        tr.append(imgTd, nameTd, priceTd, qtyTd, totalTd, removeTd);
        tbody.appendChild(tr);
    });

    const grandTotal = document.getElementById('grandTotal');
    if (grandTotal) grandTotal.textContent = grandTotalAmount.toFixed(2);

    updateCartCount();
}

/* ===== LIGHTBOX FOR CART ===== */
function openCartLightbox(item) {
    let lightbox = document.getElementById("cart-lightbox");
    if (!lightbox) {
        lightbox = document.createElement("div");
        lightbox.id = "cart-lightbox";
        lightbox.style.position = "fixed";
        lightbox.style.top = 0;
        lightbox.style.left = 0;
        lightbox.style.width = "100%";
        lightbox.style.height = "100%";
        lightbox.style.background = "rgba(0,0,0,0.8)";
        lightbox.style.display = "flex";
        lightbox.style.alignItems = "center";
        lightbox.style.justifyContent = "center";
        lightbox.style.zIndex = "9999";
        lightbox.innerHTML = `
        <span id="cart-lightbox-close" 
              style="position:absolute;top:20px;right:30px;font-size:40px;color:white;cursor:pointer">&times;</span>
        <img id="cart-lightbox-img" src="" 
             style="max-width:90%;max-height:90%;border-radius:10px;box-shadow:0 0 20px #000"/>
        `;
        document.body.appendChild(lightbox);

        // Close
        document.getElementById("cart-lightbox-close").addEventListener("click", () => {
            lightbox.style.display = "none";
        });

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) lightbox.style.display = "none";
        });
    }

    const imgEl = document.getElementById("cart-lightbox-img");
    imgEl.src = item.image;
    lightbox.style.display = "flex";
}

/* ===== CART UTILITIES ===== */
function clearCart() {
    localStorage.removeItem('cart');
    renderCart();
}

function proceedToPayment() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    if (!checkAuth()) {
        window.location.href = 'login.html';
        return;
    }
    window.location.href = 'bankdetails.html';
}

// Keep cart synced across tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') renderCart();
});

/* ===== NAVIGATION + DROPDOWNS (moved into cart.js) =====
   This code does two things:
   - toggleMenu() toggles the mobile menu (class "active" on nav ul)
   - toggleDropdown(e) toggles the dropdown, and on mobile it will attempt to
     scroll the opened dropdown into view if it's lower than the viewport.
*/

function isMobileView() {
    return window.innerWidth <= 768;
}

function toggleMenu() {
    const ul = document.querySelector('nav ul');
    if (!ul) return;
    ul.classList.toggle('active');

    // If menu opened, ensure it is visible (scroll a little if needed)
    if (ul.classList.contains('active')) {
        // Small delay to allow layout to update, then ensure menu visible
        setTimeout(() => {
            const nav = document.querySelector('nav');
            if (nav) nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
    }
}

function toggleDropdown(e) {
    // If someone passed an Event, handle mobile interaction
    // If not (called programmatically), do nothing
    if (!e) return;
    // Only intercept default for mobile - keep desktop hover behavior
    if (!isMobileView()) return;

    e.preventDefault();
    e.stopPropagation();

    const li = e.target.closest('.dropdown');
    if (!li) return;

    // Close other dropdowns
    document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== li) d.classList.remove('active');
    });

    // Toggle this one
    li.classList.toggle('active');

    // If opening, ensure its content is visible (scroll it into view if needed)
    if (li.classList.contains('active')) {
        const dd = li.querySelector('.dropdown-content');
        if (dd) {
            // allow layout to settle then compute bounding and scroll if needed
            setTimeout(() => {
                try {
                    const rect = dd.getBoundingClientRect();
                    // if bottom of dropdown content is below viewport, scroll down slightly
                    if (rect.bottom > window.innerHeight) {
                        const extra = rect.bottom - window.innerHeight + 12; // small gap
                        window.scrollBy({ top: extra, behavior: 'smooth' });
                    }
                } catch (err) {
                    // fail silently
                }
            }, 180);
        }
    }
}

// Close any open dropdowns if clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    }
});

/* ===== INIT CART PAGE ===== */
document.addEventListener("DOMContentLoaded", () => {
    renderCart();

    // Delegate click on cart table images to open lightbox (fallback)
    const table = document.getElementById('cartTable');
    if (table) {
        table.addEventListener('click', function (e) {
            if (e.target && e.target.tagName === 'IMG') {
                const src = e.target.src;
                openCartLightbox({ image: src });
            }
        });
    }

    // Wire up any existing inline triggers (if your HTML uses onclick attributes)
    // so they still work even if you remove inline handlers in future:
    document.querySelectorAll('a.dropdown-toggle').forEach(a => {
        a.addEventListener('click', toggleDropdown);
    });

    // make sure cart badge updated on load
    if (typeof updateCartCount === 'function') updateCartCount();
});
