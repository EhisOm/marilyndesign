

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-reg');
    const messageElem = document.getElementById('message');  // cache the element once

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                title: document.getElementById('title').value,
                name: document.getElementById('name').value,
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                phone: document.getElementById('phone').value,
                dob: document.getElementById('dob').value,
            };

            try {
                const res = await fetch('http://localhost:5000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await res.json();
                // Show message in alert or on page
                alert(result.message);
                if (messageElem) messageElem.textContent = result.message;
            } catch (err) {
                console.error('Error:', err);
                if (messageElem) messageElem.textContent = 'Something went wrong.';
            }
        });
    }
});






// ORIGINAL SCRIPT JS CODE 



// /* ===== CART ===== */

// // Add item to cart
// function addToCart(item) {
//     if (!item.id) {
//         item.id = Date.now() + Math.random().toString(16).slice(2);
//     }

//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const existingItem = cart.find(i => i.name === item.name && i.size === item.size && i.color === item.color);

//     if (existingItem) {
//         existingItem.quantity += 1;
//     } else {
//         cart.push({
//             ...item,
//             price: parseFloat(item.price) || 0,
//             image: item.image || 'images/placeholder.png',
//             quantity: 1
//         });
//     }

//     localStorage.setItem('cart', JSON.stringify(cart));
//     updateCartCount();
//     alert(`${item.name} (${item.size || 'One Size'}, ${item.color}) added to cart.`);

//     if (document.querySelector('#cartTable')) {
//         renderCart();
//     }
// }

// // Update cart badge/count
// function updateCartCount() {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
//     const countEl = document.getElementById('cart-count') || document.getElementById('cartCount');
//     if (countEl) countEl.textContent = totalCount;
// }

// // Render cart table
// function renderCart() {
//     const tbody = document.querySelector('#cartTable tbody');
//     if (!tbody) return;

//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     tbody.innerHTML = '';

//     if (cart.length === 0) {
//         tbody.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
//         const grandTotal = document.getElementById('grandTotal');
//         if (grandTotal) grandTotal.textContent = '0.00';
//         updateCartCount();
//         return;
//     }

//     let grandTotalAmount = 0;

//     cart.forEach((item, index) => {
//         const total = item.price * item.quantity;
//         grandTotalAmount += total;

//         const tr = document.createElement('tr');

//         // Image
//         const imgTd = document.createElement('td');
//         const img = document.createElement('img');
//         img.src = item.image;
//         img.alt = item.name;
//         img.width = 80;
//         img.onerror = () => { img.src = 'images/placeholder.png'; };
//         imgTd.appendChild(img);

//         // Name
//         const nameTd = document.createElement('td');
//         nameTd.textContent = item.name;

//         // Price
//         const priceTd = document.createElement('td');
//         priceTd.textContent = `₦${item.price.toFixed(2)}`;

//         // Quantity
//         const qtyTd = document.createElement('td');
//         const qtyInput = document.createElement('input');
//         qtyInput.type = 'number';
//         qtyInput.min = 1;
//         qtyInput.value = item.quantity;
//         qtyInput.addEventListener('input', e => {
//             let newQty = parseInt(e.target.value);
//             if (isNaN(newQty) || newQty < 1) newQty = 1;
//             item.quantity = newQty;
//             localStorage.setItem('cart', JSON.stringify(cart));
//             renderCart();
//         });
//         qtyTd.appendChild(qtyInput);

//         // Total
//         const totalTd = document.createElement('td');
//         totalTd.textContent = `₦${total.toFixed(2)}`;

//         // Remove
//         const removeTd = document.createElement('td');
//         const removeBtn = document.createElement('span');
//         removeBtn.textContent = '×';
//         removeBtn.className = 'remove-btn';
//         removeBtn.addEventListener('click', () => {
//             cart.splice(index, 1);
//             localStorage.setItem('cart', JSON.stringify(cart));
//             renderCart();
//         });
//         removeTd.appendChild(removeBtn);

//         tr.append(imgTd, nameTd, priceTd, qtyTd, totalTd, removeTd);
//         tbody.appendChild(tr);
//     });

//     const grandTotal = document.getElementById('grandTotal');
//     if (grandTotal) grandTotal.textContent = grandTotalAmount.toFixed(2);

//     updateCartCount();
// }

// // Clear cart
// function clearCart() {
//     localStorage.removeItem('cart');
//     renderCart();
// }

// // Proceed to payment
// function proceedToPayment() {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     if (cart.length === 0) {
//         alert("Your cart is empty.");
//         return;
//     }
//     if (!checkAuth()) {
//         window.location.href = 'login.html';
//         return;
//     }
//     window.location.href = 'bankdetails.html';
// }

// // Listen for cart changes across tabs/pages
// window.addEventListener('storage', (e) => {
//     if (e.key === 'cart') renderCart();
// });

// /* ===== AUTH ===== */
// function checkAuth() {
//     const userStr = localStorage.getItem('user');
//     const accountDropdown = document.getElementById('accountDropdown');
//     const loginLinks = document.getElementById('loginLinks');
//     const userNameDisplay = document.getElementById('userNameDisplay');
//     if (userStr && accountDropdown && loginLinks && userNameDisplay) {
//         const user = JSON.parse(userStr);
//         accountDropdown.style.display = 'block';
//         loginLinks.style.display = 'none';
//         userNameDisplay.textContent =
//             (user.title ? user.title + ' ' : '') + (user.name || 'My Account') + ' ▾';
//         return true;
//     } else if (accountDropdown && loginLinks) {
//         accountDropdown.style.display = 'none';
//         loginLinks.style.display = 'block';
//         return false;
//     }
// }

// function signOut() {
//     localStorage.removeItem('user');
//     alert("Signed out successfully!");
//     checkAuth();
// }

// /* ===== NAV / DROPDOWNS ===== */
// function initNav() {
//     const nav = document.getElementById('header-menu');
//     const toggleBtn = document.getElementById('menu-toggle');

//     if (toggleBtn && nav) {
//         toggleBtn.addEventListener('click', () => nav.classList.toggle('open'));
//         document.querySelectorAll('.dropdown > a').forEach(drop => {
//             drop.addEventListener('click', e => {
//                 if (window.innerWidth <= 768) {
//                     e.preventDefault();
//                     drop.parentElement.classList.toggle('active');
//                 }
//             });
//         });
//     }

//     document.addEventListener('click', e => {
//         if (window.innerWidth > 768) {
//             document.querySelectorAll('.dropdown').forEach(drop => {
//                 if (drop.contains(e.target)) drop.classList.add('keep-open');
//                 else drop.classList.remove('keep-open');
//             });
//         }
//     });
// }

// /* ===== PRODUCTS ===== */
// function initProducts() {
//     document.querySelectorAll('.product-card').forEach(card => {
//         const productData = card.dataset.product ? JSON.parse(card.dataset.product) : null;
//         if (!productData) return;

//         const mainImg = card.querySelector('.main-img');
//         const gallery = card.querySelector('.thumbnail-gallery');
//         const colorSelect = card.querySelector('.color-select');
//         const addBtn = card.querySelector('.add-to-cart');
//         const sizeSelect = card.querySelector('.size-select');

//         if (!mainImg) return;

//         let mainContainer;
//         if (!mainImg.parentElement.classList.contains('main-img-container')) {
//             const wrapper = document.createElement('div');
//             wrapper.className = 'main-img-container';
//             mainImg.parentElement.replaceChild(wrapper, mainImg);
//             wrapper.appendChild(mainImg);
//             mainContainer = wrapper;
//         } else {
//             mainContainer = mainImg.parentElement;
//         }

//         function updateGallery(color) {
//             if (!gallery) return;
//             gallery.innerHTML = '';
//             const images = productData.images[color] || [];
//             let index = 0;

//             function updateMain(idx) {
//                 mainImg.src = images[idx];
//                 gallery.querySelectorAll('img').forEach((t, i) => {
//                     t.classList.toggle('selected', i === idx);
//                 });
//             }

//             images.forEach((src, i) => {
//                 const thumb = document.createElement('img');
//                 thumb.src = src;
//                 thumb.dataset.color = color;
//                 thumb.classList.toggle('selected', i === 0);
//                 thumb.addEventListener('click', () => {
//                     index = i;
//                     updateMain(index);
//                 });
//                 gallery.appendChild(thumb);
//             });

//             if (images[0]) updateMain(0);
//         }

//         updateGallery(colorSelect.value);
//         colorSelect.addEventListener('change', () => updateGallery(colorSelect.value));

//         addBtn.addEventListener('click', () => {
//             addToCart({
//                 name: productData.name,
//                 price: productData.price,
//                 image: mainImg.src,
//                 color: colorSelect.value,
//                 size: sizeSelect ? sizeSelect.value : ''
//             });
//         });

//         mainImg.addEventListener('click', () => {
//             const lightbox = document.getElementById('lightbox');
//             const lightboxImg = document.getElementById('lightbox-img');
//             if (!lightbox || !lightboxImg) return;

//             const selectedColor = colorSelect.value;
//             const currentImages = productData.images[selectedColor] || [];
//             let idx = currentImages.indexOf(mainImg.src);
//             if (idx === -1) idx = 0;

//             lightbox.style.display = 'flex';
//             lightboxImg.src = currentImages[idx];
//             lightbox.dataset.images = JSON.stringify(currentImages);
//             lightbox.dataset.index = idx;

//             updateLightboxThumbnail(currentImages, idx);
//         });
//     });
// }

// /* ===== LIGHTBOX ===== */
// function initLightbox() {
//     const lightbox = document.getElementById('lightbox');
//     const lightboxImg = document.getElementById('lightbox-img');
//     const closeBtn = document.getElementById('close-lightbox');
//     const prevBtn = document.getElementById('prev');
//     const nextBtn = document.getElementById('next');

//     if (!lightbox || !lightboxImg) return;

//     function showImage(index) {
//         const images = JSON.parse(lightbox.dataset.images || '[]');
//         if (!images.length) return;
//         index = (index + images.length) % images.length;
//         lightbox.dataset.index = index;
//         lightboxImg.src = images[index];
//         updateLightboxThumbnail(images, index);
//     }

//     function updateLightboxThumbnail(images, index) {
//         const thumbContainer = document.querySelector('.lightbox-thumbnails');
//         if (!thumbContainer) return;

//         thumbContainer.innerHTML = '';
//         images.forEach((src, i) => {
//             const thumb = document.createElement('img');
//             thumb.src = src;
//             thumb.classList.toggle('selected', i === index);
//             thumb.addEventListener('click', () => showImage(i));
//             thumbContainer.appendChild(thumb);
//         });
//     }

//     prevBtn.addEventListener('click', () => showImage(Number(lightbox.dataset.index) - 1));
//     nextBtn.addEventListener('click', () => showImage(Number(lightbox.dataset.index) + 1));

//     document.addEventListener('keydown', e => {
//         if (lightbox.style.display === 'flex') {
//             if (e.key === 'Escape') lightbox.style.display = 'none';
//             if (e.key === 'ArrowLeft') showImage(Number(lightbox.dataset.index) - 1);
//             if (e.key === 'ArrowRight') showImage(Number(lightbox.dataset.index) + 1);
//         }
//     });

//     // Swipe support
//     let touchStartX = 0;
//     let touchEndX = 0;
//     lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
//     lightbox.addEventListener('touchend', e => {
//         touchEndX = e.changedTouches[0].screenX;
//         const diff = touchEndX - touchStartX;
//         if (Math.abs(diff) > 50) {
//             if (diff > 0) showImage(Number(lightbox.dataset.index) - 1);
//             else showImage(Number(lightbox.dataset.index) + 1);
//         }
//     });

//     closeBtn.addEventListener('click', () => (lightbox.style.display = 'none'));
//     lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.style.display = 'none'; });
// }

// /* ===== INIT ===== */
// document.addEventListener('DOMContentLoaded', () => {
//     updateCartCount();
//     checkAuth();
//     initNav();
//     initProducts();
//     initLightbox();
//     renderCart();
// });





/* ===== AUTH ===== */
function checkAuth() {
    const userStr = localStorage.getItem('user');
    const accountDropdown = document.getElementById('accountDropdown');
    const loginLinks = document.getElementById('loginLinks');
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userStr && accountDropdown && loginLinks && userNameDisplay) {
        const user = JSON.parse(userStr);
        accountDropdown.style.display = 'block';
        loginLinks.style.display = 'none';
        userNameDisplay.textContent =
            (user.title ? user.title + ' ' : '') + (user.name || 'My Account') + ' ▾';
        return true;
    } else if (accountDropdown && loginLinks) {
        accountDropdown.style.display = 'none';
        loginLinks.style.display = 'block';
        return false;
    }
}

function signOut() {
    localStorage.removeItem('user');
    alert("Signed out successfully!");
    checkAuth();
}

/* ===== NAV / DROPDOWNS ===== */
function initNav() {
    const nav = document.getElementById('header-menu');
    const toggleBtn = document.getElementById('menu-toggle');

    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => nav.classList.toggle('open'));
        document.querySelectorAll('.dropdown > a').forEach(drop => {
            drop.addEventListener('click', e => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    drop.parentElement.classList.toggle('active');
                }
            });
        });
    }

    document.addEventListener('click', e => {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.dropdown').forEach(drop => {
                if (drop.contains(e.target)) drop.classList.add('keep-open');
                else drop.classList.remove('keep-open');
            });
        }
    });
}

/* ===== CART BADGE ===== */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const countEl = document.getElementById('cart-count') || document.getElementById('cartCount');
    if (countEl) countEl.textContent = totalCount;
}

/* ===== ADD TO CART ===== */
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Ensure price is a number
    product.price = parseFloat(product.price);

    // Check for duplicate (same product, size, and color)
    const existing = cart.find(item =>
        item.name === product.name &&
        item.color === product.color &&
        item.size === product.size
    );

    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to your cart!`);
}

/* ===== PRODUCTS ===== */
function initProducts() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productData = card.dataset.product ? JSON.parse(card.dataset.product) : null;
        if (!productData) return;

        const mainImg = card.querySelector('.main-img');
        const gallery = card.querySelector('.thumbnail-gallery');
        const colorSelect = card.querySelector('.color-select');
        const addBtn = card.querySelector('.add-to-cart');
        const sizeSelect = card.querySelector('.size-select');

        if (!mainImg) return;

        let mainContainer;
        if (!mainImg.parentElement.classList.contains('main-img-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'main-img-container';
            mainImg.parentElement.replaceChild(wrapper, mainImg);
            wrapper.appendChild(mainImg);
            mainContainer = wrapper;
        } else {
            mainContainer = mainImg.parentElement;
        }

        function updateGallery(color) {
            if (!gallery) return;
            gallery.innerHTML = '';
            const images = productData.images[color] || [];
            let index = 0;

            function updateMain(idx) {
                mainImg.src = images[idx];
                gallery.querySelectorAll('img').forEach((t, i) => {
                    t.classList.toggle('selected', i === idx);
                });
            }

            images.forEach((src, i) => {
                const thumb = document.createElement('img');
                thumb.src = src;
                thumb.dataset.color = color;
                thumb.classList.toggle('selected', i === 0);
                thumb.addEventListener('click', () => {
                    index = i;
                    updateMain(index);
                });
                gallery.appendChild(thumb);
            });

            if (images[0]) updateMain(0);
        }

        updateGallery(colorSelect.value);
        colorSelect.addEventListener('change', () => updateGallery(colorSelect.value));

        addBtn.addEventListener('click', () => {
            addToCart({
                name: productData.name,
                price: productData.price,
                image: mainImg.src,
                color: colorSelect.value,
                size: sizeSelect ? sizeSelect.value : ''
            });
        });

        mainImg.addEventListener('click', () => {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            if (!lightbox || !lightboxImg) return;

            const selectedColor = colorSelect.value;
            const currentImages = productData.images[selectedColor] || [];
            let idx = currentImages.indexOf(mainImg.src);
            if (idx === -1) idx = 0;

            lightbox.style.display = 'flex';
            lightboxImg.src = currentImages[idx];
            lightbox.dataset.images = JSON.stringify(currentImages);
            lightbox.dataset.index = idx;

            updateLightboxThumbnail(currentImages, idx);
        });
    });
}

/* ===== LIGHTBOX ===== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-lightbox');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    if (!lightbox || !lightboxImg) return;

    function showImage(index) {
        const images = JSON.parse(lightbox.dataset.images || '[]');
        if (!images.length) return;
        index = (index + images.length) % images.length;
        lightbox.dataset.index = index;
        lightboxImg.src = images[index];
        updateLightboxThumbnail(images, index);
    }

    function updateLightboxThumbnail(images, index) {
        const thumbContainer = document.querySelector('.lightbox-thumbnails');
        if (!thumbContainer) return;

        thumbContainer.innerHTML = '';
        images.forEach((src, i) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.classList.toggle('selected', i === index);
            thumb.addEventListener('click', () => showImage(i));
            thumbContainer.appendChild(thumb);
        });
    }

    prevBtn.addEventListener('click', () => showImage(Number(lightbox.dataset.index) - 1));
    nextBtn.addEventListener('click', () => showImage(Number(lightbox.dataset.index) + 1));

    document.addEventListener('keydown', e => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') lightbox.style.display = 'none';
            if (e.key === 'ArrowLeft') showImage(Number(lightbox.dataset.index) - 1);
            if (e.key === 'ArrowRight') showImage(Number(lightbox.dataset.index) + 1);
        }
    });

    // Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) showImage(Number(lightbox.dataset.index) - 1);
            else showImage(Number(lightbox.dataset.index) + 1);
        }
    });

    closeBtn.addEventListener('click', () => (lightbox.style.display = 'none'));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.style.display = 'none'; });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
    initNav();
    initProducts();
    initLightbox();
});
