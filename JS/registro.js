document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registro-form');

    registroForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre_usuario = document.getElementById('nombre_usuario').value;
        const correo = document.getElementById('correo').value;
        const contrasena = document.getElementById('contrasena').value;
        const confirmar_contrasena = document.getElementById('confirmar_contrasena').value;
        const nombre_completo = document.getElementById('nombre_completo').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;

        if (contrasena !== confirmar_contrasena) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        const registroData = {
            nombre_usuario,
            correo,
            contrasena,
            nombre_completo,
            telefono,
            direccion,
            rol: 'cliente'
        };

        fetch('http://localhost:5000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registroData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                window.location.href = 'login.html';
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => {
            console.error('Error al registrar:', error);
            alert('Hubo un problema con el registro. Intenta nuevamente.');
        });
    });
});