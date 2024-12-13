const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('sticky', window.scrollY > 80);
});

// OPEN MENU
let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navlist.classList.toggle('open');
};

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navlist.classList.remove('open');
};

// SCROLLREVEAL
const sr = ScrollReveal({
    origin: 'top',
    distance: '85px',
    duration: 2500,
    reset: false,
});

sr.reveal('.home-text', { delay: 300 });
sr.reveal('.home-img', { delay: 400 });
sr.reveal('.container', { delay: 400 });

sr.reveal('.about-img', {});
sr.reveal('.about-text', { delay: 300 });

sr.reveal('.middle-text', {});
sr.reveal('.row-btn, .shop-content', { delay: 300 });

sr.reveal('.contact', { delay: 300 });

// CARRITO

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para agregar un producto al carrito
function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    // Guardar carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    updateCartDisplay();
    updateTotal();
}

// Función para actualizar el icono del carrito
function updateCartIcon() {
    const cartNumber = document.getElementById('number-carrito');
    const totalItems = cart.reduce((total, product) => total + product.quantity, 0);

    if (totalItems > 0) {
        cartNumber.textContent = totalItems;
        cartNumber.style.visibility = 'visible';
    } else {
        cartNumber.style.visibility = 'hidden';
    }
}

// Mostrar los productos del carrito en el menú desplegable
function updateCartDisplay() {
    const carritoList = document.querySelector('.carrito-list');
    carritoList.innerHTML = '';

    if (cart.length === 0) {
        carritoList.innerHTML = '<li>El carrito está vacío.</li>';
        return;
    }

    cart.forEach(product => {
        const item = document.createElement('li');
        item.classList.add('cart-item');

        item.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>Precio: $${product.price.toFixed()}</p>
                <p>Cantidad: ${product.quantity}</p>
            </div>
            <button class="remove-item" data-id="${product.id}" aria-label="Eliminar producto">
                <img src="../img/icon-trash.png" alt="Eliminar" class="icon-trash">
            </button>
        `;

        carritoList.appendChild(item);
    });

    // Agregar funcionalidad para eliminar productos
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const buttonElement = event.target.closest('.remove-item');
            if (buttonElement) {
                const productId = buttonElement.getAttribute('data-id');
                removeProductFromCart(productId);
            }
        });
    });
}

function removeProductFromCart(productId) {
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    updateCartDisplay();
    updateTotal();
}

function updateTotal() {
    const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    document.getElementById('cart-total').textContent = total.toFixed(0); // Actualizar el total
}

window.onload = () => {
    updateCartIcon();
    updateCartDisplay();
    updateTotal();
};

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const productElement = event.target.closest('.row');
        const product = {
            id: productElement.getAttribute('data-id'),
            name: productElement.getAttribute('data-name'),
            price: parseFloat(productElement.getAttribute('data-price')),
            img: productElement.getAttribute('data-img'),
        };

        addToCart(product);
    });
});

let carritoMenu = document.getElementById('cart-menu');
let carritoContent = document.querySelector('.carrito-content');

const cartButton = document.getElementById("carrito");
const closeButton = document.getElementById("close-cart");
const cartOverlay = document.getElementById("cart-overlay");

cartButton.addEventListener("click", () => {
    carritoMenu.classList.add("open");
    cartOverlay.classList.add("show");
});

closeButton.addEventListener("click", () => {
    carritoMenu.classList.remove("open");
    cartOverlay.classList.remove("show");
});

cartOverlay.addEventListener("click", () => {
    carritoMenu.classList.remove("open");
    cartOverlay.classList.remove("show");
});

// Vaciar carrito
const emptyCartButton = document.getElementById("empty-cart");

emptyCartButton.addEventListener("click", () => {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIcon();
    updateCartDisplay();
    updateTotal();
});

// Finalizar compra
document.getElementById('finalizar-compra').addEventListener('click', () => {
    const cartTotalElement = document.getElementById('cart-total');
    const total = parseFloat(cartTotalElement.textContent);
    if (!isNaN(total)) {
        localStorage.setItem('totalCompra', total);
    }
    window.location.href = './html/pago.html';
});


// Recuperar el total del localStorage
const totalCompra = localStorage.getItem('totalCompra');

// Seleccionar el lugar donde se mostrará el total
const middleText = document.querySelector('.middle-text h2');

// Mostrar el total en la página
if (totalCompra) {
    middleText.textContent += ` $${totalCompra}`;
} else {
    middleText.textContent = 'No se encontró un total de compra.';
}
