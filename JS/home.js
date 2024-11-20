document.addEventListener('DOMContentLoaded', function() {
    const productosGrid = document.getElementById('productosGrid');
    const filtroProductos = document.getElementById('filtroProductos');
    const loginLogoutLink = document.getElementById('login-logout');
    const saludoUsuario = document.getElementById('saludo-usuario');
    const inventarioOption = document.getElementById('inventario-option');
    const usuariosOption = document.getElementById('usuarios-option');
    const cartCount = document.querySelector('.cart-count');
    const token = localStorage.getItem('token');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let count = cart.reduce((acc, item) => acc + item.cantidad, 0);

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    function mostrarSaludo() {
        const payload = JSON.parse(atob(token.split('.')[1]));
        saludoUsuario.textContent = `Hola, ${payload.nombre_usuario}`;
    }

    function manejarLoginLogout() {
        loginLogoutLink.textContent = 'Cerrar Sesión';
        loginLogoutLink.addEventListener('click', function() {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }

    function manejarOpcionesAdmin() {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rol = payload.rol;
        inventarioOption.style.display = rol === 'administrador' ? 'block' : 'none';
        usuariosOption.style.display = rol === 'administrador' ? 'block' : 'none';
    }

    function cargarProductos(filtro = 'todos') {
        let url = 'http://localhost:5000/productos';
        if (filtro !== 'todos') {
            url += `?categoria=${encodeURIComponent(filtro)}`;
        }

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            productosGrid.innerHTML = '';
            if (data.success) {
                if (data.productos.length === 0) {
                    productosGrid.innerHTML = '<p>No se encontraron productos para esta categoría.</p>';
                } else {
                    data.productos.forEach(producto => {
                        const productoDiv = document.createElement('div');
                        productoDiv.className = 'producto';
                        productoDiv.innerHTML = `
                            <img src="${producto.ubicacion_imagen}" alt="${producto.nombre}">
                            <h4>${producto.nombre}</h4>
                            <p>${producto.descripcion}</p>
                            <p>Precio: $${producto.precio}</p>
                            <button class="add-to-cart" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" data-imagen="${producto.ubicacion_imagen}" data-stock="${producto.stock}">Agregar al Carrito</button>
                        `;
                        productosGrid.appendChild(productoDiv);
                    });
                }
                actualizarContadoresCarrito();
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    filtroProductos.addEventListener('change', function() {
        const filtro = filtroProductos.value;
        cargarProductos(filtro);
    });

    function agregarAlCarrito(producto) {
        const productoExistente = cart.find(item => item.id === producto.id);
        if (productoExistente) {
            if (productoExistente.cantidad < producto.stock) {
                productoExistente.cantidad++;
            } else {
                alert('No puedes agregar más productos de los que hay en stock');
                return;
            }
        } else {
            if (producto.stock > 0) {
                cart.push({ ...producto, cantidad: 1 });
            } else {
                alert('No hay stock disponible para este producto');
                return;
            }
        }
        count++;
        cartCount.textContent = count;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function actualizarContadoresCarrito() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-nombre');
                const productPrice = parseFloat(this.getAttribute('data-precio'));
                const productImage = this.getAttribute('data-imagen');
                const productStock = parseInt(this.getAttribute('data-stock'), 10);
                agregarAlCarrito({ id: productId, nombre: productName, precio: productPrice, imagen: productImage, stock: productStock });
            });
        });
    }

    mostrarSaludo();
    manejarLoginLogout();
    manejarOpcionesAdmin();
    cartCount.textContent = count;
    cargarProductos();
});