document.addEventListener('DOMContentLoaded', function() {
    const addUserForm = document.getElementById('addUserForm');
    const usersList = document.getElementById('usersList');
    const editarUsuarioModal = document.getElementById('editarUsuarioModal');
    const closeModal = document.querySelector('.close');
    const editarUserForm = document.getElementById('editarUserForm');
    const saludoUsuario = document.getElementById('saludo-usuario');
    const loginLogoutLink = document.getElementById('login-logout');
    const token = localStorage.getItem('token');
    let currentUserId = null;

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

    addUserForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre_usuario = document.getElementById('nombre_usuario').value;
        const correo = document.getElementById('correo').value;
        const contrasena = document.getElementById('contrasena').value;
        const nombre_completo = document.getElementById('nombre_completo').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const rol = document.getElementById('rol').value;

        fetch('http://localhost:5000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre_usuario,
                correo,
                contrasena,
                nombre_completo,
                telefono,
                direccion,
                rol
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Usuario agregado exitosamente');
                cargarUsuarios();
                addUserForm.reset();
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    function cargarUsuarios() {
        fetch('http://localhost:5000/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            usersList.innerHTML = '';
            if (data.success) {
                data.usuarios.forEach(usuario => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="user-info">
                            ${usuario.nombre_usuario} - ${usuario.correo} - ${usuario.rol}
                        </div>
                        <div class="user-actions">
                            <button onclick="editarUsuario(${usuario.id})">Editar</button>
                            <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                        </div>
                    `;
                    usersList.appendChild(li);
                });
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    window.editarUsuario = function(id) {
        currentUserId = id;
        fetch(`http://localhost:5000/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('edit_nombre_usuario').value = data.usuario.nombre_usuario;
                document.getElementById('edit_correo').value = data.usuario.correo;
                document.getElementById('edit_contrasena').value = data.usuario.contrasena;
                document.getElementById('edit_nombre_completo').value = data.usuario.nombre_completo;
                document.getElementById('edit_telefono').value = data.usuario.telefono;
                document.getElementById('edit_direccion').value = data.usuario.direccion;
                document.getElementById('edit_rol').value = data.usuario.rol;

                editarUsuarioModal.style.display = 'flex';
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    closeModal.addEventListener('click', function() {
        editarUsuarioModal.style.display = 'none';
    });

    editarUserForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre_usuario = document.getElementById('edit_nombre_usuario').value;
        const correo = document.getElementById('edit_correo').value;
        const contrasena = document.getElementById('edit_contrasena').value;
        const nombre_completo = document.getElementById('edit_nombre_completo').value;
        const telefono = document.getElementById('edit_telefono').value;
        const direccion = document.getElementById('edit_direccion').value;
        const rol = document.getElementById('edit_rol').value;

        fetch(`http://localhost:5000/usuarios/${currentUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre_usuario,
                correo,
                contrasena,
                nombre_completo,
                telefono,
                direccion,
                rol
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Usuario actualizado exitosamente');
                cargarUsuarios();
                editarUsuarioModal.style.display = 'none';
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    window.eliminarUsuario = function(id) {
        if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            fetch(`http://localhost:5000/usuarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Usuario eliminado exitosamente');
                    cargarUsuarios();
                } else {
                    alert(data.mensaje);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    };

    mostrarSaludo();
    manejarLoginLogout();
    cargarUsuarios();
});