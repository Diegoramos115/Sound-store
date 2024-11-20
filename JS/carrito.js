document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCount = document.querySelector('.cart-count');
    const saludoUsuario = document.getElementById('saludo-usuario');
    const loginLogoutLink = document.getElementById('login-logout');
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en el localStorage

    // Verificar si el token está presente
    if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión.');
        window.location.href = 'login.html'; // Redirigir al login si no hay token
        return;
    }

    // Cargar el carrito desde el localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para mostrar el saludo al usuario
    function mostrarSaludo() {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificamos el JWT
        saludoUsuario.textContent = `Hola, ${payload.nombre_usuario}`;
    }

    // Función para manejar el enlace de login/logout
    function manejarLoginLogout() {
        if (token) {
            loginLogoutLink.textContent = 'Cerrar Sesión';
            loginLogoutLink.addEventListener('click', function() {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            });
        } else {
            loginLogoutLink.textContent = 'Iniciar Sesión';
            loginLogoutLink.setAttribute('href', 'login.html');
        }
    }

    // Función para mostrar u ocultar opciones dependiendo del rol del usuario
    function manejarOpcionesAdmin() {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificamos el JWT
        const rol = payload.rol;
        const inventarioOption = document.getElementById('inventario-option');
        const usuariosOption = document.getElementById('usuarios-option');
        if (rol === 'administrador') {
            inventarioOption.style.display = 'block';
            usuariosOption.style.display = 'block';
        } else {
            inventarioOption.style.display = 'none';
            usuariosOption.style.display = 'none';
        }
    }

    // Función para actualizar el contador del carrito
    function actualizarContadorCarrito() {
        let count = cart.reduce((acc, item) => acc + item.cantidad, 0);
        cartCount.textContent = count;
    }

    // Función para calcular el total del carrito
    function calcularTotalCarrito() {
        let total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        cartTotal.textContent = total.toFixed(2);
    }

    // Función para guardar el carrito en el localStorage
    function guardarCarrito() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Función para renderizar los items del carrito
    function renderizarCarrito() {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-details">
                    <h4>${item.nombre}</h4>
                    <p>Precio: $${item.precio}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="eliminarItem(${index})">Eliminar</button>
            `;
            cartItems.appendChild(div);
        });
        calcularTotalCarrito();
        actualizarContadorCarrito();
    }

    // Función para cambiar la cantidad de un item en el carrito
    window.cambiarCantidad = function(index, change) {
        if (cart[index].cantidad + change > 0 && cart[index].cantidad + change <= cart[index].stock) {
            cart[index].cantidad += change;
            guardarCarrito();
            renderizarCarrito();
        } else if (cart[index].cantidad + change > cart[index].stock) {
            alert('No puedes agregar más productos de los que hay en stock');
        }
    };

    // Función para eliminar un item del carrito
    window.eliminarItem = function(index) {
        cart.splice(index, 1);
        guardarCarrito();
        renderizarCarrito();
    };

    // Función para cerrar sesión
    function logout() {
        localStorage.removeItem('token'); // Eliminar el token del localStorage
        window.location.href = 'login.html'; // Redirigir al login
    }
    window.logout = logout; // Hacer la función accesible globalmente

    // Inicializar el carrito
    renderizarCarrito();

    // Evento para el botón de ir a pagar
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('El carrito está vacío. No puedes proceder al pago.');
        } else {
            window.location.href = 'pagos.html'; // Redirigir a la página de pagos
        }
    });

    // Mostrar el saludo al usuario
    mostrarSaludo();

    // Mostrar u ocultar opciones de admin
    manejarOpcionesAdmin();

    // Actualizar el contador del carrito al cargar la página
    actualizarContadorCarrito();
});