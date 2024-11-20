document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    const productosList = document.getElementById('productosList');
    const editarProductoModal = document.getElementById('editarProductoModal');
    const closeModal = document.querySelector('.close');
    const editarProductForm = document.getElementById('editarProductForm');
    const saludoUsuario = document.getElementById('saludo-usuario');
    const loginLogoutLink = document.getElementById('login-logout');
    const token = localStorage.getItem('token');
    let currentProductId = null;

    if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión.');
        window.location.href = 'login.html';
        return;
    }

    function mostrarSaludo() {
        const payload = JSON.parse(atob(token.split('.')[1]));
        saludoUsuario.textContent = `Hola, ${payload.nombre_usuario}`;
    }

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

    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;
        const stock = document.getElementById('stock').value;
        const ubicacion_imagen = document.getElementById('ubicacion_imagen').value;
        const categoria = document.getElementById('categoria').value;

        fetch('http://localhost:5000/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                stock: stock,
                ubicacion_imagen: ubicacion_imagen,
                categoria: categoria
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Producto agregado exitosamente');
                cargarProductos();
                addProductForm.reset();
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function cargarProductos() {
        fetch('http://localhost:5000/productos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            productosList.innerHTML = '';
            if (data.success) {
                data.productos.forEach(producto => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="product-info">
                            ${producto.nombre} - $${producto.precio} - ${producto.categoria}
                        </div>
                        <div class="product-actions">
                            <button onclick="editarProducto(${producto.id})">Editar</button>
                            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                        </div>
                    `;
                    productosList.appendChild(li);
                });
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    window.editarProducto = function(id) {
        currentProductId = id;
        fetch(`http://localhost:5000/productos/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById('edit_nombre').value = data.producto.nombre;
                document.getElementById('edit_descripcion').value = data.producto.descripcion;
                document.getElementById('edit_precio').value = data.producto.precio;
                document.getElementById('edit_stock').value = data.producto.stock;
                document.getElementById('edit_ubicacion_imagen').value = data.producto.ubicacion_imagen;
                document.getElementById('edit_categoria').value = data.producto.categoria;
                editarProductoModal.style.display = 'flex';
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    closeModal.addEventListener('click', function() {
        editarProductoModal.style.display = 'none';
    });

    editarProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('edit_nombre').value;
        const descripcion = document.getElementById('edit_descripcion').value;
        const precio = document.getElementById('edit_precio').value;
        const stock = document.getElementById('edit_stock').value;
        const ubicacion_imagen = document.getElementById('edit_ubicacion_imagen').value;
        const categoria = document.getElementById('edit_categoria').value;

        fetch(`http://localhost:5000/productos/${currentProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                precio: precio,
                stock: stock,
                ubicacion_imagen: ubicacion_imagen,
                categoria: categoria
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Producto actualizado exitosamente');
                cargarProductos();
                editarProductoModal.style.display = 'none';
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    window.eliminarProducto = function(id) {
        if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            fetch(`http://localhost:5000/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Producto eliminado exitosamente');
                    cargarProductos();
                } else {
                    alert(data.mensaje);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };

    mostrarSaludo();
    manejarLoginLogout();
    cargarProductos();
});