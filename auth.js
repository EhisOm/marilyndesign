// const user = JSON.parse(localStorage.getItem('user'));
// const token = localStorage.getItem('token');
// const navLinks = document.getElementById('nav-links');

// // 🔹 Get cart key per user
// function getUserCartKey() {
//   return user && user.username ? `cart_${user.username}` : 'cart_guest';
// }

// // 🔹 Load user’s cart
// function loadCart() {
//   const cartKey = getUserCartKey();
//   return JSON.parse(localStorage.getItem(cartKey)) || [];
// }

// // 🔹 Save user’s cart
// function saveCart(cart) {
//   const cartKey = getUserCartKey();
//   localStorage.setItem(cartKey, JSON.stringify(cart));
// }

// // 🔹 Render navigation menu
// function renderNav() {
//   if (!navLinks) return;

//   let html = `
//     <li><a href="index.html" class="nav-link">Home</a></li>
//     <li><a href="men.html" class="nav-link">Men</a></li>
//     <li><a href="women.html" class="nav-link">Women</a></li>
//     <li><a href="kids.html" class="nav-link">Kids</a></li>
//     <li><a href="about.html" class="nav-link">About Us</a></li>
//   `;

//   // 🔹 Admin link (only if role is admin)
//   if (token && user && user.role === 'admin') {
//     html += `<li><a href="/admin" class="nav-link">Admin</a></li>`;
//   }

//   // 🔹 Cart
//   let cart = loadCart();
//   const cartCount = token && user ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

//   html += `
//     <li class="cart-dropdown" style="position: relative;">
//       <a href="${token && user ? 'cart.html' : 'login.html'}" class="nav-link" style="position: relative; display: inline-block;">
//         🛒
//         <span style="
//           position: absolute;
//           top: -6px;
//           right: -10px;
//           background: red;
//           color: white;
//           font-size: 12px;
//           padding: 2px 6px;
//           border-radius: 50%;
//           font-weight: bold;
//           min-width: 20px;
//           text-align: center;
//         ">${cartCount}</span>
//       </a>
//       <div class="cart-preview" style="
//         display: none;
//         position: absolute;
//         top: 130%;
//         right: 0;
//         width: 280px;
//         max-height: 300px;
//         overflow-y: auto;
//         background: white;
//         border: 1px solid #ccc;
//         box-shadow: 0 8px 16px rgba(0,0,0,0.2);
//         border-radius: 4px;
//         z-index: 10000;
//         padding: 10px;
//       ">
//         ${token && user
//       ? cart.length
//         ? cart.map(item => `
//                 <div style="display:flex; align-items:center; margin-bottom:8px;">
//                   <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; margin-right:10px; border-radius:4px;">
//                   <div>
//                     <div style="font-weight:bold;">${item.name}</div>
//                     <div>Quantity: ${item.quantity}</div>
//                   </div>
//                 </div>
//               `).join('')
//         : '<div>Your cart is empty</div>'
//       : '<div>Login to view your cart</div>'
//     }
//         ${token && user ? `<a href="cart.html" style="display:block; text-align:center; margin-top:10px; font-weight:bold; color:blue; text-decoration:none;">View Cart</a>` : ''}
//       </div>
//     </li>
//   `;

//   // 🔹 User dropdown
//   if (token && user) {
//     const firstName = user.name?.split(' ')[0] || user.username;
//     html += `
//       <li class="welcome-dropdown nav-link" style="position:relative; cursor:pointer; color:green;">
//         ${user.title || ''} ${firstName}
//         <div class="dropdown-content" style="
//           display:none;
//           position:absolute;
//           top:100%;
//           left:0;
//           background:#fff;
//           box-shadow:0 8px 16px rgba(0,0,0,0.2);
//           min-width:120px;
//           border-radius:4px;
//           overflow:hidden;
//           z-index:1000;
//         ">
//           <a href="profile.html" style="
//             display:block;
//             padding:8px 12px;
//             text-decoration:none;
//             color:black;
//             background:white;
//           ">Profile</a>
//           <button id="signOutBtn" style="
//             background:none;
//             border:none;
//             width:100%;
//             padding:8px 12px;
//             text-align:left;
//             cursor:pointer;
//             color:red;
//           ">Sign Out</button>
//         </div>
//       </li>
//     `;
//   } else {
//     html += `
//       <li><a href="login.html" class="nav-link">Login</a></li>
//       <li><a href="register.html" class="nav-link">Register</a></li>
//     `;
//   }

//   navLinks.innerHTML = html;

//   // 🔹 Dropdown hover
//   const welcomeDropdown = navLinks.querySelector('.welcome-dropdown');
//   if (welcomeDropdown) {
//     const dropdown = welcomeDropdown.querySelector('.dropdown-content');

//     welcomeDropdown.addEventListener('mouseenter', () => {
//       dropdown.style.display = 'block';
//     });
//     welcomeDropdown.addEventListener('mouseleave', () => {
//       dropdown.style.display = 'none';
//     });

//     const signOutBtn = document.getElementById('signOutBtn');
//     if (signOutBtn) {
//       signOutBtn.addEventListener('click', () => {
//         saveCart(loadCart()); // save cart before logging out
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');

//         // 🔹 Make sure logout affects ALL pages
//         window.location.href = 'login.html';
//       });
//     }
//   }

//   // 🔹 Cart hover preview
//   const cartDropdown = navLinks.querySelector('.cart-dropdown');
//   if (cartDropdown) {
//     const cartPreview = cartDropdown.querySelector('.cart-preview');
//     cartDropdown.addEventListener('mouseenter', () => {
//       cartPreview.style.display = 'block';
//     });
//     cartDropdown.addEventListener('mouseleave', () => {
//       cartPreview.style.display = 'none';
//     });
//   }
// }

// // Run nav on load
// renderNav();
// document.addEventListener('DOMContentLoaded', renderNav);








// 🔹 Get user and token from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
const navLinks = document.getElementById('nav-links');

// 🔹 Get cart key per user
function getUserCartKey() {
  return user && user.username ? `cart_${user.username}` : 'cart_guest';
}

// 🔹 Load user’s cart
function loadCart() {
  const cartKey = getUserCartKey();
  return JSON.parse(localStorage.getItem(cartKey)) || [];
}

// 🔹 Save user’s cart
function saveCart(cart) {
  const cartKey = getUserCartKey();
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

// 🔹 Render navigation menu
function renderNav() {
  if (!navLinks) return;

  let html = `
    <li><a href="index.html" class="nav-link">Home</a></li>
    <li><a href="men.html" class="nav-link">Men</a></li>
    <li><a href="women.html" class="nav-link">Women</a></li>
    <li><a href="kids.html" class="nav-link">Kids</a></li>
    <li><a href="about.html" class="nav-link">About Us</a></li>
  `;

  // 🔹 Admin link
  if (token && user && user.role === 'admin') {
    html += `<li><a href="/admin" class="nav-link">Admin</a></li>`;
  }

  // 🔹 Cart
  const cart = loadCart();
  const cartCount = token && user ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  html += `
    <li class="cart-dropdown" style="position: relative;">
      <a href="${token && user ? 'cart.html' : 'login.html'}" class="nav-link" style="position: relative; display: inline-block;">
        🛒
        <span style="
          position: absolute;
          top: -6px;
          right: -10px;
          background: red;
          color: white;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 50%;
          font-weight: bold;
          min-width: 20px;
          text-align: center;
        ">${cartCount}</span>
      </a>
      <div class="cart-preview" style="
        display: none;
        position: absolute;
        top: 130%;
        right: 0;
        width: 280px;
        max-height: 300px;
        overflow-y: auto;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        border-radius: 4px;
        z-index: 10000;
        padding: 10px;
      ">
        ${token && user
      ? cart.length
        ? cart.map(item => `
                <div style="display:flex; align-items:center; margin-bottom:8px;">
                  <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; margin-right:10px; border-radius:4px;">
                  <div>
                    <div style="font-weight:bold;">${item.name}</div>
                    <div>Quantity: ${item.quantity}</div>
                  </div>
                </div>
              `).join('')
        : '<div>Your cart is empty</div>'
      : '<div>Login to view your cart</div>'
    }
        ${token && user ? `<a href="cart.html" style="display:block; text-align:center; margin-top:10px; font-weight:bold; color:blue; text-decoration:none;">View Cart</a>` : ''}
      </div>
    </li>
  `;

  // 🔹 User dropdown
  if (token && user) {
    const firstName = user.name?.split(' ')[0] || user.username;
    html += `
      <li class="welcome-dropdown nav-link" style="position:relative; cursor:pointer; color:green;">
        ${user.title || ''} ${firstName}
        <div class="dropdown-content" style="
          display:none;
          position:absolute;
          top:100%;
          left:0;
          background:#fff;
          box-shadow:0 8px 16px rgba(0,0,0,0.2);
          min-width:120px;
          border-radius:4px;
          overflow:hidden;
          z-index:1000;
        ">
          <a href="profile.html" style="
            display:block;
            padding:8px 12px;
            text-decoration:none;
            color:black;
            background:white;
          ">Profile</a>
          <button id="signOutBtn" style="
            background:none;
            border:none;
            width:100%;
            padding:8px 12px;
            text-align:left;
            cursor:pointer;
            color:red;
          ">Sign Out</button>
        </div>
      </li>
    `;
  } else {
    html += `
      <li><a href="login.html" class="nav-link">Login</a></li>
      <li><a href="register.html" class="nav-link">Register</a></li>
    `;
  }

  navLinks.innerHTML = html;

  // 🔹 Dropdown hover
  const welcomeDropdown = navLinks.querySelector('.welcome-dropdown');
  if (welcomeDropdown) {
    const dropdown = welcomeDropdown.querySelector('.dropdown-content');
    welcomeDropdown.addEventListener('mouseenter', () => dropdown.style.display = 'block');
    welcomeDropdown.addEventListener('mouseleave', () => dropdown.style.display = 'none');

    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', () => {
        saveCart(loadCart()); // save cart before logging out
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      });
    }
  }

  // 🔹 Cart hover preview
  const cartDropdown = navLinks.querySelector('.cart-dropdown');
  if (cartDropdown) {
    const cartPreview = cartDropdown.querySelector('.cart-preview');
    cartDropdown.addEventListener('mouseenter', () => cartPreview.style.display = 'block');
    cartDropdown.addEventListener('mouseleave', () => cartPreview.style.display = 'none');
  }
}

// 🔹 Initialize nav on page load
renderNav();
document.addEventListener('DOMContentLoaded', renderNav);
