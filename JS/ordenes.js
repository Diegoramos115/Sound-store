document.addEventListener('DOMContentLoaded', function() {
    const ordenesContainer = document.getElementById('ordenes');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión.');
        window.location.href = 'login.html';
        return;
    }

    function mostrarSaludo() {
        const payload = JSON.parse(atob(token.split('.')[1]));
        document.getElementById('saludo-usuario').textContent = `Hola, ${payload.nombre_usuario}`;
    }

    function manejarLoginLogout() {
        const loginLogoutLink = document.getElementById('login-logout');
        loginLogoutLink.textContent = 'Cerrar Sesión';
        loginLogoutLink.addEventListener('click', function() {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }

    function manejarOpcionesAdmin() {
        const payload = JSON.parse(atob(token.split('.')[1]));
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

    function cargarOrdenes() {
        fetch('http://127.0.0.1:5000/api/ordenes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarOrdenes(data.ordenes);
            } else {
                alert(`Error al cargar las órdenes: ${data.mensaje}`);
            }
        })
        .catch(error => {
            console.error('Error al cargar las órdenes:', error);
            alert('Hubo un error al cargar las órdenes.');
        });
    }

    function mostrarOrdenes(ordenes) {
        ordenesContainer.innerHTML = '';
        ordenes.forEach(orden => {
            const div = document.createElement('div');
            div.className = 'orden';
            div.innerHTML = `
                <h3>Orden #${orden.id}</h3>
                <p>Estado: ${orden.estado}</p>
                <p>Monto Total: $${orden.monto_total}</p>
                <p>Actualizado en: ${new Date(orden.actualizado_en).toLocaleString()}</p>
            `;
            ordenesContainer.appendChild(div);
        });
    }

    mostrarSaludo();
    manejarLoginLogout();
    manejarOpcionesAdmin();
    cargarOrdenes();
});